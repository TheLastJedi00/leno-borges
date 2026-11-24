import { assert, assertEquals } from 'jsr:@std/assert@1';
import { parseInput, validateVariations } from './validate.ts';
import type { GenerateInput } from './types.ts';

const base = {
  theme: 'Kit de Ensino, aula de funções no ar',
  format: 'carousel',
  network: 'linkedin',
  lang: 'en',
  slideCount: 5,
  withBackground: false,
};

function ok(body: unknown) {
  const r = parseInput(body);
  assert(r.ok, `esperava ok, veio: ${r.ok ? '' : r.error}`);
  return r.value;
}
function bad(body: unknown) {
  const r = parseInput(body);
  assert(!r.ok, 'esperava erro');
  return r.error;
}

Deno.test('parseInput aceita a entrada completa', () => {
  assertEquals(ok(base), base);
});

Deno.test('parseInput apara o tema e rejeita tema curto', () => {
  assertEquals(ok({ ...base, theme: '  Tema com folga  ' }).theme, 'Tema com folga');
  bad({ ...base, theme: 'ab' });
  bad({ ...base, theme: '   a   ' });
});

Deno.test('parseInput aceita tema longo, sem limite de caracteres', () => {
  assertEquals(ok({ ...base, theme: 'x'.repeat(501) }).theme.length, 501);
  assertEquals(ok({ ...base, theme: 'x'.repeat(20000) }).theme.length, 20000);
});

Deno.test('parseInput rejeita formato, rede e idioma desconhecidos', () => {
  bad({ ...base, format: 'reel' });
  bad({ ...base, network: 'tiktok' });
  bad({ ...base, lang: 'es' });
  bad({ ...base, theme: undefined });
});

Deno.test('idioma padrao e en e fundo padrao e falso', () => {
  const { lang, withBackground } = ok({ theme: 'Um tema qualquer', format: 'post', network: 'instagram' });
  assertEquals(lang, 'en');
  assertEquals(withBackground, false);
});

Deno.test('slideCount do carrossel: padrao 5, de 3 a 10, inteiro', () => {
  assertEquals(ok({ ...base, slideCount: undefined }).slideCount, 5);
  assertEquals(ok({ ...base, slideCount: 3 }).slideCount, 3);
  assertEquals(ok({ ...base, slideCount: 10 }).slideCount, 10);
  bad({ ...base, slideCount: 2 });
  bad({ ...base, slideCount: 11 });
  bad({ ...base, slideCount: 4.5 });
  bad({ ...base, slideCount: '5' });
});

Deno.test('story e post sempre tem 1 slide, mesmo se o slideCount vier', () => {
  assertEquals(ok({ ...base, format: 'story', slideCount: 7 }).slideCount, 1);
  assertEquals(ok({ ...base, format: 'post', slideCount: undefined }).slideCount, 1);
});

Deno.test('parseInput rejeita corpo que nao e objeto e withBackground que nao e booleano', () => {
  bad(null);
  bad('texto');
  bad([]);
  bad({ ...base, withBackground: 'sim' });
});

// --- validateVariations ---

const input: GenerateInput = { ...base, format: 'carousel', network: 'linkedin', lang: 'en', slideCount: 3, withBackground: false };
const slide = (n: number) => ({ title: `Titulo ${n}`, body: 'corpo' });
const variation = (slides = 3) => ({
  angle: 'um angulo',
  slides: Array.from({ length: slides }, (_, i) => slide(i + 1)),
  caption: 'Legenda sugerida',
  hashtags: ['#a', '#b'],
});

Deno.test('validateVariations aceita 3 variacoes com o numero certo de slides', () => {
  const r = validateVariations({ variations: [variation(), variation(), variation()] }, input);
  assert(r.ok);
  assertEquals(r.value.length, 3);
});

Deno.test('validateVariations rejeita quantidade errada de variacoes ou de slides', () => {
  assert(!validateVariations({ variations: [variation(), variation()] }, input).ok);
  assert(!validateVariations({ variations: [variation(), variation(), variation(2)] }, input).ok);
  assert(!validateVariations({}, input).ok);
  assert(!validateVariations(null, input).ok);
});

Deno.test('validateVariations exige titulo, legenda e hashtags como lista de texto', () => {
  const noTitle = { ...variation(), slides: [{ body: 'x' }, slide(2), slide(3)] };
  assert(!validateVariations({ variations: [noTitle, variation(), variation()] }, input).ok);
  const noCaption = { ...variation(), caption: '  ' };
  assert(!validateVariations({ variations: [noCaption, variation(), variation()] }, input).ok);
  const badTags = { ...variation(), hashtags: [1, 2] };
  assert(!validateVariations({ variations: [badTags, variation(), variation()] }, input).ok);
});

Deno.test('story e post esperam exatamente 1 slide por variacao', () => {
  const story: GenerateInput = { ...input, format: 'story', slideCount: 1 };
  assert(validateVariations({ variations: [variation(1), variation(1), variation(1)] }, story).ok);
  assert(!validateVariations({ variations: [variation(2), variation(1), variation(1)] }, story).ok);
});

Deno.test('validateVariations descarta campos extras e nao deixa warnings do Gemini passar', () => {
  const v = { ...variation(), warnings: ['injetado'], extra: 1 };
  const r = validateVariations({ variations: [v, variation(), variation()] }, input);
  assert(r.ok);
  assertEquals(r.value[0].warnings, undefined);
  assertEquals(Object.keys(r.value[0]).sort(), ['angle', 'caption', 'hashtags', 'slides']);
});
