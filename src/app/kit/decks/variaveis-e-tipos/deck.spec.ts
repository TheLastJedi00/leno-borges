import { SYNTAXES, type Slide, pick, stepCount, tracks } from '../../kit.data';
import { visibleSlides } from '../../player/player-state';
import { parseCode } from '../../ui/code/code-markup';
import { code } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons[0];

describe('aula variáveis e tipos', () => {
  it('todo trecho de código existe nas três sintaxes', () => {
    for (const [name, snippet] of Object.entries(code)) {
      for (const s of SYNTAXES) {
        expect(snippet[s]?.trim().length).withContext(`${name}.${s}`).toBeGreaterThan(0);
      }
    }
  });

  it('todo slide com código tem código em cada sintaxe em que aparece', () => {
    const withCode = deck.slides.filter(
      (s): s is Extract<Slide, { code?: unknown }> => 'code' in s && !!s.code,
    );
    for (const slide of withCode) {
      for (const s of slide.syntaxes ?? lesson.syntaxes) {
        const markup = pick(slide.code, s);
        expect(markup).withContext(`${slide.id}.${s}`).toBeTruthy();
        expect(parseCode(markup!).length).toBeGreaterThan(0);
      }
    }
  });

  it('ids de slide são únicos', () => {
    const ids = deck.slides.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo slide tem tópicos de fala e pelo menos uma etapa', () => {
    for (const slide of deck.slides) {
      expect(slide.notes.length).withContext(slide.id).toBeGreaterThan(0);
      expect(stepCount(slide)).toBeGreaterThan(0);
    }
  });

  it('slides extra têm selo; essenciais não', () => {
    for (const slide of deck.slides) {
      expect(!!slide.tag).withContext(slide.id).toBe(slide.depth === 'extra');
    }
  });

  it('a contagem do catálogo bate com o deck em todas as sintaxes', () => {
    for (const s of lesson.syntaxes) {
      expect(visibleSlides(deck, 'essencial', s).length).withContext(s).toBe(lesson.counts.essencial);
      expect(visibleSlides(deck, 'completo', s).length).withContext(s).toBe(lesson.counts.completo);
    }
  });

  it('texto do deck não usa travessão', () => {
    expect(JSON.stringify(deck)).not.toContain('—');
  });
});
