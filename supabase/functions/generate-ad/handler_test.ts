import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { type Deps, handle } from './handler.ts';
import { DIRECTIONS } from '../_shared/prompt.ts';
import type { AdVariation, GenerationRow } from '../_shared/types.ts';

const OWNER = 'owner-uuid';
const ORIGIN = 'https://lenoborges.com.br';

const goodBody = {
  theme: 'Aula de funções no ar no Kit de Ensino',
  format: 'story',
  network: 'instagram',
  lang: 'en',
  withBackground: false,
};

const art = (title: string) =>
  `<div style="width:1080px;height:1920px;background:#1C1C1E"><img src="{{LOGO_URL}}" alt=""><h1 style="color:#F2F3F5">${title}</h1></div>`;

const clean = (n: number): AdVariation => ({
  angle: `angulo ${n}`,
  slides: [{ kicker: 'Kit de Ensino', title: `Funcoes em pratica ${n}`, body: 'Nove aulas no ar.', cta: 'Veja o kit', html: art(`Funcoes em pratica ${n}`) }],
  caption: 'Nove aulas no ar. Veja o kit no link da bio.',
  hashtags: ['#java', '#barrie'],
});

/** Variacao com travessao e emoji na peca (e no HTML) e cliche no texto sugerido. */
const dirty = (n: number): AdVariation => ({
  ...clean(n),
  slides: [{ ...clean(n).slides[0], title: 'O jogo virou — de vez 🚀', html: art('O jogo virou — de vez 🚀') }],
  caption: 'Hora de virar o jogo — sem mais delongas',
});

const textReply = (obj: unknown) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] }));
const imageReply = () =>
  new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: btoa('PNG') } }] } }],
    }),
  );

interface TextCall {
  /** Qual das 3 direcoes (0, 1 ou 2) esta chamada pediu. */
  direction: number;
  /** 1 na primeira tentativa daquela direcao, 2 na segunda. */
  attempt: number;
  user: string;
}

type Reply = (call: TextCall) => Response;

interface Harness {
  deps: Deps;
  textCalls: TextCall[];
  imageCalls: number;
  saved: GenerationRow[];
  uploads: { path: string; mimeType: string }[];
}

function harness(reply: Reply, overrides: Partial<Deps> = {}): Harness {
  const h: Harness = { textCalls: [], imageCalls: 0, saved: [], uploads: [], deps: undefined as never };
  const attempts = [0, 0, 0];
  h.deps = {
    env: {
      GEMINI_API_KEY: 'k',
      GEMINI_MODEL: 'text-model',
      GEMINI_THINKING_LEVEL: 'medium',
      GEMINI_IMAGE_MODEL: 'image-model',
      OWNER_USER_ID: OWNER,
    },
    fetch: ((url: string | URL | Request, init?: RequestInit) => {
      if (String(url).includes('image-model')) {
        h.imageCalls++;
        return Promise.resolve(imageReply());
      }
      const user: string = JSON.parse(String(init?.body)).contents[0].parts[0].text;
      const direction = DIRECTIONS.findIndex((d) => user.includes(d));
      const call = { direction, attempt: ++attempts[direction], user };
      h.textCalls.push(call);
      return Promise.resolve(reply(call));
    }) as typeof fetch,
    getUserId: (token) => Promise.resolve(token === 'dono' ? OWNER : token === 'outro' ? 'intruso' : null),
    saveGeneration: (row) => {
      h.saved.push(row);
      return Promise.resolve({ ...row, created_at: '2026-11-23T00:00:00Z' });
    },
    uploadBackground: (path, _bytes, mimeType) => {
      h.uploads.push({ path, mimeType });
      return Promise.resolve();
    },
    newId: () => 'gen-1',
    ...overrides,
  };
  return h;
}

const allClean: Reply = ({ direction }) => textReply(clean(direction + 1));

