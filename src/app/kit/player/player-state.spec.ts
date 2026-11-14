import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import type { Deck, Lesson, Slide } from '../kit.data';
import {
  PlayerState,
  type SyncMessage,
  clampIndex,
  nextPosition,
  prevPosition,
  remapIndex,
  visibleSlides,
} from './player-state';
import { resolveMode, resolveSyntax } from '../kit-prefs';

function scene(id: string, depth: 'core' | 'extra', steps = 1, extra: Partial<Slide> = {}): Slide {
  return {
    id,
    kind: 'scene',
    title: id,
    depth,
    notes: [],
    steps: Array.from({ length: steps }, () => ({})),
    ...extra,
  } as Slide;
}

// a(E,2 etapas) b(A) c(E) d(A, só java) e(A, só js) f(E,3 etapas)
const deck: Deck = {
  slides: [
    scene('a', 'core', 2),
    scene('b', 'extra'),
    scene('c', 'core'),
    scene('d', 'extra', 1, { syntaxes: ['java'] }),
    scene('e', 'extra', 1, { syntaxes: ['js', 'ts'] }),
    scene('f', 'core', 3),
  ],
};

const lesson: Lesson = {
  slug: 'variaveis-e-tipos',
  syntaxes: ['js', 'ts', 'java'],
  counts: { essencial: 3, completo: 5 },
  load: async () => deck,
};

const ids = (slides: Slide[]) => slides.map((s) => s.id).join('');

describe('visibleSlides', () => {
  it('filtra por roteiro e sintaxe', () => {
    expect(ids(visibleSlides(deck, 'essencial', 'js'))).toBe('acf');
    expect(ids(visibleSlides(deck, 'completo', 'js'))).toBe('abcef');
    expect(ids(visibleSlides(deck, 'completo', 'java'))).toBe('abcdf');
  });
});

describe('navegação', () => {
  const slides = visibleSlides(deck, 'completo', 'js');

  it('percorre as etapas antes de trocar de slide', () => {
    expect(nextPosition(slides, { index: 0, step: 0 })).toEqual({ index: 0, step: 1 });
    expect(nextPosition(slides, { index: 0, step: 1 })).toEqual({ index: 1, step: 0 });
  });

  it('para no fim e no começo', () => {
    expect(nextPosition(slides, { index: 4, step: 2 })).toEqual({ index: 4, step: 2 });
    expect(prevPosition(slides, { index: 0, step: 0 })).toEqual({ index: 0, step: 0 });
  });

  it('voltar abre o slide anterior na última etapa', () => {
    expect(prevPosition(slides, { index: 1, step: 0 })).toEqual({ index: 0, step: 1 });
  });

  it('limita o índice vindo da URL', () => {
    expect(clampIndex(99, 5)).toBe(4);
    expect(clampIndex(-3, 5)).toBe(0);
    expect(clampIndex(NaN, 5)).toBe(0);
  });
});

describe('remapIndex', () => {
  it('mantém o mesmo slide quando ele existe no novo roteiro', () => {
    expect(remapIndex(deck.slides, 'c', visibleSlides(deck, 'essencial', 'js'))).toBe(1);
  });

  it('cai no essencial anterior mais próximo', () => {
    expect(remapIndex(deck.slides, 'b', visibleSlides(deck, 'essencial', 'js'))).toBe(0);
    expect(remapIndex(deck.slides, 'e', visibleSlides(deck, 'essencial', 'js'))).toBe(1);
  });

  it('troca de sintaxe some com o slide exclusivo', () => {
    expect(remapIndex(deck.slides, 'd', visibleSlides(deck, 'completo', 'js'))).toBe(2);
  });
});

describe('preferências', () => {
  it('sintaxe: query > salva > primeira da aula', () => {
    expect(resolveSyntax('java', 'ts', ['js', 'ts', 'java'])).toBe('java');
    expect(resolveSyntax(null, 'ts', ['js', 'ts', 'java'])).toBe('ts');
    expect(resolveSyntax('python', 'cobol', ['js', 'ts', 'java'])).toBe('js');
    expect(resolveSyntax('java', null, ['js', 'ts'])).toBe('js');
  });

  it('roteiro: query > salvo > completo', () => {
    expect(resolveMode('essencial', 'completo')).toBe('essencial');
    expect(resolveMode(undefined, 'essencial')).toBe('essencial');
    expect(resolveMode('x', null)).toBe('completo');
  });
});

describe('PlayerState', () => {
  let state: PlayerState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), PlayerState],
    });
    state = TestBed.inject(PlayerState);
    state.init(deck, lesson, 'js', 'completo', 0);
  });

  it('troca de roteiro mantendo o slide atual', () => {
    state.goTo(2); // c
    state.setMode('essencial');
    expect(state.current()?.id).toBe('c');
    expect(state.pos().index).toBe(1);
  });

  it('troca de roteiro em slide extra cai no essencial anterior, na etapa 0', () => {
    state.goTo(1); // b
    state.setMode('essencial');
    expect(state.current()?.id).toBe('a');
    expect(state.pos().step).toBe(0);
  });

  it('last vai para a última etapa do último slide', () => {
    state.last();
    expect(state.current()?.id).toBe('f');
    expect(state.isLast()).toBeTrue();
  });

  it('ignora sintaxe que a aula não oferece', () => {
    state.setSyntax('java');
    expect(state.syntax()).toBe('java');
    state.lesson.set({ ...lesson, syntaxes: ['js'] });
    state.setSyntax('ts');
    expect(state.syntax()).toBe('java');
  });

  describe('convite para a próxima aula', () => {
    const upNext: Lesson = { ...lesson, slug: 'operadores-aritmeticos' as Lesson['slug'] };

    it('sem próxima aula, avançar no fim não faz nada', () => {
      state.last();
      state.next();
      expect(state.asking()).toBeFalse();
      expect(state.canAdvance()).toBeFalse();
    });

    it('no fim abre o convite; avançar de novo segue; voltar fecha', () => {
      state.init(deck, lesson, 'js', 'completo', 0, upNext);
      const follow = jasmine.createSpy('follow');
      state.onFollow = follow;
      state.last();
      expect(state.canAdvance()).toBeTrue();

      state.next();
      expect(state.asking()).toBeTrue();
      expect(state.current()?.id).toBe('f');

      state.prev();
      expect(state.asking()).toBeFalse();
      expect(state.isLast()).toBeTrue();

      state.next();
      state.next();
      expect(follow).toHaveBeenCalledTimes(1);
      expect(state.asking()).toBeFalse();
    });

    it('navegar para outro slide fecha o convite', () => {
      state.init(deck, lesson, 'js', 'completo', 0, upNext);
      state.last();
      state.next();
      state.first();
      expect(state.asking()).toBeFalse();
    });

    it('recebe o convite e o pedido de seguir de outra janela', () => {
      state.init(deck, lesson, 'js', 'completo', 0, upNext);
      const follow = jasmine.createSpy('follow');
      state.onFollow = follow;
      const receive = (m: SyncMessage) => (state as unknown as { receive(m: SyncMessage): void }).receive(m);

      receive({ type: 'state', slideId: 'f', step: 2, syntax: 'js', mode: 'completo', ask: true });
      expect(state.asking()).toBeTrue();

      receive({ type: 'lesson', lesson: 'outra' });
      expect(follow).not.toHaveBeenCalled();
      receive({ type: 'lesson', lesson: 'operadores-aritmeticos' });
      expect(follow).toHaveBeenCalledTimes(1);
    });
  });
});
