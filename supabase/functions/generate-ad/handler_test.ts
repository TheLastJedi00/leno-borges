import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { type Deps, handle } from './handler.ts';
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

const clean = (n: number): AdVariation => ({
  angle: `angulo ${n}`,
  slides: [{ kicker: 'Kit de Ensino', title: `Funcoes em pratica ${n}`, body: 'Nove aulas no ar.', cta: 'Veja o kit' }],
  caption: 'Nove aulas no ar. Veja o kit no link da bio.',
  hashtags: ['#java', '#barrie'],
});
const cleanSet = () => ({ variations: [clean(1), clean(2), clean(3)] });

function dirtySet() {
  const set = cleanSet();
  set.variations[0].slides[0].title = 'O jogo virou — de vez 🚀';
  set.variations[1].caption = 'Hora de virar o jogo — sem mais delongas';
  return set;
}

const textReply = (obj: unknown) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] }));
const imageReply = () =>
  new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: btoa('PNG') } }] } }],
    }),
  );

interface Harness {
  deps: Deps;
  textCalls: { user: string }[];
  imageCalls: number;
  saved: GenerationRow[];
  uploads: { path: string; mimeType: string }[];
}

function harness(textResponses: Array<() => Response>, overrides: Partial<Deps> = {}): Harness {
  const h: Harness = { textCalls: [], imageCalls: 0, saved: [], uploads: [], deps: undefined as never };
  let i = 0;
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
      const body = JSON.parse(String(init?.body));
      h.textCalls.push({ user: body.contents[0].parts[0].text });
      const make = textResponses[Math.min(i++, textResponses.length - 1)];
      return Promise.resolve(make());
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
    const res = await handle(req(null, { method: 'OPTIONS', origin }), harness([]).deps);
    assertEquals(res.status, 204);
    assertEquals(res.headers.get('access-control-allow-origin'), origin);
    assertStringIncludes(res.headers.get('access-control-allow-headers') ?? '', 'authorization');
  }
});

Deno.test('origem fora da lista e recusada, inclusive no preflight', async () => {
  const pre = await handle(req(null, { method: 'OPTIONS', origin: 'https://evil.example' }), harness([]).deps);
  assertEquals(pre.status, 403);
  assertEquals(pre.headers.get('access-control-allow-origin'), null);
  const post = await handle(req(goodBody, { origin: 'https://evil.example' }), harness([]).deps);
  assertEquals(post.status, 403);
});

Deno.test('a resposta de sucesso devolve o CORS da origem', async () => {
  const res = await handle(req(goodBody), harness([() => textReply(cleanSet())]).deps);
  assertEquals(res.headers.get('access-control-allow-origin'), ORIGIN);
});

// --- autenticacao ---

Deno.test('sem token ou com token invalido: 401, e o Gemini nunca e chamado', async () => {
  const h = harness([() => textReply(cleanSet())]);
  assertEquals((await handle(req(goodBody, { token: '' }), h.deps)).status, 401);
  assertEquals((await handle(req(goodBody, { token: 'lixo' }), h.deps)).status, 401);
  assertEquals(h.textCalls.length, 0);
});

Deno.test('usuario que nao e o dono: 403, e o Gemini nunca e chamado', async () => {
  const h = harness([() => textReply(cleanSet())]);
  const res = await handle(req(goodBody, { token: 'outro' }), h.deps);
  assertEquals(res.status, 403);
  assertEquals(h.textCalls.length, 0);
  assertEquals(h.saved.length, 0);
});

// --- entrada ---

Deno.test('entrada invalida: 422 com mensagem em portugues', async () => {
  const h = harness([() => textReply(cleanSet())]);
  const res = await handle(req({ ...goodBody, theme: 'a' }), h.deps);
  assertEquals(res.status, 422);
  const { error } = await res.json();
  assert(typeof error === 'string' && error.length > 0);
  assertEquals(h.textCalls.length, 0);
});

Deno.test('corpo que nao e JSON: 422', async () => {
  const r = new Request('https://x/functions/v1/generate-ad', {
    method: 'POST',
    headers: { origin: ORIGIN, authorization: 'Bearer dono' },
    body: 'nao e json',
  });
  assertEquals((await handle(r, harness([]).deps)).status, 422);
});

Deno.test('metodo diferente de POST e OPTIONS: 405', async () => {
  const r = new Request('https://x/functions/v1/generate-ad', {
    method: 'GET',
    headers: { origin: ORIGIN, authorization: 'Bearer dono' },
  });
  assertEquals((await handle(r, harness([]).deps)).status, 405);
});

