import { BRAND } from './brand.ts';
import { FORMAT_INFO, LANG_LABEL, MARKET_KEYWORDS, NETWORK_GUIDE } from './networks.ts';
import type { AdFormat, GenerateInput, Network } from './types.ts';

/**
 * Uma direcao criativa por variacao (as 3 chamadas correm em paralelo). Garante que as variacoes
 * nao saiam parecidas, no texto e na arte.
 */
export const DIRECTIONS = [
  'Direção tipográfica: o título é a peça. Escala extrema (o título pode ocupar metade da arte e sangrar a borda), composição assimétrica, quase só tipografia, com uma única forma de cor que dá ritmo.',
  'Direção de prova: a peça mostra algo concreto do tema (um número, um trecho de código curto e real, um antes e depois ou uma lista curta) dentro de uma placa em relevo neomórfica, com o título apoiando.',
  'Direção pôster: campos de cor grandes (accent-deep #2563D9 e o degradê da logo #488FFF para #3986FF), formas geométricas ousadas que cortam a arte, contraste alto e título forte sobre os campos.',
] as const;

const SIZE: Record<AdFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  carousel: { width: 1080, height: 1080 },
  post: { width: 1080, height: 1440 },
};

const TEXT_RULES = `REGRAS DE TEXTO (valem para tudo o que você escrever, inclusive o texto dentro do HTML):
- Nas peças (kicker, title, body, cta e todo texto visível do HTML): ESTRITAMENTE PROIBIDO usar emoji e ESTRITAMENTE PROIBIDO usar travessão (—), meia-risca (–) ou hífen solto entre espaços. Use vírgula, ponto ou reescreva a frase.
- No texto sugerido e nas hashtags: também sem travessão. Emoji só dentro do limite do guia da rede, nunca em sequência e nunca para enfeitar.
- Sem clichês de texto escrito por IA, como "o jogo virou", "game changer", "próximo nível", "no mundo de hoje", "não é sobre X, é sobre Y", "jornada", "mergulhe", "desbloqueie", "revolucionar", "sem mais delongas", "a verdade é que". Vale o mesmo para os equivalentes em inglês e em francês.
- Escreva como quem fez o trabalho: frases concretas em vez de adjetivos, sem pergunta retórica na abertura e sem três adjetivos em sequência.
- Não use "FinOps" nem prometa custo zero ou quase zero. Descreva a decisão concreta.
- Não invente nada que o tema não traga: números, clientes, resultados, versões de ferramentas, nomes de repositórios, links, "link nos comentários" ou recursos que não foram citados.`;

const DESIGN_RULES = `REGRAS DA ARTE (o HTML de cada slide):
- Você é o diretor de arte. Cada slide vem com o campo html: a arte completa daquele slide, pronta para virar PNG.
- O elemento raiz tem exatamente a largura e a altura do formato em px (Stories 1080x1920, Carrossel 1080x1080, Post 1080x1440), position:relative e overflow:hidden. Tudo fica dentro dele.
- Só estilos inline (style="..."): sem <style>, sem <script>, sem <link>, sem atributos de evento, sem classes. Use div, span, p, h1, h2, img e svg inline (formas, linhas, ícones geométricos).
- Nenhum endereço externo. A logo é <img src="{{LOGO_URL}}" alt=""> (proporção 619:544, altura entre 48 e 72 px, sempre num canto, com respiro de pelo menos 1/4 da altura dela; nunca recolorir nem distorcer). Fora isso, só data: ou formas em CSS e SVG.
- Fontes disponíveis: 'Outfit' (títulos, peso 600 a 700), 'DM Sans' (corpo, 400 a 500) e 'JetBrains Mono' (só dados, números e código). Nenhuma outra.
- Tamanhos mínimos legíveis no celular: corpo 32 px, título 72 px; dê preferência a títulos bem maiores. Contraste AA: paper #F2F3F5 sobre ink #1C1C1E ou sobre accent-deep #2563D9; muted #A3A7AD só sobre ink ou surface.
- Use a paleta da marca. O neomorfismo é uma placa surface #232326 com sombra dupla em escala de peça (por exemplo box-shadow: 24px 24px 56px rgba(0,0,0,.55), -14px -14px 36px rgba(255,255,255,.04)), no máximo uma por slide. A marca é o ponto de partida, não uma prisão: degradês do azul da logo, formas grandes, linhas e grades finas são bem-vindos.
- Uma coisa memorável por slide: o título enorme, um campo de cor, a placa em relevo ou um dado em destaque. O resto fica quieto. Evite o óbvio: nada de texto centralizado sobre fundo de duas cores, nada de layout de slide de apresentação.
- Cor em forma, nunca destacando uma palavra solta do título. Numeração só no carrossel (é uma sequência). Sem rótulo em caixa alta espaçada acima de tudo e sem seta colada no CTA.
- Carrossel: o primeiro slide é a capa com o gancho; os do meio levam um ponto cada, numa grade fixa (mesma margem e mesma linha de base); o último fecha com o cta. Mostre n/N em JetBrains Mono num canto.`;

