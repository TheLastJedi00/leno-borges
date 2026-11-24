import type { AdFormat, Lang, Network } from './types.ts';

/** Guia do texto sugerido (`caption`) de cada rede. LinkedIn e Instagram sao moldes diferentes. */
export const NETWORK_GUIDE: Record<Network, string> = {
  linkedin: `GUIA DO TEXTO SUGERIDO PARA LinkedIn:
- Voz: profissional e direta, em primeira pessoa, de quem fez o trabalho.
- Abertura: uma linha de até 150 caracteres (é o que aparece antes do "ver mais") com um fato, um resultado ou uma tensão concreta.
- Corpo: 600 a 1.300 caracteres, em parágrafos de 1 a 3 linhas: contexto, o que foi feito, o que se aprendeu, um dado ou decisão concreta.
- Fecho: uma pergunta para comentar ou um CTA direto (ver o projeto, falar comigo).
- Hashtags: de 0 a 3, no fim.
- Emojis no texto sugerido: no máximo 1 emoji, e só se ajudar. Nunca em sequência.
- Arte: mais densa e editorial; o carrossel ensina ou prova algo.`,
  instagram: `GUIA DO TEXTO SUGERIDO PARA Instagram:
- Voz: conversa, mais leve, frases curtas.
- Abertura: uma linha de até 125 caracteres que faça parar de rolar.
- Corpo: 150 a 500 caracteres. O detalhe fica na arte; o texto complementa.
- Fecho: um CTA de ação da rede (salvar, comentar, link na bio).
- Hashtags: de 3 a 8, no fim, misturando nicho e local.
- Emojis no texto sugerido: no máximo 2 emojis, nunca em sequência.
- Arte: mais impacto; uma ideia por peça, título grande.`,
};

export const FORMAT_INFO: Record<AdFormat, { ratio: string; label: string }> = {
  story: { ratio: '9:16', label: 'Stories (retrato 9:16)' },
  carousel: { ratio: '1:1', label: 'Carrossel (quadrado 1:1)' },
  post: { ratio: '3:4', label: 'Post (retrato 3:4)' },
};

export const LANG_LABEL: Record<Lang, string> = {
  en: 'English (Canada)',
  fr: 'français canadien (vocabulaire do Québec e da Ontário: courriel, infonuagique, ponctuation OQLF)',
  pt: 'português do Brasil',
};

/** Palavras-chave do mercado Barrie e GTA; so entram quando o texto sai em EN ou FR. */
export const MARKET_KEYWORDS =
  'Quando fizer sentido e for verdadeiro, use naturalmente palavras-chave do mercado local (Barrie, GTA, Ontario, Canada, full-stack developer, cloud, Java, Angular), sem forçar.';
