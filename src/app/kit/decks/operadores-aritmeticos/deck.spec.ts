import { tracks } from '../../kit.data';
import { deckProblems, exprProblems, jsOutputProblems, snippetProblems } from '../deck-checks';
import { code } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'operadores-aritmeticos')!;

describe('aula operadores aritméticos', () => {
  it('vem logo depois de variáveis e tipos', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('operadores-aritmeticos')).toBe(slugs.indexOf('variaveis-e-tipos') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
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

  it('a resposta dos exercícios bate com a conta', () => {
    const r = 20 * 3 - 10 / 2;
    let x = 7;
    x += 3;
    x %= 4;
    x *= 5;
    const answers: Record<string, number> = { 'exercicio-prioridade': r, 'exercicio-atalhos': x };
    for (const slide of deck.slides) {
      if (slide.kind !== 'predict') continue;
      expect(Number(slide.options[slide.answer])).withContext(slide.id).toBe(answers[slide.id]);
    }
  });
});
