import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { DIRECTIONS, buildPrompt } from './prompt.ts';
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
  const { system } = buildPrompt(input, 0);
  for (const hex of ['#1C1C1E', '#3986FF', '#F2F3F5', '#2563D9']) assertStringIncludes(system, hex);
  assertStringIncludes(system, 'Outfit');
  assertStringIncludes(system, 'DM Sans');
  assertStringIncludes(system, 'neomórfic');
});

Deno.test('o prompt diz as regras de texto com todas as letras', () => {
  const { system } = buildPrompt(input, 0);
  assertStringIncludes(system, 'travessão');
  assertStringIncludes(system, 'o jogo virou');
  assertStringIncludes(system, 'Nas peças');
  assertStringIncludes(system, 'ESTRITAMENTE PROIBIDO');
  assertStringIncludes(system, 'emoji');
  assertStringIncludes(system, 'FinOps');
});

Deno.test('o prompt pede o HTML da arte: tamanho, estilos inline e marcadores', () => {
  const { system } = buildPrompt(input, 0);
  assertStringIncludes(system, '1080');
  assertStringIncludes(system, 'style="..."');
  assertStringIncludes(system, '{{LOGO_URL}}');
  assertStringIncludes(system, 'sem <style>');
  assertStringIncludes(system, 'sem <script>');
});

Deno.test('cada formato entra com o tamanho exato e o stories com as faixas seguras', () => {
  assertStringIncludes(buildPrompt(input, 0).user, '1080x1080');
  assertStringIncludes(buildPrompt(input, 0).user, '6 slides');
  const story = buildPrompt({ ...input, format: 'story', slideCount: 1 }, 0);
  assertStringIncludes(story.user, '1080x1920');
  assertStringIncludes(story.system, '250 px');
  assertStringIncludes(buildPrompt({ ...input, format: 'post', slideCount: 1 }, 0).user, '1080x1440');
});

Deno.test('o fundo so entra no prompt quando foi pedido', () => {
  assertStringIncludes(buildPrompt({ ...input, withBackground: true }, 0).user, '{{BACKGROUND_URL}}');
  assert(!buildPrompt(input, 0).user.includes('{{BACKGROUND_URL}}'));
});

Deno.test('as 3 variacoes recebem direcoes criativas diferentes', () => {
  assertEquals(DIRECTIONS.length, 3);
  const users = [0, 1, 2].map((i) => buildPrompt(input, i).user);
  for (let i = 0; i < 3; i++) assertStringIncludes(users[i], DIRECTIONS[i]);
  assertEquals(new Set(users).size, 3);
});

Deno.test('o prompt entrega o tema e o idioma pedidos', () => {
  const { user } = buildPrompt(input, 0);
  assertStringIncludes(user, 'Aula de funções no ar no Kit de Ensino');
  assertStringIncludes(user, 'English');
  assertStringIncludes(buildPrompt({ ...input, lang: 'fr' }, 0).user, 'français canadien');
  assertStringIncludes(buildPrompt({ ...input, lang: 'pt' }, 0).user, 'português do Brasil');
});

Deno.test('LinkedIn e Instagram recebem guias de texto e de arte diferentes', () => {
  const li = buildPrompt({ ...input, network: 'linkedin' }, 0).system;
  const ig = buildPrompt({ ...input, network: 'instagram' }, 0).system;
  assertStringIncludes(li, '600 a 1.300');
  assertStringIncludes(ig, '150 a 500');
  assert(!li.includes('150 a 500'));
  assert(!ig.includes('600 a 1.300'));
  assertStringIncludes(li, 'ARTE PARA LinkedIn');
  assertStringIncludes(ig, 'ARTE PARA Instagram');
});

Deno.test('o guia da rede limita emojis do texto sugerido', () => {
  assertStringIncludes(buildPrompt({ ...input, network: 'linkedin' }, 0).system, 'no máximo 1 emoji');
  assertStringIncludes(buildPrompt({ ...input, network: 'instagram' }, 0).system, 'no máximo 2 emojis');
});

Deno.test('EN e FR ganham as palavras-chave do mercado Barrie e GTA; PT nao', () => {
  assertStringIncludes(buildPrompt({ ...input, lang: 'en' }, 0).system, 'Barrie, GTA');
  assertStringIncludes(buildPrompt({ ...input, lang: 'fr' }, 0).system, 'Barrie, GTA');
  assert(!buildPrompt({ ...input, lang: 'pt' }, 0).system.includes('palavras-chave do mercado local'));
});

Deno.test('o prompt proibe inventar versao, link ou recurso que o tema nao traz', () => {
  assertStringIncludes(buildPrompt(input, 0).system, 'versões');
  assertStringIncludes(buildPrompt(input, 0).system, 'links');
});

Deno.test('na nova tentativa, as violacoes anteriores entram no prompt', () => {
  const retry = buildPrompt(input, 0, ['slide 1: contém travessão', 'HTML do slide 2: tem <script>']);
  assertStringIncludes(retry.user, 'slide 1: contém travessão');
  assertStringIncludes(retry.user, 'tem <script>');
  assertEquals(buildPrompt(input, 0).user.includes('Corrija'), false);
});
