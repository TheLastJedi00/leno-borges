import { type ChestState, type PredictSlide, lampOn, tracks } from '../../kit.data';
import {
  deckProblems,
  exprProblems,
  jsOutputProblems,
  snippetProblems,
  truthProblems,
} from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'operadores-logicos')!;

describe('aula operadores lógicos', () => {
  it('vem logo depois de operadores relacionais', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('operadores-logicos')).toBe(slugs.indexOf('operadores-relacionais') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ fallback: { ...only.fallback, java: '-' } })).toEqual([]);
    expect(only.javaNoShortCircuit).toContain(' & ');
  });

  it('estrutura do deck e contagem do catálogo', () => {
    expect(deckProblems(deck, lesson)).toEqual([]);
  });

  it('as contas dos slides de expressão fecham', () => {
    expect(exprProblems(deck, lesson.syntaxes)).toEqual([]);
  });

  it('a saída em JS mostrada no slide é a que o código imprime', () => {
    expect(jsOutputProblems(deck)).toEqual([]);
  });

  it('as tabelas-verdade batem com os operadores', () => {
    expect(truthProblems(deck)).toEqual([]);
  });

  it('nenhum desafio de circuito começa resolvido', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'circuit') continue;
      for (const [i, c] of slide.challenges.entries()) {
        expect(lampOn(c.mode, c.start)).withContext(`desafio ${i + 1}`).not.toBe(c.goal);
      }
    }
  });

  it('exercício de prever: o baú da resposta é o único com true no fim', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    const last = predict.trace[predict.trace.length - 1].chests as ChestState[];
    const trues = last.filter((c) => c.item === 'true').map((c) => c.label);
    expect(trues).toEqual([predict.options[predict.answer]]);
    const n = 7;
    expect([n > 5 && n < 10, n < 5 || n > 8, !(n === 7)]).toEqual([true, false, false]);
  });

  it('ano bissexto: 2024 e 2000 sim, 1900 não', () => {
    const leap = (ano: number) => (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    expect([2024, 1900, 2000].map(leap)).toEqual([true, false, true]);
  });
});
