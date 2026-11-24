/**
 * Ultima barreira antes de renderizar: uma peca nunca sai com emoji nem com travessao.
 * Mesma regra de `supabase/functions/_shared/copy-lint.ts` (cleanPieceText).
 */
const EMOJI =
  /(?:\p{Regional_Indicator}{2}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)/gu;

export function cleanPieceText(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(EMOJI, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+-{1,2}\s+/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,(\s*,)+/g, ',')
    .replace(/^[,\s]+|[,\s]+$/g, '');
}

/** Degraus de tamanho do titulo: ate `chars` caracteres usa `size` px. */
export type TitleSteps = ReadonlyArray<{ chars: number; size: number }>;

/**
 * Tamanho do titulo pelo comprimento do texto, em degraus, com piso no ultimo degrau.
 * Deterministico (nao mede o DOM), entao o preview e o PNG saem iguais.
 */
export function titleSize(text: string, steps: TitleSteps): number {
  const length = text.length;
  for (const step of steps) {
    if (length <= step.chars) return step.size;
  }
  return steps[steps.length - 1].size;
}
