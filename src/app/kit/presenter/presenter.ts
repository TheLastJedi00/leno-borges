import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { Stage } from '../ui/stage/stage';
import { Segmented } from '../ui/segmented/segmented';
import { SlideView } from '../slides/slide-view';
import { isMode, isSyntax, prefs, resolveMode, resolveSyntax } from '../kit-prefs';
import { MODES, findLesson, stepCount, syntaxNames, type LessonId, type TrackId } from '../kit.data';
import { PlayerState } from '../player/player-state';
import { handleDeckKey } from '../player/deck-keys';

/**
 * Janela do apresentador: slide atual, próximo, tópicos da fala e cronômetro.
 * Fica sincronizada com a janela da turma pelo `BroadcastChannel` da aula.
 */
@Component({
  selector: 'app-kit-presenter',
  imports: [Stage, Segmented, SlideView],
  providers: [PlayerState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presenter.html',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Presenter {
  private readonly i18n = inject(I18n);
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(PlayerState);
  readonly t = this.i18n.t;

  readonly trackSlug = this.route.snapshot.paramMap.get('trilha') as TrackId;
  readonly lessonSlug = this.route.snapshot.paramMap.get('aula') as LessonId;
  private readonly found = findLesson(this.trackSlug, this.lessonSlug);

  readonly lessonTitle = computed(
    () => this.t().kit.tracks[this.trackSlug]?.lessons[this.lessonSlug]?.title ?? '',
  );
  readonly syntaxOptions = computed(() =>
    (this.found?.lesson.syntaxes ?? []).map((s) => ({ value: s, label: syntaxNames[s].short })),
  );
  readonly modeOptions = computed(() =>
    MODES.map((m) => ({ value: m, label: this.t().kit.modes[m] })),
  );
  readonly nextSteps = computed(() => {
    const next = this.state.upcoming();
    return next ? stepCount(next) - 1 : 0;
  });

  // Cronômetro
  readonly elapsed = signal(0);
  readonly running = signal(false);
  private timer: ReturnType<typeof setInterval> | undefined;
  readonly clock = computed(() => {
    const total = this.elapsed();
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  });

  constructor() {
    this.i18n.usePageMeta((d) => ({
      title: `${d.kit.presenter.title} · ${this.lessonTitle()}`,
      description: d.kit.meta.description,
    }));
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
    this.load();
  }

  private async load() {
    if (!this.found) return;
    const { lesson } = this.found;
    const query = this.route.snapshot.queryParamMap;
    const syntax = resolveSyntax(query.get('sintaxe'), prefs.syntax(), lesson.syntaxes);
    const mode = resolveMode(query.get('roteiro'), prefs.mode());
    const deck = await lesson.load();
    this.state.init(deck, lesson, syntax, mode, 0);
    // Ao conectar, pede o estado à janela da turma (se ela estiver aberta)
    this.state.connect(`kit:${this.trackSlug}/${this.lessonSlug}`, true);
  }

  onKey(event: KeyboardEvent) {
    handleDeckKey(event, this.state);
  }

  setSyntax(value: string) {
    if (isSyntax(value)) this.state.setSyntax(value);
  }

  setMode(value: string) {
    if (isMode(value)) this.state.setMode(value);
  }

  toggleTimer() {
    if (this.running()) {
      clearInterval(this.timer);
      this.running.set(false);
    } else {
      this.timer = setInterval(() => this.elapsed.update((v) => v + 1), 1000);
      this.running.set(true);
    }
  }

  resetTimer() {
    this.elapsed.set(0);
  }
}