const ART_BY_NETWORK: Record<Network, string> = {
  linkedin: `ARTE PARA LinkedIn: editorial e confiante. Alinhamento à esquerda, margens largas (96 px), hierarquia clara entre título, corpo e dado. Grafite dominante com o azul em formas e detalhes. Pode ser mais densa: o carrossel ensina ou prova algo. No carrossel, uma barra de progresso fina embaixo.`,
  instagram: `ARTE PARA Instagram: pôster que faz parar de rolar. Título em escala máxima, contraste alto, campos de accent-deep ocupando boa parte da arte, alternando com grafite. Uma ideia por peça. No carrossel, uma forma contínua (faixa, horizonte ou linha) atravessa a borda entre slides, para o deslize parecer uma peça só.`,
};

const ART_BY_FORMAT: Record<AdFormat, string> = {
  story: `STORIES 9:16: nada de texto nem logo nas faixas de 250 px do topo e de baixo (interface do app e campo de resposta). Composição vertical; o CTA fica logo acima da faixa segura de baixo.`,
  carousel: `CARROSSEL 1:1: todos os slides compartilham o mesmo sistema visual (margens, fontes, posição da logo e do n/N), variando a composição de cada um.`,
  post: `POST 3:4: uma ideia por peça; o título no terço de cima e um elemento de apoio embaixo.`,
};

const OUTPUT_RULES = `FORMATO DA RESPOSTA:
- Responda só com o JSON do schema, sem comentários. Uma única variação.
- angle resume a ideia da variação em uma frase, em português.
- slides: kicker (opcional, até 4 palavras, caixa normal), title (até 8 palavras), body (opcional, até 30 palavras), cta (só no último slide ou no stories) e html (a arte do slide, com exatamente esses textos).
- caption é o texto sugerido da publicação, no molde da rede indicada; hashtags vão separadas, cada uma começando com #.`;

/**
 * Monta o prompt de uma variacao. `direction` escolhe a direcao criativa (0 a 2);
 * `violations` (2a tentativa) traz o que a resposta anterior errou.
 */
export function buildPrompt(
  input: GenerateInput,
  direction: number,
  violations: string[] = [],
): { system: string; user: string } {
  const parts = [
    'Você é redator e diretor de arte de publicidade para redes sociais da marca abaixo. Escreve textos curtos e concretos, com cara de gente, e desenha peças com impacto, que ninguém confundiria com um modelo pronto.',
    BRAND,
    NETWORK_GUIDE[input.network],
    TEXT_RULES,
    DESIGN_RULES,
    ART_BY_NETWORK[input.network],
    ART_BY_FORMAT[input.format],
    OUTPUT_RULES,
  ];
  if (input.lang !== 'pt') parts.splice(3, 0, MARKET_KEYWORDS);

  const { width, height } = SIZE[input.format];
  const format = FORMAT_INFO[input.format];
  const count = input.format === 'carousel' ? `${input.slideCount} slides` : '1 slide';

  const user = [
    `Tema: ${input.theme}`,
    `Formato: ${format.label}, ${count}, cada um com ${width}x${height} px`,
    `Rede: ${input.network === 'linkedin' ? 'LinkedIn' : 'Instagram'}`,
    `Idioma das peças e do texto sugerido: ${LANG_LABEL[input.lang]}`,
    DIRECTIONS[direction],
    input.withBackground
      ? 'Imagem de fundo: existe uma imagem abstrata em {{BACKGROUND_URL}}. Use-a como fundo de todos os slides (background-image:url(\'{{BACKGROUND_URL}}\'); background-size:cover) sob um véu escuro em degradê de ink #1C1C1E que garanta o contraste do texto.'
      : 'Sem imagem de fundo: construa a arte só com cor, forma e tipografia.',
  ];
  if (violations.length > 0) {
    user.push(
      '',
      'Corrija estes problemas da resposta anterior e gere de novo a variação:',
      ...violations.map((v) => `- ${v}`),
    );
  }
  return { system: parts.join('\n\n'), user: user.join('\n') };
}
