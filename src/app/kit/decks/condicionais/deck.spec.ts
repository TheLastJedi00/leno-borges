import { type ChestState, type PredictSlide, type SortSlide, flowRoute, tracks } from '../../kit.data';
import { sceneAt } from '../../ui/code/code-markup';
import {
  branchProblems,
  deckProblems,
  exprProblems,
  jsOutputProblems,
  snippetProblems,
} from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'condicionais')!;

describe('aula condicionais', () => {
  it('vem logo depois de operadores lógicos', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('condicionais')).toBe(slugs.indexOf('operadores-logicos') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ truthy: { ...only.truthy, java: '-' } })).toEqual([]);
  });

  it('estrutura do deck e contagem do catálogo', () => {
    expect(deckProblems(deck, lesson)).toEqual([]);
  });

  it('as contas dos slides de expressão fecham', () => {
    expect(exprProblems(deck, lesson.syntaxes)).toEqual([]);
  });

  it('a saída em JS mostrada no slide é a que o código imprime, com cada valor da cena', () => {
    expect(jsOutputProblems(deck)).toEqual([]);
  });

  it('exercício escolha o valor: saídas, caminho e desafios', () => {
    expect(branchProblems(deck)).toEqual([]);
  });

  it('o fluxograma de cada cena termina na caixa que o código imprime', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'scene') continue;
      slide.steps.forEach((_, i) => {
        const st = sceneAt(slide.steps, i);
        const flow = st.flow && 'conditions' in st.flow ? st.flow : undefined;
        const out = typeof st.output === 'string' ? st.output.split('\n') : undefined;
        if (!flow || !out || st.flow === null) return;
        const { taken } = flowRoute(flow);
        if (typeof taken !== 'number') return;
        const box = flow.outcomes[taken].replace(/^"(.*)"$/, '$1');
        expect(out).withContext(`${slide.id}, etapa ${i + 1}`).toContain(box);
      });
    }
  });

  it('exercício de classificar: cada nota no conceito que o else if dá', () => {
    const sort = deck.slides.find((s): s is SortSlide => s.kind === 'sort')!;
    const grade = (n: number) => (n >= 9 ? 'a' : n >= 7 ? 'b' : n >= 5 ? 'c' : 'reprovado');
    for (const item of sort.items) expect(item.bin).withContext(item.value).toBe(grade(+item.value));
  });

  it('exercício de prever: o saldo do fim é a resposta', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    const last = predict.trace[predict.trace.length - 1].chests as ChestState[];
    expect(last.find((c) => c.label === 'saldo')?.item).toBe(predict.options[predict.answer]);
  });
});
