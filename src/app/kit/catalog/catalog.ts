import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { Header } from '../../shared/header/header';
import { TechIcon } from '../../shared/tech-icon/tech-icon';
import { Segmented } from '../ui/segmented/segmented';
import { isMode, isSyntax, prefs, resolveMode, resolveSyntax } from '../kit-prefs';
import {
  type Lesson,
  MODES,
  type Mode,
  type Syntax,
  type TrackId,
  lessonPath,
  syntaxNames,
  tracks,
} from '../kit.data';

/** Página /kit: trilhas e aulas, com a escolha de sintaxe e roteiro antes de apresentar. */
@Component({
  selector: 'app-kit-catalog',
  imports: [RouterLink, Header, TechIcon, Segmented],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.html',
})
export class Catalog {
  private readonly i18n = inject(I18n);
  readonly t = this.i18n.t;
  readonly lang = this.i18n.lang;
  readonly tracks = tracks;
  readonly syntaxNames = syntaxNames;

  /** Escolhas por aula (`trilha/aula`), iniciadas pela preferência salva. */
  private readonly syntaxChoice = signal<Record<string, Syntax>>({});
  readonly mode = signal<Mode>(resolveMode(null, prefs.mode()));

  readonly modeOptions = computed(() =>
    MODES.map((m) => ({ value: m, label: this.t().kit.modes[m], title: this.t().kit.modeHints[m] })),
  );

  constructor() {
    this.i18n.usePageMeta((d) => ({ title: d.kit.meta.title, description: d.kit.meta.description }));
  }

  private key(track: TrackId, lesson: Lesson) {
    return `${track}/${lesson.slug}`;
  }

  syntaxOf(track: TrackId, lesson: Lesson): Syntax {
    return (
      this.syntaxChoice()[this.key(track, lesson)] ??
      resolveSyntax(null, prefs.syntax(), lesson.syntaxes)
    );
  }

  syntaxOptions(lesson: Lesson) {
    return lesson.syntaxes.map((s) => ({ value: s, label: syntaxNames[s].short }));
  }

  setSyntax(track: TrackId, lesson: Lesson, value: string) {
    if (!isSyntax(value)) return;
    this.syntaxChoice.update((c) => ({ ...c, [this.key(track, lesson)]: value }));
    prefs.saveSyntax(value);
  }

  setMode(value: string) {
    if (!isMode(value)) return;
    this.mode.set(value);
    prefs.saveMode(value);
  }

  presentLink(track: TrackId, lesson: Lesson) {
    return `${lessonPath(track, lesson.slug)}/1`;
  }
}
