import { BRAND } from './brand.ts';
import { FORMAT_INFO, LANG_LABEL, MARKET_KEYWORDS, NETWORK_GUIDE } from './networks.ts';
import type { GenerateInput } from './types.ts';

const TEXT_RULES = `REGRAS DE TEXTO (valem para tudo o que você escrever):
- Nas peças (kicker, title, body e cta): ESTRITAMENTE PROIBIDO usar emoji e ESTRITAMENTE PROIBIDO usar travessão (—), meia-risca (–) ou hífen solto entre espaços. Use vírgula, ponto ou reescreva a frase.
- No texto sugerido e nas hashtags: também sem travessão. Emoji só dentro do limite do guia da rede, nunca em sequência e nunca para enfeitar.
- Sem clichês de texto escrito por IA, como "o jogo virou", "game changer", "próximo nível", "no mundo de hoje", "não é sobre X, é sobre Y", "jornada", "mergulhe", "desbloqueie", "revolucionar", "sem mais delongas", "a verdade é que". Vale o mesmo para os equivalentes em inglês e em francês.
- Escreva como quem fez o trabalho: frases concretas em vez de adjetivos, um dado ou fato real por peça quando o tema permitir, sem pergunta retórica na abertura e sem três adjetivos em sequência.
- Não use "FinOps" nem prometa custo zero ou quase zero. Descreva a decisão concreta (por exemplo, trocar a hospedagem para reduzir o custo).
- Não invente números, clientes ou resultados que o tema não traz.`;

const OUTPUT_RULES = `FORMATO DA RESPOSTA:
- Responda só com o JSON do schema, sem comentários.
- Entregue exatamente 3 variações, cada uma com um ângulo diferente (o campo angle resume a ideia em uma frase, em português).
- slides: kicker (opcional, contexto curto de até 4 palavras, em caixa normal), title (até 8 palavras), body (opcional, até 30 palavras), cta (só no último slide ou no stories).
- Carrossel: o primeiro slide é a capa com o gancho; os do meio levam um ponto cada; o último fecha com o cta.
- caption é o texto sugerido da publicação, no molde da rede indicada; hashtags vão separadas, cada uma começando com #.`;

/** Monta o prompt. `violations` (2a tentativa) traz o que a resposta anterior errou. */
export function buildPrompt(
  input: GenerateInput,
  violations: string[] = [],
): { system: string; user: string } {
  const parts = [
    'Você é redator e diretor de arte de publicidade para redes sociais da marca abaixo. Escreve textos curtos, concretos e com cara de gente, nunca de modelo de linguagem.',
    BRAND,
    NETWORK_GUIDE[input.network],
    TEXT_RULES,
    OUTPUT_RULES,
  ];
  if (input.lang !== 'pt') parts.splice(3, 0, MARKET_KEYWORDS);

  const format = FORMAT_INFO[input.format];
  const size =
    input.format === 'carousel' ? `${format.label} com ${input.slideCount} slides` : `${format.label} com 1 slide`;

  const user = [
    `Tema: ${input.theme}`,
    `Formato: ${size}`,
    `Rede: ${input.network === 'linkedin' ? 'LinkedIn' : 'Instagram'}`,
    `Idioma das peças e do texto sugerido: ${LANG_LABEL[input.lang]}`,
  ];
  if (violations.length > 0) {
    user.push(
      '',
      'Corrija estes problemas da resposta anterior e gere de novo as 3 variações:',
      ...violations.map((v) => `- ${v}`),
    );
  }
  return { system: parts.join('\n\n'), user: user.join('\n') };
}
