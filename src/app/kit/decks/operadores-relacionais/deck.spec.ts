import { type ChestState, type PredictSlide, tracks } from '../../kit.data';
import { deckProblems, exprProblems, snippetProblems } from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'operadores-relacionais')!;

describe('aula operadores relacionais', () => {
  it('vem logo depois de operadores aritméticos', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('operadores-relacionais')).toBe(slugs.indexOf('operadores-aritmeticos') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(only.looseEquals).toContain('===');
    expect(only.javaStringEquals).toContain('equals');
  });

  it('estrutura do deck e contagem do catálogo', () => {
    expect(deckProblems(deck, lesson)).toEqual([]);
  });

  it('as contas dos slides de expressão fecham', () => {
    expect(exprProblems(deck, lesson.syntaxes)).toEqual([]);
  });

  it('exercício de classificar: cada comparação no baú da sua resposta', () => {
    const sort = deck.slides.find((s) => s.kind === 'sort');
    expect(sort).toBeDefined();
    if (sort?.kind !== 'sort') return;
    for (const item of sort.items) {
      const value = Function(`return (${item.value})`)() as boolean;
      expect(String(value)).withContext(item.value).toBe(item.bin);
    }
  });

  it('exercício de prever: o baú da resposta é o único com false no fim', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    const last = predict.trace[predict.trace.length - 1].chests as ChestState[];
    const falses = last.filter((c) => c.item === 'false').map((c) => c.label);
    expect(falses).toEqual([predict.options[predict.answer]]);
    // Mesmo resultado rodando as comparações de verdade
    const a = 4;
    expect([a * 2 > 7, a % 2 === 1, a + 1 >= 5]).toEqual([true, false, true]);
  });
});