function req(body: unknown, { token = 'dono', origin = ORIGIN, method = 'POST' } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (origin) headers.origin = origin;
  if (token) headers.authorization = `Bearer ${token}`;
  return new Request('https://x.supabase.co/functions/v1/generate-ad', {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
}

// --- CORS ---

Deno.test('preflight de origem permitida responde 204 com os headers de CORS', async () => {
  for (const origin of ['http://localhost:4200', 'https://lenoborges.com.br', 'https://www.lenoborges.com.br']) {
    const res = await handle(req(null, { method: 'OPTIONS', origin }), harness(allClean).deps);
    assertEquals(res.status, 204);
    assertEquals(res.headers.get('access-control-allow-origin'), origin);
    assertStringIncludes(res.headers.get('access-control-allow-headers') ?? '', 'authorization');
  }
});

Deno.test('origem fora da lista e recusada, inclusive no preflight', async () => {
  const pre = await handle(req(null, { method: 'OPTIONS', origin: 'https://evil.example' }), harness(allClean).deps);
  assertEquals(pre.status, 403);
  assertEquals(pre.headers.get('access-control-allow-origin'), null);
  const post = await handle(req(goodBody, { origin: 'https://evil.example' }), harness(allClean).deps);
  assertEquals(post.status, 403);
});

// --- autenticacao e entrada ---

Deno.test('sem token ou com token invalido: 401, e o Gemini nunca e chamado', async () => {
  const h = harness(allClean);
  assertEquals((await handle(req(goodBody, { token: '' }), h.deps)).status, 401);
  assertEquals((await handle(req(goodBody, { token: 'lixo' }), h.deps)).status, 401);
  assertEquals(h.textCalls.length, 0);
});

Deno.test('usuario que nao e o dono: 403, e o Gemini nunca e chamado', async () => {
  const h = harness(allClean);
  assertEquals((await handle(req(goodBody, { token: 'outro' }), h.deps)).status, 403);
  assertEquals(h.textCalls.length, 0);
  assertEquals(h.saved.length, 0);
});

Deno.test('entrada invalida: 422 com mensagem em portugues', async () => {
  const h = harness(allClean);
  const res = await handle(req({ ...goodBody, theme: 'a' }), h.deps);
  assertEquals(res.status, 422);
  assert(typeof (await res.json()).error === 'string');
  assertEquals(h.textCalls.length, 0);
});

Deno.test('corpo que nao e JSON: 422; metodo GET: 405', async () => {
  const bad = new Request('https://x/functions/v1/generate-ad', {
    method: 'POST',
    headers: { origin: ORIGIN, authorization: 'Bearer dono' },
    body: 'nao e json',
  });
  assertEquals((await handle(bad, harness(allClean).deps)).status, 422);
  const get = new Request('https://x/functions/v1/generate-ad', {
    method: 'GET',
    headers: { origin: ORIGIN, authorization: 'Bearer dono' },
  });
  assertEquals((await handle(get, harness(allClean).deps)).status, 405);
});

// --- sucesso: 3 direcoes em paralelo ---

Deno.test('sucesso: uma chamada por direcao, 3 variacoes na ordem das direcoes, gravadas para o dono', async () => {
  const h = harness(allClean);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('access-control-allow-origin'), ORIGIN);
  const { generation } = await res.json();
  assertEquals(generation.variations.map((v: AdVariation) => v.angle), ['angulo 1', 'angulo 2', 'angulo 3']);
  assertEquals(generation.variations[0].slides[0].html, art('Funcoes em pratica 1'));
  assertEquals(h.textCalls.map((c) => c.direction).sort(), [0, 1, 2]);
  assertEquals(h.saved[0].owner_id, OWNER);
  assertEquals(h.saved[0].model, 'text-model');
  assertEquals(h.imageCalls, 0);
});

Deno.test('o prompt enviado leva o guia da rede escolhida', async () => {
  const h = harness(allClean);
  await handle(req({ ...goodBody, network: 'linkedin' }), h.deps);
  assertStringIncludes(h.textCalls[0].user, 'LinkedIn');
});

// --- verificador: retry e correcao, por variacao ---

Deno.test('violacao numa variacao: so ela e pedida de novo, com a lista do que violou', async () => {
  const h = harness(({ direction, attempt }) =>
    textReply(direction === 0 && attempt === 1 ? dirty(1) : clean(direction + 1)),
  );
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.textCalls.length, 4);
  const retry = h.textCalls.find((c) => c.attempt === 2)!;
  assertEquals(retry.direction, 0);
  assertStringIncludes(retry.user, 'travessão');
  const { generation } = await res.json();
  assertEquals(generation.variations[0].warnings, undefined);
});

