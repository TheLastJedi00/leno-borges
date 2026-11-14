import { DestroyRef, Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { prefs } from '../kit-prefs';
import { type Deck, type Lesson, type Mode, type Slide, type Syntax, stepCount } from '../kit.data';

/** Posição no roteiro ativo: índice do slide entre os visíveis e etapa dentro dele. */
export interface Position {
  index: number;
  step: number;
}

/** Slides do roteiro e da sintaxe ativos, na ordem do deck. */
export function visibleSlides(deck: Deck, mode: Mode, syntax: Syntax): Slide[] {
  return deck.slides.filter(
    (s) =>
      (mode === 'completo' || s.depth === 'core') && (!s.syntaxes || s.syntaxes.includes(syntax)),
  );
}

export function nextPosition(slides: Slide[], pos: Position): Position {
  const slide = slides[pos.index];
  if (!slide) return pos;
  if (pos.step < stepCount(slide) - 1) return { index: pos.index, step: pos.step + 1 };
  if (pos.index < slides.length - 1) return { index: pos.index + 1, step: 0 };
  return pos;
}

/** Volta uma etapa; na primeira etapa, abre o slide anterior já na última etapa. */
export function prevPosition(slides: Slide[], pos: Position): Position {
  if (pos.step > 0) return { index: pos.index, step: pos.step - 1 };
  if (pos.index > 0) {
    const index = pos.index - 1;
    return { index, step: stepCount(slides[index]) - 1 };
  }
  return pos;
}

/**
 * Índice, em `target`, do slide equivalente a `fromId` depois de trocar roteiro ou sintaxe:
 * o mesmo slide se ele existir, senão o anterior mais próximo que exista no novo roteiro.
 */
export function remapIndex(all: Slide[], fromId: string, target: Slide[]): number {
  const ids = target.map((s) => s.id);
  const direct = ids.indexOf(fromId);
  if (direct >= 0) return direct;
  const from = all.findIndex((s) => s.id === fromId);
  for (let i = from - 1; i >= 0; i--) {
    const found = ids.indexOf(all[i].id);
    if (found >= 0) return found;
  }
  return 0;
}

export function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(0, Math.trunc(index)), Math.max(0, length - 1));
}

/** Mensagem trocada entre a janela da turma e a do apresentador. */
export type SyncMessage =
  | { type: 'state'; slideId: string; step: number; syntax: Syntax; mode: Mode; ask: boolean }
  | { type: 'hello' }
  /** Uma janela seguiu para a próxima aula: as outras seguem junto. */
  | { type: 'lesson'; lesson: string };

/**
 * Estado de uma apresentação (fornecido por componente: player e apresentador têm cada um o seu,
 * sincronizados por `BroadcastChannel`).
 */
@Injectable()
export class PlayerState {
  private readonly destroyRef = inject(DestroyRef);

  readonly deck = signal<Deck | null>(null);
  readonly lesson = signal<Lesson | null>(null);
  readonly syntax = signal<Syntax>('js');
  readonly mode = signal<Mode>('completo');
  readonly pos = signal<Position>({ index: 0, step: 0 });
  /** Próxima aula da trilha (convite no fim da apresentação). */
  readonly upNext = signal<Lesson | undefined>(undefined);
  /** Convite "seguir para a próxima aula?" aberto. */
  readonly asking = signal(false);
  /** Chamado ao seguir para a próxima aula (o componente navega). */
  onFollow: (() => void) | null = null;

  readonly slides = computed(() => {
    const deck = this.deck();
    return deck ? visibleSlides(deck, this.mode(), this.syntax()) : [];
  });
  readonly total = computed(() => this.slides().length);
  readonly current = computed<Slide | undefined>(() => this.slides()[this.pos().index]);
  readonly upcoming = computed<Slide | undefined>(() => this.slides()[this.pos().index + 1]);
  readonly steps = computed(() => {
    const slide = this.current();
    return slide ? stepCount(slide) : 1;
  });
  readonly isFirst = computed(() => this.pos().index === 0 && this.pos().step === 0);
  readonly isLast = computed(
    () => this.pos().index === this.total() - 1 && this.pos().step === this.steps() - 1,
  );
  /** Avançar ainda faz algo: há etapa ou slide pela frente, ou uma próxima aula. */
  readonly canAdvance = computed(() => !this.isLast() || !!this.upNext());
  /** Progresso de 0 a 1, contando slides inteiros. */
  readonly progress = computed(() =>
    this.total() > 1 ? this.pos().index / (this.total() - 1) : 1,
  );

  private channel: BroadcastChannel | null = null;
  private lastRemote = '';
  /** Enquanto `true`, não publica (janela que acabou de abrir espera o estado da outra). */
  private muted = false;

  constructor() {
    // Publica cada mudança local; a mudança que acabou de chegar de outra janela não volta para ela
    effect(() => {
      const message = this.snapshot();
      if (!message || this.muted) return;
      if (JSON.stringify(message) === this.lastRemote) return;
      untracked(() => this.channel?.postMessage(message));
    });
  }

