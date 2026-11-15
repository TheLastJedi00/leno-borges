import { type PredictSlide, type SortSlide, pick, tracks } from '../../kit.data';
import {
  branchProblems,
  deckProblems,
  jsOutputProblems,
  snippetProblems,
  stackProblems,
} from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'funcoes')!;

describe('aula funções', () => {
  it('vem logo depois de laços de repetição', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('funcoes')).toBe(slugs.indexOf('lacos-de-repeticao') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ arrow: { ...only.arrow, java: '-' } })).toEqual([]);
    expect(only.overload).toContain('{c:// no main}');
  });

  it('no Java, as funções vêm antes do // no main (menos nos slides com a classe inteira)', () => {
    for (const [name, snippet] of Object.entries(code)) {
      const java = snippet.java;
      if (java.includes('{k:class}') || name === 'repeated') continue;
      expect(java).withContext(name).toContain('{c:// no main}');
      expect(java.indexOf('{k:static}')).withContext(name).toBeLessThan(java.indexOf('{c:// no main}'));
    }
    expect(code.wholeFile.java).toContain('{f:main}({t:String}[] {n:args})');
  });

  it('estrutura do deck e contagem do catálogo', () => {
    expect(deckProblems(deck, lesson)).toEqual([]);
  });

  it('a saída em JS mostrada no slide é a que o código imprime', () => {
    expect(jsOutputProblems(deck)).toEqual([]);
  });

  it('pilha de chamadas: main no Java, o return fecha a sala e o valor chega', () => {
    expect(stackProblems(deck, lesson.syntaxes)).withContext(stackProblems(deck, lesson.syntaxes).join(' | ')).toEqual([]);
  });

  it('exercício escolha a nota: saídas, valor devolvido e desafios', () => {
    expect(branchProblems(deck)).toEqual([]);
  });

  it('o slide 4 revela o main só no Java', () => {
    const slide = deck.slides.find((s) => s.id === 'onde-mora');
    const java = slide?.kind === 'scene' ? pick(slide.code, 'java') : '';
    const js = slide?.kind === 'scene' ? pick(slide.code, 'js') : '';
    expect(java).toContain('{f:main}');
    expect(js).not.toContain('main');
  });

  it('exercício de prever: 12', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    expect(predict.options[predict.answer]).toBe('12');
  });

  it('exercício de classificar: dois escaninhos, três situações cada', () => {
    const sort = deck.slides.find((s): s is SortSlide => s.kind === 'sort')!;
    for (const bin of sort.bins) {
      expect(sort.items.filter((i) => i.bin === bin.id).length).withContext(bin.id).toBe(3);
    }
  });
});
