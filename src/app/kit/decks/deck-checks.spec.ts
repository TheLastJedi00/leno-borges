import type { Deck } from '../kit.data';
import { branchProblems } from './deck-checks';

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
