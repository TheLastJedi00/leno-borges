import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { Segmented } from '../ui/segmented/segmented';
import { Stage } from '../ui/stage/stage';
import { SlideView } from '../slides/slide-view';
import { isMode, isSyntax, prefs, resolveMode, resolveSyntax } from '../kit-prefs';
import { MODES, findLesson, lessonPath, syntaxNames, type TrackId, type LessonId } from '../kit.data';
import { PlayerState } from './player-state';

const IDLE_MS = 3000;

/** Player de slides da aula: palco 16:9, barra de controles e sincronia com a URL. */
@Component({
  selector: 'app-kit-player',
  imports: [RouterLink, Segmented, Stage, SlideView],
  providers: [PlayerState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player.html',
  host: {
    '(document:keydown)': 'onKey($event)',
    '(document:fullscreenchange)': 'fullscreen.set(!!document.fullscreenElement)',
  },
})
export class Player {
  private readonly i18n = inject(I18n);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly document = inject(DOCUMENT);
  readonly state = inject(PlayerState);
  readonly t = this.i18n.t;
  readonly lang = this.i18n.lang;

  readonly trackSlug = this.route.snapshot.paramMap.get('trilha') as TrackId;
  readonly lessonSlug = this.route.snapshot.paramMap.get('aula') as LessonId;
  private readonly found = findLesson(this.trackSlug, this.lessonSlug);

  readonly lessonTitle = computed(
    () => this.t().kit.tracks[this.trackSlug]?.lessons[this.lessonSlug]?.title ?? '',
  );

  readonly syntaxOptions = computed(() =>
    (this.found?.lesson.syntaxes ?? []).map((s, i) => ({
      value: s,
      label: syntaxNames[s].short,
      title: `${syntaxNames[s].long} (${i + 1})`,
    })),
  );
  readonly modeOptions = computed(() =>
    MODES.map((m) => ({ value: m, label: this.t().kit.modes[m], title: this.t().kit.modeHints[m] })),
  );

  /** Barra de controles visível (some após alguns segundos sem mouse). */
  readonly awake = signal(true);
  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  readonly fullscreen = signal(false);
  private swipeStart: { x: number; y: number } | null = null;

  constructor() {
    this.i18n.usePageMeta((d) => ({
      title: this.lessonTitle() + d.kit.meta.lessonSuffix,
      description:
        d.kit.tracks[this.trackSlug]?.lessons[this.lessonSlug]?.summary ?? d.kit.meta.description,
    }));

    this.load();
    this.wake();
    this.destroyRef.onDestroy(() => clearTimeout(this.idleTimer));

    // Estado → URL (slide base 1, sintaxe e roteiro), sem empilhar histórico
    effect(() => {
      const slide = this.state.pos().index + 1;
      const sintaxe = this.state.syntax();
      const roteiro = this.state.mode();
      if (!this.state.deck()) return;
      untracked(() => this.syncUrl(slide, sintaxe, roteiro));
    });
  }

  private async load() {
    if (!this.found) return;
    const { lesson } = this.found;
    const query = this.route.snapshot.queryParamMap;
    const syntax = resolveSyntax(query.get('sintaxe'), prefs.syntax(), lesson.syntaxes);
    const mode = resolveMode(query.get('roteiro'), prefs.mode());
    const index = Number(this.route.snapshot.paramMap.get('slide')) - 1;
    const deck = await lesson.load();
    this.state.init(deck, lesson, syntax, mode, index);
    this.state.connect(`kit:${this.trackSlug}/${this.lessonSlug}`);
  }

  private syncUrl(slide: number, sintaxe: string, roteiro: string) {
    const snap = this.route.snapshot;
    if (
      snap.paramMap.get('slide') === String(slide) &&
      snap.queryParamMap.get('sintaxe') === sintaxe &&
      snap.queryParamMap.get('roteiro') === roteiro
    ) {
      return;
    }
    this.router.navigate([lessonPath(this.trackSlug, this.lessonSlug), slide], {
      queryParams: { sintaxe, roteiro },
      replaceUrl: true,
    });
  }

  setSyntax(value: string) {
    if (isSyntax(value)) this.state.setSyntax(value);
  }

  setMode(value: string) {
    if (isMode(value)) this.state.setMode(value);
  }

  wake() {
    this.awake.set(true);
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.awake.set(false), IDLE_MS);
  }

  /** Atalhos do apresentador. Teclas dentro de um exercício ficam com o exercício. */
  onKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-kit-exercise]')) return;
    const onControl = !!target?.closest('button, a, input, select, textarea');
    const syntaxes = this.found?.lesson.syntaxes ?? [];

    switch (event.key) {
      case 'ArrowRight':
      case 'PageDown':
        this.state.next();
        break;
      case ' ':
        if (onControl) return;
        this.state.next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        this.state.prev();
        break;
      case 'Home':
        this.state.first();
        break;
      case 'End':
        this.state.last();
        break;
      case 'f':
      case 'F':
        this.toggleFullscreen();
        break;
      case 'n':
      case 'N':
        this.openPresenter();
        break;
      case 'r':
      case 'R':
        this.state.toggleMode();
        break;
      case '1':
      case '2':
      case '3': {
        const syntax = syntaxes[Number(event.key) - 1];
        if (!syntax) return;
        this.state.setSyntax(syntax);
        break;
      }
      default:
        return;
    }
    event.preventDefault();
  }

  /** Clique no palco avança (exceto em controles e exercícios). */
  onStageClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, [data-kit-exercise]')) return;
    this.state.next();
  }

  onPointerDown(event: PointerEvent) {
    this.swipeStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  }

  onPointerUp(event: PointerEvent) {
    const start = this.swipeStart;
    this.swipeStart = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) this.state.next();
    else this.state.prev();
  }

  toggleFullscreen() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen?.();
    } else {
      this.document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
  }

  /** Abre a janela do apresentador (notas, próximo slide, cronômetro), sincronizada por canal. */
  openPresenter() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([lessonPath(this.trackSlug, this.lessonSlug), 'apresentador'], {
        queryParams: { sintaxe: this.state.syntax(), roteiro: this.state.mode() },
      }),
    );
    this.document.defaultView?.open(url, 'kit-apresentador', 'popup,width=1180,height=760');
  }
}
