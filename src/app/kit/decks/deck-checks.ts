import {
  type Deck,
  type Lesson,
  SYNTAXES,
  type Slide,
  type Syntax,
  flowRoute,
  pick,
  sorterRoute,
  stepCount,
} from '../kit.data';
import { visibleSlides } from '../player/player-state';
import {
  codeWithValue,
  finishedRuns,
  parseCode,
  parseExpr,
  plainCode,
} from '../ui/code/code-markup';

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

/**
 * Cenas com código: roda o trecho em JavaScript e compara o que ele imprime com a saída da última
 * etapa no slide (quando a saída de JS não é um erro). Pega saída escrita errada à mão.
 */
export function jsOutputProblems(deck: Deck): string[] {
  const problems: string[] = [];
  for (const slide of deck.slides) {
    if (slide.kind !== 'scene' || !slide.code || slide.noRun) continue;
    if (slide.syntaxes && !slide.syntaxes.includes('js')) continue;
    for (const run of finishedRuns(slide.steps)) {
      const expected = pick(run.output ?? undefined, 'js');
      if (expected === undefined || pick(run.outputTone, 'js') === 'error') continue;
      const actual = runJs(plainCode(codeWithValue(pick(slide.code, 'js') ?? '', run.value)));
      if (actual !== expected) {
        const at = run.value === undefined ? '' : ` com ${run.value}`;
        problems.push(`${slide.id}${at}: imprime ${JSON.stringify(actual)}, o slide mostra ${JSON.stringify(expected)}`);
      }
    }
  }
  return problems;
}

/**
 * Tabelas-verdade: as colunas de entrada dão nome às variáveis (`a`, `b`) e cada coluna de
 * resultado é calculada de verdade em JavaScript, linha por linha.
 */
export function truthProblems(deck: Deck): string[] {
  const problems: string[] = [];
  for (const slide of deck.slides) {
    if (slide.kind !== 'truth') continue;
    const head = (pick(slide.head, 'js') ?? []).map((h) => plainCode(h));
    const inputs = head.filter((_, c) => !slide.results.includes(c));
    slide.rows.forEach((row, r) => {
      const values = row.filter((_, c) => !slide.results.includes(c));
      for (const c of slide.results) {
        const actual = Function(...inputs, `return (${head[c]})`)(...values) as boolean;
        if (actual !== row[c]) {
          problems.push(`${slide.id}, linha ${r + 1}: ${head[c]} dá ${actual}, a tabela mostra ${row[c]}`);
        }
      }
    });
  }
  return problems;
}

/**
 * Valor como o `console.log` do Node mostra no terminal: texto solto sem aspas, listas com
 * espaço depois do `[` e textos dentro da lista entre aspas simples (`[ 'maçã', 1 ]`). Vale para
 * listas curtas (o Node quebra linha nas compridas, que os slides não usam).
 */
export function nodeFormat(value: unknown, nested = false): string {
  if (Array.isArray(value)) {
    return value.length ? `[ ${value.map((v) => nodeFormat(v, true)).join(', ')} ]` : '[]';
  }
  if (typeof value === 'string' && nested) {
    return value.includes("'") && !value.includes('"') ? `"${value}"` : `'${value.replaceAll("'", "\\'")}'`;
  }
  return String(value);
}

/** Roda um trecho de JS com `console.log` falso e devolve o que ele imprimiu. */
export function runJs(code: string): string {
  const printed: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => printed.push(args.map((a) => nodeFormat(a)).join(' ')),
  };
  try {
    Function('console', code)(fakeConsole);
  } catch (error) {
    printed.push(String(error));
  }
  return printed.join('\n');
}

/**
 * Exercício "escolha o valor": roda o código em JS com cada valor e compara com a saída do
 * valor; confere que o fluxograma termina na caixa que imprime essa saída e que todo desafio
 * tem um valor que o resolve.
 */
export function branchProblems(deck: Deck): string[] {
  const problems: string[] = [];
  for (const slide of deck.slides) {
    if (slide.kind !== 'branch') continue;
    const code = plainCode(pick(slide.code, 'js') ?? '');
    const flow = pick(slide.flow, 'js');
    const sorter = pick(slide.sorter, 'js');
    const list = pick(slide.list, 'js');
    for (const choice of slide.choices) {
      const expected = pick(choice.output, 'js') ?? '';
      const actual = runJs(codeWithValue(code, choice.value));
      if (actual !== expected) {
        problems.push(`${slide.id}, valor ${choice.value}: imprime ${JSON.stringify(actual)}, o slide mostra ${JSON.stringify(expected)}`);
      }
      if (sorter) {
        const { ran } = sorterRoute({ ...sorter, value: choice.value, dropped: true });
        const outs = [...sorter.cases.map((c) => c.out ?? ''), sorter.fallback?.out ?? ''];
        const shown = ran.map((i) => outs[i].replace(/^"(.*)"$/, '$1')).filter(Boolean).join('\n');
        if (shown !== expected) {
          problems.push(`${slide.id}, valor ${choice.value}: triagem roda ${JSON.stringify(shown)}, a saída é ${JSON.stringify(expected)}`);
        }
      }
      if (list) {
        // Gaveteiro: a gaveta do índice escolhido guarda o que o código imprime.
        const item = list.items[Number(choice.value)];
        const shown = item ? item.value.replace(/^"(.*)"$/, '$1') : 'undefined';
        if (shown !== expected) {
          problems.push(`${slide.id}, valor ${choice.value}: gaveta com ${JSON.stringify(shown)}, a saída é ${JSON.stringify(expected)}`);
        }
      }
      if (flow) {
        const { taken } = flowRoute({ ...flow, answers: choice.answers ?? [] });
        const shown = typeof taken === 'number' ? flow.outcomes[taken].replace(/^"(.*)"$/, '$1') : '';
        if (taken === null) problems.push(`${slide.id}, valor ${choice.value}: fluxograma sem decisão`);
        else if (shown !== expected) {
          problems.push(`${slide.id}, valor ${choice.value}: fluxograma termina em ${JSON.stringify(shown)}, a saída é ${JSON.stringify(expected)}`);
        }
      }
    }
    for (const goal of slide.goals) {
      if (!slide.choices.some((c) => (pick(c.output, 'js') ?? '') === goal)) {
        problems.push(`${slide.id}: nenhum valor resolve o desafio ${JSON.stringify(goal)}`);
      }
    }
  }
  return problems;
}
