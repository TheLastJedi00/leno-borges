import type { Deck } from '../kit.data';
import { branchProblems, jsOutputProblems, nodeFormat, runJs } from './deck-checks';

const deck = (output: string, answers: boolean[], goals = ['Entra']): Deck => ({
  slides: [
    {
      id: 'b',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 't',
      lead: 'l',
      notes: ['n'],
      variable: 'idade',
      code: `{k:let} {n:idade} = {v:@@};\n{k:if} ({n:idade} >= {v:18}) {f:console.log}({v:"Entra"});`,
      flow: { conditions: ['idade >= 18'], outcomes: ['"Entra"'] },
      choices: [{ value: '20', answers, output }],
      goals,
    },
  ],
});

describe('branchProblems', () => {
  it('aceita saída, caminho e desafios que batem', () => {
    expect(branchProblems(deck('Entra', [true]))).toEqual([]);
  });

  it('acusa saída errada, caminho errado e desafio sem solução', () => {
    expect(branchProblems(deck('Sai', [true])).length).toBe(3);
    expect(branchProblems(deck('Entra', [false]))).toEqual([
      'b, valor 20: fluxograma termina em "", a saída é "Entra"',
    ]);
    expect(branchProblems(deck('Entra', [true], ['Entra', 'X'])).length).toBe(1);
  });
});

describe('branchProblems com triagem', () => {
  const sw = (output: string): Deck => ({
    slides: [
      {
        id: 's',
        kind: 'branch',
        depth: 'extra',
        tag: 'Exercício',
        title: 't',
        lead: 'l',
        notes: ['n'],
        variable: 'dia',
        code: `{k:let} {n:dia} = {v:@@};\n{k:switch} ({n:dia}) {\n  {k:case} {v:1}: {f:console.log}({v:"Dom"});\n  {k:default}: {f:console.log}({v:"?"});\n}`,
        sorter: { cases: [{ label: '1', out: '"Dom"' }], fallback: { out: '"?"' } },
        choices: [{ value: '1', output }],
        goals: [output],
      },
    ],
  });

  it('confere o que a queda imprime', () => {
    expect(branchProblems(sw('Dom\n?'))).toEqual([]);
    expect(branchProblems(sw('Dom')).length).toBe(2);
  });
});

describe('runJs', () => {
  it('imprime listas como o console.log do Node', () => {
    expect(runJs('console.log(["maçã", "uva"]);')).toBe("[ 'maçã', 'uva' ]");
    expect(runJs('console.log([10, 9, 1].sort());')).toBe('[ 1, 10, 9 ]');
    expect(runJs('console.log([]);')).toBe('[]');
    expect(runJs('console.log("maçã", 3);')).toBe('maçã 3');
  });

  it('aspas dentro da lista como o Node', () => {
    expect(nodeFormat(["d'água", 'x'])).toBe(`[ "d'água", 'x' ]`);
    expect(nodeFormat([undefined, true])).toBe('[ undefined, true ]');
  });
});

describe('noRun', () => {
  const scene = (noRun: boolean): Deck => ({
    slides: [
      {
        id: 'infinito',
        kind: 'scene',
        depth: 'core',
        title: 't',
        notes: ['n'],
        noRun,
        code: '{f:console.log}({v:1});',
        steps: [{ output: '1 1 1 ...' }],
      },
    ],
  });

  it('a cena com noRun não roda nas conferências', () => {
    expect(jsOutputProblems(scene(false)).length).toBe(1);
    expect(jsOutputProblems(scene(true))).toEqual([]);
  });
});
