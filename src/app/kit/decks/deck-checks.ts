import { type Deck, type Lesson, SYNTAXES, type Slide, type Syntax, pick, stepCount } from '../kit.data';
import { visibleSlides } from '../player/player-state';
import { parseCode, parseExpr, plainCode } from '../ui/code/code-markup';

// Conferências comuns a todos os decks, usadas pelos testes de cada aula. Funções puras (sem
// Jasmine) que devolvem a lista de problemas encontrados: o teste espera a lista vazia.

/** Todo trecho de `code` existe nas três sintaxes. */
export function snippetProblems(code: Record<string, Partial<Record<Syntax, string>>>): string[] {
  const problems: string[] = [];
  for (const [name, snippet] of Object.entries(code)) {
    for (const s of SYNTAXES) {
      if (!snippet[s]?.trim()) problems.push(`trecho ${name} sem ${s}`);
    }
  }
  return problems;
}

/** Estrutura do deck: ids, notas, etapas, selos, código e contagem do catálogo. */
export function deckProblems(deck: Deck, lesson: Lesson): string[] {
  const problems: string[] = [];
  const ids = deck.slides.map((s) => s.id);
  if (new Set(ids).size !== ids.length) problems.push('ids de slide repetidos');

  for (const slide of deck.slides) {
    if (!slide.notes.length) problems.push(`${slide.id}: sem tópicos de fala`);
    if (stepCount(slide) < 1) problems.push(`${slide.id}: sem etapas`);
    if (!!slide.tag !== (slide.depth === 'extra')) problems.push(`${slide.id}: selo não bate com depth`);
    if ('code' in slide && slide.code) {
      for (const s of slide.syntaxes ?? lesson.syntaxes) {
        const markup = pick((slide as Extract<Slide, { code?: unknown }>).code, s);
        if (!markup || !parseCode(markup).length) problems.push(`${slide.id}: sem código em ${s}`);
      }
    }
  }

  for (const s of lesson.syntaxes) {
    const essencial = visibleSlides(deck, 'essencial', s).length;
    const completo = visibleSlides(deck, 'completo', s).length;
    if (essencial !== lesson.counts.essencial) problems.push(`${s}: ${essencial} essenciais no deck`);
    if (completo !== lesson.counts.completo) problems.push(`${s}: ${completo} no completo no deck`);
  }

  if (JSON.stringify(deck).includes('—')) problems.push('texto com travessão');
  return problems;
}

/**
 * Slides `expr`: toda linha tem expressão em cada sintaxe e vale o mesmo que a anterior da mesma
 * conta (as linhas são JS válido; números e true/false).
 */
export function exprProblems(deck: Deck, syntaxes: readonly Syntax[]): string[] {
  const problems: string[] = [];
  for (const slide of deck.slides) {
    if (slide.kind !== 'expr') continue;
    let previous: unknown;
    for (const step of slide.steps) {
      for (const s of slide.syntaxes ?? syntaxes) {
        const expr = pick(step.expr, s);
        if (!expr || !parseExpr(expr).length) problems.push(`${slide.id}: linha sem expressão em ${s}`);
      }
      const js = plainCode(pick(step.expr, 'js') ?? '');
      const value: unknown = Function(`return (${js})`)();
      if (step.reset) previous = undefined;
      if (previous !== undefined && value !== previous) {
        problems.push(`${slide.id}: "${js}" vale ${String(value)}, a linha anterior valia ${String(previous)}`);
      }
      previous = value;
    }
  }
  return problems;
}
