import { assert, assertEquals, assertRejects, assertStringIncludes } from 'jsr:@std/assert@1';
import { GeminiError, generateBackground, generateVariation } from './gemini.ts';
import type { Env, GenerateInput } from './types.ts';

const env: Env = {
  GEMINI_API_KEY: 'chave-secreta',
  GEMINI_MODEL: 'gemini-flash-latest',
  GEMINI_THINKING_LEVEL: 'medium',
  GEMINI_IMAGE_MODEL: 'gemini-3.1-flash-image',
  OWNER_USER_ID: 'owner',
};
const input: GenerateInput = {
  theme: 'Tema de teste',
  format: 'story',
  network: 'instagram',
  lang: 'en',
  slideCount: 1,
  withBackground: true,
};
const prompt = { system: 's', user: 'u' };

interface Call {
  url: string;
  headers: Headers;
  // deno-lint-ignore no-explicit-any
  body: any;
}
function fakeFetch(responses: Array<{ status?: number; json: unknown }>) {
  const calls: Call[] = [];
  const fn = (url: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(url),
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body)),
    });
    const r = responses[Math.min(calls.length - 1, responses.length - 1)];
    return Promise.resolve(new Response(JSON.stringify(r.json), { status: r.status ?? 200 }));
  };
  return { fn: fn as typeof fetch, calls };
}
const textReply = (obj: unknown) => ({
  json: { candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] },
});

Deno.test('generateVariation chama o modelo certo, com a chave no header e JSON estruturado', async () => {
  const { fn, calls } = fakeFetch([textReply({ angle: 'a' })]);
  await generateVariation(fn, env, input, { system: 'SYS', user: 'USR' });
  assertStringIncludes(calls[0].url, 'models/gemini-flash-latest:generateContent');
  assertEquals(calls[0].headers.get('x-goog-api-key'), 'chave-secreta');
  assert(!calls[0].url.includes('chave-secreta'), 'a chave nao pode ir na URL');
  const b = calls[0].body;
  assertEquals(b.generationConfig.responseMimeType, 'application/json');
  const schema = b.generationConfig.responseSchema;
  assertEquals(schema.type, 'OBJECT');
  assertEquals(schema.required, ['angle', 'slides', 'caption', 'hashtags']);
  const slideSchema = schema.properties.slides.items;
  assertEquals(slideSchema.properties.html.type, 'STRING');
  assertEquals(slideSchema.required, ['title', 'html']);
  assertEquals(schema.properties.slides.minItems, 1);
  assertEquals(schema.properties.slides.maxItems, 1);
  assert(b.generationConfig.maxOutputTokens >= 32768, 'HTML do carrossel precisa de espaco');
  assertEquals(b.systemInstruction.parts[0].text, 'SYS');
  assertEquals(b.contents[0].parts[0].text, 'USR');
});

Deno.test('o raciocinio vai como thinkingLevel medium', async () => {
  const { fn, calls } = fakeFetch([textReply({ angle: 'a' })]);
  await generateVariation(fn, env, input, prompt);
  assertEquals(calls[0].body.generationConfig.thinkingConfig, { thinkingLevel: 'medium' });
});

Deno.test('se o modelo recusar thinkingLevel, repete com thinkingBudget medio', async () => {
  const refusal = {
    status: 400,
    json: { error: { message: 'thinking_level is not supported for this model' } },
  };
  const { fn, calls } = fakeFetch([refusal, textReply({ angle: 'a' })]);
  await generateVariation(fn, env, input, prompt);
  assertEquals(calls.length, 2);
  assertEquals(calls[1].body.generationConfig.thinkingConfig, { thinkingBudget: 4096 });
});

Deno.test('um 400 que nao e sobre raciocinio nao e repetido', async () => {
  const { fn, calls } = fakeFetch([
    { status: 400, json: { error: { message: 'API key not valid' } } },
  ]);
  await assertRejects(() => generateVariation(fn, env, input, prompt), GeminiError);
  assertEquals(calls.length, 1);
});

Deno.test('erro HTTP ou resposta sem JSON viram GeminiError sem vazar a chave', async () => {
  const http = fakeFetch([{ status: 500, json: { error: { message: 'boom' } } }]);
  await assertRejects(() => generateVariation(http.fn, env, input, prompt), GeminiError);
  const junk = fakeFetch([
    { json: { candidates: [{ content: { parts: [{ text: 'isso nao e json' }] } }] } },
  ]);
  const err = await assertRejects(
    () => generateVariation(junk.fn, env, input, prompt),
    GeminiError,
  );
  assert(!String(err).includes('chave-secreta'));
});

Deno.test('generateVariation devolve o JSON ja convertido', async () => {
  const { fn } = fakeFetch([textReply({ angle: 'a' })]);
  assertEquals(await generateVariation(fn, env, input, prompt), { angle: 'a' });
});

// --- imagem ---

const imageReply = {
  json: {
    candidates: [
      { content: { parts: [{ inlineData: { mimeType: 'image/png', data: btoa('PNGDATA') } }] } },
    ],
  },
};

Deno.test('generateBackground pede a proporcao do formato, sem texto, e devolve os bytes', async () => {
  for (const [format, ratio] of [['story', '9:16'], ['carousel', '1:1'], ['post', '3:4']] as const) {
    const { fn, calls } = fakeFetch([imageReply]);
    const img = await generateBackground(fn, env, { ...input, format });
    assertStringIncludes(calls[0].url, 'models/gemini-3.1-flash-image:generateContent');
    assertEquals(calls[0].body.generationConfig.imageConfig.aspectRatio, ratio);
    assert(calls[0].body.generationConfig.responseModalities.includes('IMAGE'));
    const text: string = calls[0].body.contents[0].parts[0].text;
    assertStringIncludes(text, '#1C1C1E');
    assertStringIncludes(text, 'sem texto');
    assertStringIncludes(text, 'sem emojis');
    assertEquals(img.mimeType, 'image/png');
    assertEquals(new TextDecoder().decode(img.bytes), 'PNGDATA');
  }
});

Deno.test('generateBackground falha com GeminiError quando nao vem imagem', async () => {
  const { fn } = fakeFetch([
    { json: { candidates: [{ content: { parts: [{ text: 'so texto' }] } }] } },
  ]);
  await assertRejects(() => generateBackground(fn, env, input), GeminiError);
});
