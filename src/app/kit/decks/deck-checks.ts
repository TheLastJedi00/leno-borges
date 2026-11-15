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
  sceneAt,
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
    const loop = pick(slide.loop, 'js');
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
      if (loop) {
        // Pista: cada volta do exercício imprime uma linha.
        const printedLines = expected ? expected.split('\n').length : 0;
        if ((choice.laps ?? 0) !== printedLines) {
          problems.push(`${slide.id}, valor ${choice.value}: ${choice.laps ?? 0} voltas na pista, a saída tem ${printedLines} linhas`);
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

/**
 * Teste de mesa: roda o código em JS anotando as colunas `js` antes da linha `at` (a cada volta)
 * e antes da linha `end` (depois do laço); a coluna `out` recebe o que foi impresso até a próxima
 * anotação, separado por vírgula. Compara anotação por anotação com as linhas da tabela.
 */
export function traceProblems(deck: Deck): string[] {
  const problems: string[] = [];
  for (const slide of deck.slides) {
    if (slide.kind !== 'trace') continue;
    const exprs = slide.columns.map((c) => c.js).filter((e): e is string => !!e);
    const lines = plainCode(pick(slide.code, 'js') ?? '').split('\n');
    const snap = `__snap(() => [${exprs.join(', ')}]);`;
    if (slide.end !== undefined) lines.splice(slide.end - 1, 0, snap);
    lines.splice(slide.at - 1, 0, snap);

    const snaps: { values: string[]; out: string[] }[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) => snaps.at(-1)?.out.push(args.map((a) => nodeFormat(a)).join(' ')),
    };
    const __snap = (read: () => unknown[]) => {
      if (snaps.length > 100) throw new Error('mais de 100 voltas');
      snaps.push({ values: read().map((v) => nodeFormat(v)), out: [] });
    };
    try {
      Function('console', '__snap', lines.join('\n'))(fakeConsole, __snap);
    } catch (error) {
      problems.push(`${slide.id}: ${String(error)}`);
      continue;
    }

    if (snaps.length !== slide.rows.length) {
      problems.push(`${slide.id}: ${snaps.length} anotações, a tabela tem ${slide.rows.length} linhas`);
      continue;
    }
    snaps.forEach((s, r) => {
      let e = 0;
      slide.columns.forEach((col, c) => {
        const actual = col.js ? s.values[e++] : col.out ? s.out.join(', ') : undefined;
        const shown = slide.rows[r].cells[c];
        if (actual !== undefined && actual !== shown) {
          problems.push(`${slide.id}, linha ${r + 1}, coluna ${c + 1}: o código dá ${JSON.stringify(actual)}, a tabela mostra ${JSON.stringify(shown)}`);
        }
      });
    });
  }
  return problems;
}

/** Texto do valor sem as aspas do código (`"Ana"` → `Ana`). */
const unquote = (value: string) => value.replace(/^"(.*)"$/, '$1');

/**
 * Pilha de chamadas: a sala de baixo é o `main` no Java e o arquivo (sem nome) no JS/TS. Numa
 * cena, a etapa com `returning` é seguida de uma etapa que fecha a sala do topo, e o valor
 * devolvido aparece num baú, na saída ou num baú da sala que recebeu o valor. No exercício, o valor devolvido é o que o
 * programa imprime e a sala do topo tem o baú da variável escolhida.
 */
export function stackProblems(deck: Deck, syntaxes: readonly Syntax[]): string[] {
  const problems: string[] = [];
  const bottom = (s: Syntax, name: string | undefined, where: string) => {
    if (s === 'java' && name !== 'main') problems.push(`${where}: a sala de baixo do Java não é o main`);
    if (s !== 'java' && name !== undefined) problems.push(`${where}: a sala de baixo do ${s} tem nome (${name})`);
  };
  for (const slide of deck.slides) {
    for (const s of slide.syntaxes ?? syntaxes) {
      if (slide.kind === 'branch' && slide.stack) {
        const stack = pick(slide.stack, s);
        if (!stack) continue;
        bottom(s, stack.frames[0]?.name, `${slide.id} (${s})`);
        const top = stack.frames.at(-1);
        if (!top?.vars?.some((v) => v.name === slide.variable)) {
          problems.push(`${slide.id} (${s}): a sala do topo não tem o baú ${slide.variable}`);
        }
        for (const choice of slide.choices) {
          const out = pick(choice.output, s) ?? '';
          if (choice.returns === undefined || unquote(choice.returns) !== out) {
            problems.push(`${slide.id} (${s}), valor ${choice.value}: devolve ${choice.returns}, imprime ${JSON.stringify(out)}`);
          }
        }
      }
      if (slide.kind !== 'scene') continue;
      const states = slide.steps.map((_, i) => sceneAt(slide.steps, i));
      states.forEach((state, i) => {
        const stack = pick(state.stack ?? undefined, s);
        if (!stack) return;
        const where = `${slide.id} (${s}), etapa ${i + 1}`;
        bottom(s, stack.frames[0]?.name, where);
        if (!stack.returning || slide.steps[i].stack === undefined) return;
        const next = states[i + 1];
        const after = next && slide.steps[i + 1].stack !== undefined ? pick(next.stack ?? undefined, s) : undefined;
        if (!after || after.frames.length !== stack.frames.length - 1) {
          problems.push(`${where}: o return não fecha a sala do topo na etapa seguinte`);
          return;
        }
        const value = unquote(stack.returning);
        const inChest = (pick(next.chests, s) ?? []).some((c) => c.item !== undefined && unquote(c.item) === value);
        const inOutput = (pick(next.output ?? undefined, s) ?? '').includes(value);
        const inFrame = (after.frames.at(-1)?.vars ?? []).some((v) => unquote(v.value) === value);
        if (!inChest && !inOutput && !inFrame) {
          problems.push(`${where}: o valor ${stack.returning} não chega a um baú nem à saída`);
        }
      });
    }
  }
  return problems;
}
