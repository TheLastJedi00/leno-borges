import { assert, assertEquals } from 'jsr:@std/assert@1';
import { parseInput, unsafeHtml, validateVariation } from './validate.ts';
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

// --- validateVariation (uma variacao por chamada, com o HTML de cada slide) ---

const input: GenerateInput = { ...base, format: 'carousel', network: 'linkedin', lang: 'en', slideCount: 3, withBackground: false };
const html = (n: number) =>
  `<div style="width:1080px;height:1080px;background:#1C1C1E"><h1 style="color:#F2F3F5">Titulo ${n}</h1></div>`;
const slide = (n: number) => ({ title: `Titulo ${n}`, body: 'corpo', html: html(n) });
const variation = (slides = 3) => ({
  angle: 'um angulo',
  slides: Array.from({ length: slides }, (_, i) => slide(i + 1)),
  caption: 'Legenda sugerida',
  hashtags: ['#a', '#b'],
});

Deno.test('validateVariation aceita a variacao com o numero certo de slides e o HTML de cada um', () => {
  const r = validateVariation(variation(), input);
  assert(r.ok);
  assertEquals(r.value.slides.length, 3);
  assertEquals(r.value.slides[0].html, html(1));
});

Deno.test('validateVariation rejeita numero errado de slides', () => {
  assert(!validateVariation(variation(2), input).ok);
  assert(!validateVariation({}, input).ok);
  assert(!validateVariation(null, input).ok);
});

Deno.test('validateVariation exige titulo, HTML, legenda e hashtags como lista de texto', () => {
  const noTitle = { ...variation(), slides: [{ html: html(1) }, slide(2), slide(3)] };
  assert(!validateVariation(noTitle, input).ok);
  const noHtml = { ...variation(), slides: [{ title: 'T' }, slide(2), slide(3)] };
  assert(!validateVariation(noHtml, input).ok);
  const blankHtml = { ...variation(), slides: [{ title: 'T', html: '   ' }, slide(2), slide(3)] };
  assert(!validateVariation(blankHtml, input).ok);
  assert(!validateVariation({ ...variation(), caption: '  ' }, input).ok);
  assert(!validateVariation({ ...variation(), hashtags: [1, 2] }, input).ok);
});

Deno.test('story e post esperam exatamente 1 slide', () => {
  const story: GenerateInput = { ...input, format: 'story', slideCount: 1 };
  assert(validateVariation(variation(1), story).ok);
  assert(!validateVariation(variation(2), story).ok);
});

Deno.test('validateVariation descarta campos extras e nao deixa warnings do Gemini passar', () => {
  const r = validateVariation({ ...variation(), warnings: ['injetado'], extra: 1 }, input);
  assert(r.ok);
  assertEquals(r.value.warnings, undefined);
  assertEquals(Object.keys(r.value).sort(), ['angle', 'caption', 'hashtags', 'slides']);
});

// --- unsafeHtml: o HTML vem de um modelo e vai ser mostrado no painel ---

Deno.test('unsafeHtml aceita HTML so com estilos inline e os marcadores de logo e fundo', () => {
  assertEquals(unsafeHtml(html(1)), []);
  assertEquals(
    unsafeHtml(
      `<div style="background-image:url('{{BACKGROUND_URL}}')"><img src="{{LOGO_URL}}" alt=""><svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#3986FF"/></svg></div>`,
    ),
    [],
  );
  assertEquals(unsafeHtml(`<div style="background:url(data:image/png;base64,AAA)"></div>`), []);
});

Deno.test('unsafeHtml acusa script, handlers, javascript:, iframe, style e link', () => {
  assert(unsafeHtml('<div><script>alert(1)</script></div>').length > 0);
  assert(unsafeHtml('<img src="{{LOGO_URL}}" onerror="alert(1)">').length > 0);
  assert(unsafeHtml('<a href="javascript:alert(1)">x</a>').length > 0);
  assert(unsafeHtml('<iframe src="x"></iframe>').length > 0);
  assert(unsafeHtml('<style>.a{color:red}</style><div class="a"></div>').length > 0);
  assert(unsafeHtml('<link rel="stylesheet" href="https://x.com/a.css">').length > 0);
});

Deno.test('unsafeHtml acusa URL externa em src, href ou url() do CSS', () => {
  assert(unsafeHtml('<img src="https://example.com/a.png">').length > 0);
  assert(unsafeHtml(`<div style="background:url('https://example.com/a.png')"></div>`).length > 0);
  assert(unsafeHtml(`<div style="background:url(//example.com/a.png)"></div>`).length > 0);
  assert(unsafeHtml('<div style="font-family:x;@import url(https://x)"></div>').length > 0);
});
