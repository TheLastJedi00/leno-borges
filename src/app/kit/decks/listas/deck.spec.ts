import { type PredictSlide, type SortSlide, pick, tracks } from '../../kit.data';
import { sceneAt } from '../../ui/code/code-markup';
import {
  branchProblems,
  deckProblems,
  exprProblems,
  jsOutputProblems,
  nodeFormat,
  snippetProblems,
} from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'listas')!;

describe('aula listas', () => {
  it('vem logo depois de switch case', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('listas')).toBe(slugs.indexOf('switch-case') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ sortText: { ...only.sortText, java: '-' } })).toEqual([]);
    expect(snippetProblems({ constList: { ...only.constList, java: '-' } })).toEqual([]);
  });

  it('Java usa List / ArrayList; o array só no slide exclusivo', () => {
    expect(code.create.java).toContain('{t:ArrayList}');
    for (const [name, snippet] of Object.entries(code)) {
      expect(snippet.java).withContext(name).not.toContain('{t:String}[]');
    }
    expect(only.javaArray).toContain('{t:String}[]');
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

  it('exercício escolha o índice: saídas, gavetas e desafios', () => {
    expect(branchProblems(deck)).toEqual([]);
  });

  it('o gaveteiro de cada etapa é a lista que o código mostra', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'scene' || (slide.syntaxes && !slide.syntaxes.includes('js'))) continue;
      slide.steps.forEach((_, i) => {
        const st = sceneAt(slide.steps, i);
        const list = pick(st.list ?? undefined, 'js');
        const out = pick(st.output ?? undefined, 'js');
        if (!list || !out || slide.steps[i].output === undefined) return;
        const shown = out.split('\n').filter((l) => l.startsWith('[')).at(-1);
        if (!shown) return;
        const values = list.items.map((it) => (it.value.startsWith('"') ? it.value.slice(1, -1) : Number(it.value)));
        expect(nodeFormat(values)).withContext(`${slide.id}, etapa ${i + 1}`).toBe(shown);
      });
    }
  });

  it('exercício de prever: Bia 3', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    expect(predict.options[predict.answer]).toBe('Bia 3');
  });

  it('exercício de classificar: quatro operações, duas situações cada', () => {
    const sort = deck.slides.find((s): s is SortSlide => s.kind === 'sort')!;
    for (const bin of sort.bins) {
      expect(sort.items.filter((i) => i.bin === bin.id).length).withContext(bin.id).toBe(2);
    }
  });
});
