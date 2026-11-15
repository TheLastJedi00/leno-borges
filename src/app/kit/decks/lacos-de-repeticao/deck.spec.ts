import { type PredictSlide, type SortSlide, pick, tracks } from '../../kit.data';
import { sceneAt } from '../../ui/code/code-markup';
import {
  branchProblems,
  deckProblems,
  jsOutputProblems,
  snippetProblems,
  traceProblems,
} from '../deck-checks';
import { code, only } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'lacos-de-repeticao')!;

describe('aula laços de repetição', () => {
  it('vem logo depois de listas', () => {
    const slugs = tracks[0].lessons.map((l) => l.slug);
    expect(slugs.indexOf('lacos-de-repeticao')).toBe(slugs.indexOf('listas') + 1);
  });

  it('trechos de código nas três sintaxes', () => {
    expect(snippetProblems(code)).toEqual([]);
    expect(snippetProblems({ forIn: { ...only.forIn, java: '-' } })).toEqual([]);
    expect(only.removeInForEach).toContain('{t:String} {n:fruta} : {n:frutas}');
  });

  it('estrutura do deck e contagem do catálogo', () => {
    expect(deckProblems(deck, lesson)).toEqual([]);
  });

  it('a saída em JS mostrada no slide é a que o código imprime', () => {
    expect(jsOutputProblems(deck)).toEqual([]);
  });

  it('o laço infinito não roda nas conferências', () => {
    const infinite = deck.slides.find((s) => s.id === 'laco-infinito');
    expect(infinite?.kind === 'scene' && infinite.noRun).toBeTrue();
  });

  it('os testes de mesa batem com o código', () => {
    expect(traceProblems(deck)).toEqual([]);
  });

  it('exercício contagem regressiva: saídas, voltas e desafios', () => {
    expect(branchProblems(deck)).toEqual([]);
  });

  it('a pista termina com tantas voltas quantas linhas foram impressas (cenas com saída final)', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'scene' || slide.noRun || slide.id === 'continue') continue;
      const last = sceneAt(slide.steps, slide.steps.length - 1);
      const loop = pick(last.loop ?? undefined, 'js');
      if (!loop || loop.answer !== false || loop.kind === 'do') continue;
      const out = pick(last.output ?? undefined, 'js') ?? '';
      const lines = out.split('\n').filter((l) => l !== 'Fim');
      expect(loop.laps).withContext(slide.id).toBe(lines.length);
    }
  });

  it('exercício de prever: 5 linhas', () => {
    const predict = deck.slides.find((s): s is PredictSlide => s.kind === 'predict')!;
    expect(predict.options[predict.answer]).toBe('5 linhas');
  });

  it('exercício de classificar: três laços, duas situações cada', () => {
    const sort = deck.slides.find((s): s is SortSlide => s.kind === 'sort')!;
    for (const bin of sort.bins) {
      expect(sort.items.filter((i) => i.bin === bin.id).length).withContext(bin.id).toBe(2);
    }
  });
});
