import { CLICHES, PROJECT_RULES } from './cliches.ts';
import type { AdSlide, AdVariation, Network } from './types.ts';

/** Emoji (inclui variacao, juncao ZWJ, bandeiras e teclas). Setas simples como "→" nao entram. */
const EMOJI =
  /(?:\p{Regional_Indicator}{2}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)/gu;

const DASH = /[—–]/;
/** Hifen solto: com espaco dos dois lados (" - " ou " -- "). Hifen dentro de palavra nao conta. */
const SPACED_HYPHEN = /\s-{1,2}\s/;

/** Limite de emojis no texto sugerido de cada rede. */
const CAPTION_EMOJI_LIMIT: Record<Network, number> = { linkedin: 1, instagram: 2 };

export type TextKind = 'piece' | 'caption';

export interface EmojiMatch {
  value: string;
  index: number;
}

export function findEmoji(text: string): EmojiMatch[] {
  return [...text.matchAll(EMOJI)].map((m) => ({ value: m[0], index: m.index ?? 0 }));
}

/** Violacoes de um texto, em portugues, prontas para voltar ao prompt. Lista vazia = limpo. */
export function lintText(text: string, kind: TextKind, network?: Network): string[] {
  const out: string[] = [];

  if (DASH.test(text) || SPACED_HYPHEN.test(text)) {
    out.push('contém travessão ou hífen solto (use vírgula, ponto ou reescreva a frase)');
  }

  const emojis = findEmoji(text);
  if (kind === 'piece') {
    if (emojis.length > 0) out.push('contém emoji (estritamente proibido nas peças)');
  } else {
    const limit = CAPTION_EMOJI_LIMIT[network ?? 'instagram'];
    if (emojis.length > limit) {
      out.push(`tem ${emojis.length} emojis (máximo ${limit} nesta rede)`);
    }
    const adjacent = emojis.some(
      (e, i) => i > 0 && e.index === emojis[i - 1].index + emojis[i - 1].value.length,
    );
    if (adjacent) out.push('tem emojis em sequência');
  }

  for (const { name, pattern } of CLICHES) {
    if (pattern.test(text)) out.push(`cliché proibido: "${name}"`);
  }
  for (const { name, pattern } of PROJECT_RULES) {
    if (pattern.test(text)) out.push(`regra de copy do projeto: sem ${name}`);
  }
  return out;
}

const SLIDE_FIELDS = ['kicker', 'title', 'body', 'cta'] as const;

export interface VariationLint {
  /** Violacoes dentro das pecas (a funcao corrige sozinha se persistirem). */
  pieces: string[];
  /** Violacoes no texto sugerido e nas hashtags (viram `warnings`, o dono decide). */
  caption: string[];
}

export function lintVariation(v: AdVariation, network: Network): VariationLint {
  const pieces: string[] = [];
  v.slides.forEach((slide, i) => {
    for (const field of SLIDE_FIELDS) {
      const value = slide[field];
      if (!value) continue;
      for (const msg of lintText(value, 'piece')) pieces.push(`slide ${i + 1} ${field}: ${msg}`);
    }
  });
  const caption = [
    ...lintText(v.caption, 'caption', network).map((m) => `texto sugerido: ${m}`),
    ...lintText(v.hashtags.join(' '), 'caption', network).map((m) => `hashtags: ${m}`),
  ];
  return { pieces, caption };
}

/** Tira emojis e troca travessoes por virgula. Usada nas pecas, que nunca saem com eles. */
export function cleanPieceText(text: string): string {
  return text
    .replace(EMOJI, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+-{1,2}\s+/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,(\s*,)+/g, ',')
    .replace(/^[,\s]+|[,\s]+$/g, '');
}

function cleanSlide(slide: AdSlide): AdSlide {
  const out: AdSlide = { title: cleanPieceText(slide.title) };
  for (const field of ['kicker', 'body', 'cta'] as const) {
    const value = slide[field];
    if (value) {
      const cleaned = cleanPieceText(value);
      if (cleaned) out[field] = cleaned;
    }
  }
  return out;
}

/** Corrige so as pecas. O texto sugerido nao e reescrito: so marcado em `warnings`. */
export function fixVariation(v: AdVariation): AdVariation {
  return { ...v, slides: v.slides.map(cleanSlide) };
}