  init(deck: Deck, lesson: Lesson, syntax: Syntax, mode: Mode, index: number, upNext?: Lesson) {
    this.deck.set(deck);
    this.lesson.set(lesson);
    this.upNext.set(upNext);
    this.asking.set(false);
    this.syntax.set(syntax);
    this.mode.set(mode);
    this.pos.set({ index: clampIndex(index, visibleSlides(deck, mode, syntax).length), step: 0 });
  }

  /** Avança; no fim da aula abre o convite e, com o convite aberto, segue para a próxima aula. */
  next() {
    this.muted = false;
    if (this.asking()) {
      this.follow();
      return;
    }
    if (this.isLast()) {
      if (this.upNext()) this.asking.set(true);
      return;
    }
    this.pos.update((p) => nextPosition(this.slides(), p));
  }

  /** Volta; com o convite aberto, só fecha o convite (fica no último slide). */
  prev() {
    this.muted = false;
    if (this.asking()) {
      this.asking.set(false);
      return;
    }
    this.pos.update((p) => prevPosition(this.slides(), p));
  }

  dismiss() {
    this.muted = false;
    this.asking.set(false);
  }

  /** Segue para a próxima aula e pede às outras janelas que sigam junto. */
  follow() {
    const upNext = this.upNext();
    if (!upNext) return;
    this.asking.set(false);
    this.channel?.postMessage({ type: 'lesson', lesson: upNext.slug } satisfies SyncMessage);
    this.onFollow?.();
  }

  first() {
    this.muted = false;
    this.asking.set(false);
    this.pos.set({ index: 0, step: 0 });
  }

  last() {
    this.muted = false;
    this.asking.set(false);
    const slides = this.slides();
    const index = Math.max(0, slides.length - 1);
    this.pos.set({ index, step: slides[index] ? stepCount(slides[index]) - 1 : 0 });
  }

  goTo(index: number, step = 0) {
    this.muted = false;
    this.asking.set(false);
    const i = clampIndex(index, this.total());
    const slide = this.slides()[i];
    const s = slide ? Math.min(Math.max(0, step), stepCount(slide) - 1) : 0;
    this.pos.set({ index: i, step: s });
  }

  setSyntax(syntax: Syntax) {
    this.muted = false;
    if (syntax === this.syntax() || !this.lesson()?.syntaxes.includes(syntax)) return;
    this.reposition(() => this.syntax.set(syntax));
    prefs.saveSyntax(syntax);
  }

  setMode(mode: Mode) {
    this.muted = false;
    if (mode === this.mode()) return;
    this.reposition(() => this.mode.set(mode));
    prefs.saveMode(mode);
  }

  toggleMode() {
    this.setMode(this.mode() === 'completo' ? 'essencial' : 'completo');
  }

  /** Aplica a troca mantendo o slide atual (ou o anterior mais próximo) e a etapa, se couber. */
  private reposition(change: () => void) {
    const deck = this.deck();
    const currentId = this.current()?.id;
    const step = this.pos().step;
    change();
    if (!deck || !currentId) return;
    const index = remapIndex(deck.slides, currentId, this.slides());
    const same = this.slides()[index]?.id === currentId;
    this.goTo(index, same ? step : 0);
  }

  /**
   * Liga a sincronização com outras janelas da mesma aula. Com `follow`, a janela não publica
   * o próprio estado inicial: espera a outra responder ou o apresentador navegar.
   */
  connect(name: string, follow = false) {
    if (typeof BroadcastChannel === 'undefined') return;
    this.muted = follow;
    const channel = new BroadcastChannel(name);
    this.channel = channel;
    channel.onmessage = (event: MessageEvent<SyncMessage>) => this.receive(event.data);
    this.destroyRef.onDestroy(() => {
      channel.close();
      this.channel = null;
    });
    channel.postMessage({ type: 'hello' } satisfies SyncMessage);
  }

  private snapshot(): SyncMessage | null {
    const slide = this.current();
    if (!slide) return null;
    return {
      type: 'state',
      slideId: slide.id,
      step: this.pos().step,
      syntax: this.syntax(),
      mode: this.mode(),
      ask: this.asking(),
    };
  }

  private receive(message: SyncMessage) {
    if (message.type === 'hello') {
      const snap = untracked(() => this.snapshot());
      if (snap) this.channel?.postMessage(snap);
      return;
    }
    if (message.type === 'lesson') {
      if (message.lesson === this.upNext()?.slug) this.onFollow?.();
      return;
    }
    const deck = this.deck();
    if (!deck) return;
    this.lastRemote = JSON.stringify(message);
    this.syntax.set(message.syntax);
    this.mode.set(message.mode);
    const index = remapIndex(deck.slides, message.slideId, this.slides());
    this.goTo(index, message.step);
    this.asking.set(!!message.ask && !!this.upNext());
  }
}
