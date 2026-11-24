import { assert, assertEquals } from 'jsr:@std/assert@1';
import { cleanPieceText, findEmoji, fixVariation, lintText, lintVariation, visibleText } from './copy-lint.ts';
import type { AdVariation } from './types.ts';

Deno.test('findEmoji acha emojis comuns e sequencias, e ignora acentos e setas', () => {
  assertEquals(findEmoji('No ar 🚀').length, 1);
  assertEquals(findEmoji('Feito ✅ e testado ❤️').length, 2);
  assertEquals(findEmoji('Ação, cédula, coração → próximo').length, 0);
  assertEquals(findEmoji('texto limpo').length, 0);
});

Deno.test('lintText acusa travessao, meia-risca e hifen solto entre espacos', () => {
  assert(lintText('Pronto — no ar', 'piece').length > 0);
  assert(lintText('2025 – 2026', 'piece').length > 0);
  assert(lintText('Pronto - no ar', 'piece').length > 0);
});

Deno.test('lintText nao acusa hifen dentro de palavra nem intervalos sem espaco', () => {
  assertEquals(lintText('full-stack e e-mail, 2025-2026', 'piece'), []);
});

Deno.test('lintText acusa cliches nos tres idiomas, sem diferenciar maiuscula', () => {
  assert(lintText('O jogo virou!', 'piece').length > 0);
  assert(lintText('Hora de virar o jogo', 'caption').length > 0);
  assert(lintText('A real GAME CHANGER here', 'piece').length > 0);
  assert(lintText("Let's dive in", 'caption').length > 0);
  assert(lintText("À l'ère du numérique, tout change", 'caption').length > 0);
  assert(lintText('Não é sobre código, é sobre pessoas', 'caption').length > 0);
  assert(lintText("It's not about code, it's about people", 'caption').length > 0);
});

Deno.test('lintText acusa as regras de copy do projeto', () => {
  assert(lintText('Estratégia de FinOps', 'caption').length > 0);
  assert(lintText('Hospedagem com custo zero', 'caption').length > 0);
  assert(lintText('Near-zero cost hosting', 'caption').length > 0);
});

Deno.test('texto bom passa limpo', () => {
  assertEquals(
    lintText('Nove aulas, 133 trechos de Java conferidos em um JDK de verdade.', 'caption'),
    [],
  );
});

Deno.test('emojis: proibidos nas pecas; no texto, 1 no LinkedIn e 2 no Instagram', () => {
  assert(lintText('Texto 🚀', 'piece').length > 0);
  assertEquals(lintText('Texto 🚀', 'caption', 'linkedin'), []);
  assert(lintText('Texto 🚀 e 🎯', 'caption', 'linkedin').length > 0);
  assertEquals(lintText('Texto 🚀 e mais 🎯', 'caption', 'instagram'), []);
  assert(lintText('Um 🚀 dois 🎯 tres ✅', 'caption', 'instagram').length > 0);
});

Deno.test('emojis em sequencia sao proibidos ate no texto sugerido', () => {
  assert(lintText('Pronto 🚀🔥', 'caption', 'instagram').length > 0);
});

Deno.test('cleanPieceText remove emojis e troca travessoes por virgula', () => {
  assertEquals(cleanPieceText('Pronto — no ar 🚀'), 'Pronto, no ar');
  assertEquals(cleanPieceText('2025 – 2026'), '2025, 2026');
  assertEquals(cleanPieceText('Antes - depois'), 'Antes, depois');
  assertEquals(cleanPieceText('  🚀 Olá   mundo '), 'Olá mundo');
  assertEquals(cleanPieceText('full-stack'), 'full-stack');
  assertEquals(cleanPieceText(', início'), 'início');
});

const dirty: AdVariation = {
  angle: 'angulo',
  slides: [
    { kicker: 'Novo 🚀', title: 'O jogo virou — de vez', body: 'Texto - com hifen', cta: 'Veja 👉' },
  ],
  caption: 'Legenda — com travessao',
  hashtags: ['#a'],
};

Deno.test('lintVariation separa as violacoes das pecas das do texto sugerido', () => {
  const r = lintVariation(dirty, 'instagram');
  assert(r.pieces.length >= 3);
  assert(r.caption.length >= 1);
  assert(r.pieces.some((m) => m.includes('slide 1')));
});

Deno.test('visibleText tira tags, estilos e entidades e fica so com o texto visivel', () => {
  assertEquals(
    visibleText(
      '<div style="font-family:\'DM Sans\';margin:0 -4px"><h1>Ol&aacute; &amp; adeus</h1><p>linha&nbsp;dois</p></div>',
    ),
    'Olá & adeus linha dois',
  );
});

Deno.test('o texto visivel do HTML conta como peca; CSS e atributos nao', () => {
  const v: AdVariation = {
    angle: 'a',
    slides: [{
      title: 'Limpo',
      html: '<div style="margin: 0 -8px; background: linear-gradient(135deg, #488FFF 0%, #3986FF 100%)"><h1>Pronto — no ar 🚀</h1></div>',
    }],
    caption: 'ok',
    hashtags: [],
  };
  const r = lintVariation(v, 'linkedin');
  assert(r.pieces.some((m) => m.startsWith('slide 1 html: contém travessão')));
  assert(r.pieces.some((m) => m.startsWith('slide 1 html: contém emoji')));
  const clean = { ...v, slides: [{ title: 'Limpo', html: '<div style="margin: 0 -8px"><h1>Pronto, no ar</h1></div>' }] };
  assertEquals(lintVariation(clean, 'linkedin').pieces, []);
});

Deno.test('fixVariation limpa o texto dentro do HTML sem mexer em tags e estilos', () => {
  const fixed = fixVariation({
    angle: 'a',
    slides: [{ title: 'T', html: '<div style="margin:0 -8px"><h1>Pronto — no ar 🚀</h1><p> Antes - depois </p></div>' }],
    caption: 'c',
    hashtags: [],
  });
  assertEquals(fixed.slides[0].html, '<div style="margin:0 -8px"><h1>Pronto, no ar</h1><p> Antes, depois </p></div>');
});

Deno.test('fixVariation limpa as pecas, mas nao mexe no texto sugerido', () => {
  const fixed = fixVariation(dirty);
  assertEquals(fixed.slides[0].kicker, 'Novo');
  assertEquals(fixed.slides[0].title, 'O jogo virou, de vez');
  assertEquals(fixed.slides[0].body, 'Texto, com hifen');
  assertEquals(fixed.slides[0].cta, 'Veja');
  assertEquals(fixed.caption, 'Legenda — com travessao');
});
