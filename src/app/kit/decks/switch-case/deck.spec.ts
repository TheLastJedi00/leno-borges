import { type PredictSlide, type SortSlide, sorterRoute, tracks } from '../../kit.data';
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

const lesson = tracks[0].lessons.find((l) => l.slug === 'switch-case')!;

describe('aula switch case', () => {
  it('vem logo depois de condicionais', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('switch-case')).toBe(slugs.indexOf('condicionais') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ strict: { ...only.strict, java: '-' } })).toEqual([]);
    expect(snippetProblems({ switchTrue: { ...only.switchTrue, java: '-' } })).toEqual([]);
    expect(only.javaArrow).toContain('->');
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

  it('exercício escolha o valor: saídas, queda e desafios', () => {
    expect(branchProblems(deck)).toEqual([]);
  });

  it('a triagem de cada cena roda o que o código imprime', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'scene') continue;
      slide.steps.forEach((_, i) => {
        const st = sceneAt(slide.steps, i);
        const sorter = st.sorter && 'cases' in st.sorter ? st.sorter : undefined;
        if (!sorter?.dropped || typeof st.output !== 'string') return;
        const outs = [...sorter.cases.map((c) => c.out ?? ''), sorter.fallback?.out ?? ''];
        const ran = sorterRoute(sorter).ran.map((r) => outs[r].replace(/^"(.*)"$/, '$1')).filter(Boolean);
        expect(ran.join('\n')).withContext(`${slide.id}, etapa ${i + 1}`).toBe(st.output);
      });
    }
  });

  it('exercício de prever: Salvar e Sair', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    expect(predict.options[predict.answer]).toBe('Salvar e Sair');
  });

  it('exercício de classificar: só switch e if', () => {
    const sort = deck.slides.find((s): s is SortSlide => s.kind === 'sort')!;
    expect(new Set(sort.items.map((i) => i.bin))).toEqual(new Set(['switch', 'if']));
  });
});
