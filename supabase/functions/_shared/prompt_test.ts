import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { buildPrompt } from './prompt.ts';
import type { GenerateInput } from './types.ts';

const input: GenerateInput = {
  theme: 'Aula de funções no ar no Kit de Ensino',
  format: 'carousel',
  network: 'linkedin',
  lang: 'en',
  slideCount: 6,
  withBackground: false,
};

Deno.test('o prompt leva a identidade visual da marca', () => {
  const { system } = buildPrompt(input);
  for (const hex of ['#1C1C1E', '#3986FF', '#F2F3F5']) assertStringIncludes(system, hex);
  assertStringIncludes(system, 'Outfit');
});

Deno.test('o prompt diz as regras de texto com todas as letras', () => {
  const { system } = buildPrompt(input);
  assertStringIncludes(system, 'travessão');
  assertStringIncludes(system, 'o jogo virou');
  assertStringIncludes(system, 'Nas peças');
  assertStringIncludes(system, 'ESTRITAMENTE PROIBIDO');
  assertStringIncludes(system, 'emoji');
  assertStringIncludes(system, 'FinOps');
});

Deno.test('o prompt entrega o tema e o idioma pedidos', () => {
  const { user } = buildPrompt(input);
  assertStringIncludes(user, 'Aula de funções no ar no Kit de Ensino');
  assertStringIncludes(user, 'English');
  assertStringIncludes(buildPrompt({ ...input, lang: 'fr' }).user, 'français canadien');
  assertStringIncludes(buildPrompt({ ...input, lang: 'pt' }).user, 'português do Brasil');
});

Deno.test('o formato entra com proporcao e numero de slides', () => {
  assertStringIncludes(buildPrompt(input).user, '1:1');
  assertStringIncludes(buildPrompt(input).user, '6 slides');
  assertStringIncludes(buildPrompt({ ...input, format: 'story', slideCount: 1 }).user, '9:16');
  assertStringIncludes(buildPrompt({ ...input, format: 'post', slideCount: 1 }).user, '3:4');
});

Deno.test('LinkedIn e Instagram recebem guias de texto diferentes', () => {
  const li = buildPrompt({ ...input, network: 'linkedin' }).system;
  const ig = buildPrompt({ ...input, network: 'instagram' }).system;
  assertStringIncludes(li, 'LinkedIn');
  assertStringIncludes(li, '600 a 1.300');
  assertStringIncludes(ig, 'Instagram');
  assertStringIncludes(ig, '150 a 500');
  assert(!li.includes('150 a 500'));
  assert(!ig.includes('600 a 1.300'));
});

Deno.test('o guia da rede limita emojis do texto sugerido', () => {
  assertStringIncludes(buildPrompt({ ...input, network: 'linkedin' }).system, 'no máximo 1 emoji');
  assertStringIncludes(buildPrompt({ ...input, network: 'instagram' }).system, 'no máximo 2 emojis');
});

Deno.test('EN e FR ganham as palavras-chave do mercado Barrie e GTA; PT nao', () => {
  assertStringIncludes(buildPrompt({ ...input, lang: 'en' }).system, 'Barrie');
  assertStringIncludes(buildPrompt({ ...input, lang: 'fr' }).system, 'Barrie');
  assert(!buildPrompt({ ...input, lang: 'pt' }).user.includes('Barrie'));
});

Deno.test('na nova tentativa, as violacoes anteriores entram no prompt', () => {
  const retry = buildPrompt(input, [
    'slide 1 title: contém travessão',
    'legenda: cliché "o jogo virou"',
  ]);
  assertStringIncludes(retry.user, 'slide 1 title: contém travessão');
  assertStringIncludes(retry.user, 'o jogo virou');
  assertEquals(buildPrompt(input).user.includes('Corrija'), false);
});
