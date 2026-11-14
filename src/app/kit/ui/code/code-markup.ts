import type { CodeMarkup, SceneStep, TokenRole } from '../../kit.data';

export interface CodeToken {
  text: string;
  role?: TokenRole;
}

const TOKEN = /\{([ktnvfc]):([^}]*)\}/g;

/** Converte `{k:let} {n:idade} = {v:25};` em linhas de tokens com papel. */
export function parseCode(markup: CodeMarkup): CodeToken[][] {
  return markup.split('\n').map((line) => {
    const tokens: CodeToken[] = [];
    let last = 0;
    for (const match of line.matchAll(TOKEN)) {
      if (match.index > last) tokens.push({ text: line.slice(last, match.index) });
      tokens.push({ text: match[2], role: match[1] as TokenRole });
      last = match.index + match[0].length;
    }
    if (last < line.length) tokens.push({ text: line.slice(last) });
    return tokens;
  });
}

export interface ExprPart {
  tokens: CodeToken[];
  /** Trecho entre `[[ ]]`: a parte calculada na etapa. */
  focus: boolean;
}

const FOCUS = /\[\[(.*?)\]\]/g;

/** Divide uma linha de expressão em partes, separando o trecho em destaque (`[[ ]]`). */
export function parseExpr(markup: CodeMarkup): ExprPart[] {
  const parts: ExprPart[] = [];
  const push = (text: string, focus: boolean) => {
    if (text) parts.push({ tokens: parseCode(text)[0], focus });
  };
  let last = 0;
  for (const match of markup.matchAll(FOCUS)) {
    push(markup.slice(last, match.index), false);
    push(match[1], true);
    last = match.index + match[0].length;
  }
  push(markup.slice(last), false);
  return parts;
}

/** Texto puro do trecho (sem marcação), útil para leitor de tela e testes. */
export function plainCode(markup: CodeMarkup): string {
  return markup.replace(TOKEN, '$2').replace(FOCUS, '$1');
}

/** Estado da etapa `step`: cada etapa herda a anterior e sobrescreve só o que declara. */
export function sceneAt(steps: SceneStep[], step: number): SceneStep {
  const merged: SceneStep = {};
  for (const s of steps.slice(0, step + 1)) Object.assign(merged, s);
  return merged;
}