Deno.test('violacao persistente: corrige as pecas e o HTML sozinha e marca o texto sugerido em warnings', async () => {
  const h = harness(({ direction }) => textReply(dirty(direction + 1)));
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.textCalls.length, 6, 'uma nova tentativa por direcao');
  const { generation } = await res.json();
  const v = generation.variations[0];
  assertEquals(v.slides[0].title, 'O jogo virou, de vez');
  assert(!/[—–]|\p{Extended_Pictographic}/u.test(JSON.stringify(v.slides)));
  assertStringIncludes(v.slides[0].html, '<h1 style="color:#F2F3F5">O jogo virou, de vez</h1>');
  assert(v.warnings.length > 0, 'o cliche continua visivel como aviso');
  assertEquals(v.caption, 'Hora de virar o jogo — sem mais delongas', 'o texto sugerido nao e reescrito');
});

Deno.test('HTML inseguro: pede de novo; se insistir, a variacao e descartada', async () => {
  const unsafe = (n: number) => ({ ...clean(n), slides: [{ ...clean(n).slides[0], html: '<div><script>alert(1)</script></div>' }] });
  const h = harness(({ direction }) => textReply(direction === 1 ? unsafe(2) : clean(direction + 1)));
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  const calls1 = h.textCalls.filter((c) => c.direction === 1);
  assertEquals(calls1.length, 2);
  assertStringIncludes(calls1[1].user, 'script');
  const { generation } = await res.json();
  assertEquals(generation.variations.map((v: AdVariation) => v.angle), ['angulo 1', 'angulo 3']);
  assert(!JSON.stringify(generation).includes('<script'));
});

Deno.test('JSON fora do schema numa direcao: tenta de novo e, se insistir, segue com as outras', async () => {
  const h = harness(({ direction }) => textReply(direction === 2 ? { angle: 'sem slides' } : clean(direction + 1)));
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.textCalls.filter((c) => c.direction === 2).length, 2);
  assertEquals((await res.json()).generation.variations.length, 2);
});

Deno.test('nenhuma direcao deu certo: 502 em portugues, sem vazar detalhe nem gravar', async () => {
  const h = harness(() => new Response(JSON.stringify({ error: { message: 'boom k' } }), { status: 500 }));
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 502);
  const { error } = await res.json();
  assert(!error.includes('boom'));
  assertEquals(h.saved.length, 0);
});

// --- fundo ---

Deno.test('com fundo: gera a imagem uma vez, envia para <dono>/backgrounds/<id>.png e grava o caminho', async () => {
  const h = harness(allClean);
  const res = await handle(req({ ...goodBody, withBackground: true }), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.imageCalls, 1);
  assertEquals(h.uploads, [{ path: `${OWNER}/backgrounds/gen-1.png`, mimeType: 'image/png' }]);
  assertEquals(h.saved[0].background_path, `${OWNER}/backgrounds/gen-1.png`);
});

Deno.test('se so o fundo falhar, a geracao sai sem fundo (nao perde o texto)', async () => {
  const h = harness(allClean, { uploadBackground: () => Promise.reject(new Error('storage fora do ar')) });
  const res = await handle(req({ ...goodBody, withBackground: true }), h.deps);
  assertEquals(res.status, 200);
  const { generation, backgroundError } = await res.json();
  assertEquals(generation.background_path, null);
  assert(typeof backgroundError === 'string');
});