// --- sucesso ---

Deno.test('sucesso: 3 variacoes gravadas para o dono, com o modelo usado', async () => {
  const h = harness([() => textReply(cleanSet())]);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  const { generation } = await res.json();
  assertEquals(generation.id, 'gen-1');
  assertEquals(generation.variations.length, 3);
  assertEquals(generation.model, 'text-model');
  assertEquals(h.saved.length, 1);
  assertEquals(h.saved[0].owner_id, OWNER);
  assertEquals(h.saved[0].slide_count, 1);
  assertEquals(h.saved[0].background_path, null);
  assertEquals(h.textCalls.length, 1);
  assertEquals(h.imageCalls, 0);
});

Deno.test('o prompt enviado leva o guia da rede escolhida', async () => {
  const h = harness([() => textReply(cleanSet())]);
  await handle(req({ ...goodBody, network: 'linkedin' }), h.deps);
  assertStringIncludes(h.textCalls[0].user, 'LinkedIn');
});

// --- verificador: retry e correcao ---

Deno.test('violacao na primeira resposta: pede de novo uma vez, listando o que violou', async () => {
  const h = harness([() => textReply(dirtySet()), () => textReply(cleanSet())]);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.textCalls.length, 2);
  assertStringIncludes(h.textCalls[1].user, 'travessão');
  assertStringIncludes(h.textCalls[1].user, 'jogo');
  const { generation } = await res.json();
  assertEquals(generation.variations[0].warnings ?? [], []);
});

Deno.test('violacao persistente: corrige as pecas sozinha e marca o texto sugerido em warnings', async () => {
  const h = harness([() => textReply(dirtySet())]);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.textCalls.length, 2, 'so uma nova tentativa');
  const { generation } = await res.json();
  const [v0, v1] = generation.variations;
  assertEquals(v0.slides[0].title, 'O jogo virou, de vez');
  assert(!/[—–]|\p{Extended_Pictographic}/u.test(JSON.stringify(v0.slides)));
  assert(v1.warnings.length > 0, 'o cliche da legenda vira aviso');
  assertEquals(v1.caption, 'Hora de virar o jogo — sem mais delongas', 'o texto sugerido nao e reescrito');
});

Deno.test('JSON fora do schema: tenta uma vez de novo e depois devolve 502', async () => {
  const h = harness([() => textReply({ variations: [clean(1)] })]);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 502);
  assertEquals(h.textCalls.length, 2);
  assertEquals(h.saved.length, 0);
});

Deno.test('schema invalido na 1a e valido na 2a: sucesso', async () => {
  const h = harness([() => textReply({ variations: [] }), () => textReply(cleanSet())]);
  assertEquals((await handle(req(goodBody), h.deps)).status, 200);
});

Deno.test('falha do Gemini: 502 em portugues, sem vazar a chave nem gravar nada', async () => {
  const h = harness([() => new Response(JSON.stringify({ error: { message: 'boom k' } }), { status: 500 })]);
  const res = await handle(req(goodBody), h.deps);
  assertEquals(res.status, 502);
  const { error } = await res.json();
  assert(!error.includes('boom'));
  assertEquals(h.saved.length, 0);
});

// --- fundo ---

Deno.test('com fundo: gera a imagem uma vez, envia para <dono>/backgrounds/<id>.png e grava o caminho', async () => {
  const h = harness([() => textReply(cleanSet())]);
  const res = await handle(req({ ...goodBody, withBackground: true }), h.deps);
  assertEquals(res.status, 200);
  assertEquals(h.imageCalls, 1);
  assertEquals(h.uploads, [{ path: `${OWNER}/backgrounds/gen-1.png`, mimeType: 'image/png' }]);
  assertEquals(h.saved[0].background_path, `${OWNER}/backgrounds/gen-1.png`);
});

Deno.test('se so o fundo falhar, a geracao sai sem fundo (nao perde o texto)', async () => {
  const h = harness([() => textReply(cleanSet())], {
    uploadBackground: () => Promise.reject(new Error('storage fora do ar')),
  });
  const res = await handle(req({ ...goodBody, withBackground: true }), h.deps);
  assertEquals(res.status, 200);
  const { generation, backgroundError } = await res.json();
  assertEquals(generation.background_path, null);
  assert(typeof backgroundError === 'string');
});
