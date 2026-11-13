import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { type PredictSlide, type Syntax, pick } from '../kit.data';
import { ChestRow } from '../ui/chest/chest-row';
import { Code } from '../ui/code/code';
import { sceneAt } from '../ui/code/code-markup';
import { chestsFor } from './scene-view';

/**
 * Exercício "qual o valor final?": a turma escolhe uma resposta (etapa 0) e, nas etapas
 * seguintes, a execução é revelada linha a linha com os baús.
 */
@Component({
  selector: 'kit-predict-view',
  imports: [Code, ChestRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    @let ex = t().kit.exercise;
    <div class="flex h-full flex-col px-16 pt-14 pb-10">
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ s.title }}
      </h2>
      <p class="mt-3 text-[28px] leading-snug text-muted">{{ s.question }}</p>

      <div class="mt-6 flex min-h-0 flex-1 gap-10">
        <kit-code
          class="w-[560px] shrink-0 self-start"
          [markup]="code()"
          [syntax]="syntax()"
          [activeLine]="trace()?.activeLine"
          [fontSize]="26"
        ></kit-code>

        <div class="flex min-w-0 flex-1 flex-col gap-5">
          <div
            role="group"
            [attr.aria-label]="ex.choose"
            class="grid grid-cols-2 gap-3"
            data-kit-exercise
          >
            @for (o of s.options; track $index; let i = $index) {
              <button
                type="button"
                (click)="choose(i)"
                [attr.aria-pressed]="chosen() === i"
                class="rounded-xl border-2 px-5 py-3 text-left font-mono text-[26px] shadow-raised transition-[border-color,background-color,color]"
                [class]="optionClass(i)"
              >
                {{ o }}
              </button>
            }
          </div>

          <p
            aria-live="polite"
            class="min-h-[34px] text-[22px] font-medium"
            [class]="chosen() === s.answer || revealed() ? 'text-kit-value' : 'text-kit-error'"
          >
            @if (revealed()) {
              {{ ex.answer }}: {{ s.options[s.answer] }}
            } @else if (chosen() !== null) {
              {{ chosen() === s.answer ? ex.correct : ex.wrong }}
            }
          </p>

          @if (trace(); as tr) {
            <kit-chest-row
              class="kit-fade origin-top scale-[0.8]"
              [chests]="chestsFor(tr, syntax())"
              [syntax]="syntax()"
            ></kit-chest-row>
          }
          @if (finished()) {
            <p class="kit-rise mt-auto text-[22px] leading-snug text-paper">{{ s.explanation }}</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class PredictView {
  slide = input.required<PredictSlide>();
  step = input(0);
  syntax = input.required<Syntax>();
  readonly t = inject(I18n).t;
  readonly chestsFor = chestsFor;

  readonly chosen = signal<number | null>(null);
  readonly code = computed(() => pick(this.slide().code, this.syntax()) ?? '');
  /** Etapa 0 é a pergunta; a partir da 1, a execução aparece passo a passo. */
  readonly revealed = computed(() => this.step() > 0);
  readonly trace = computed(() =>
    this.step() > 0 ? sceneAt(this.slide().trace, this.step() - 1) : null,
  );
  readonly finished = computed(() => this.step() >= this.slide().trace.length);

  choose(i: number) {
    this.chosen.set(i);
  }

  optionClass(i: number) {
    const answer = this.slide().answer;
    const chosen = this.chosen();
    if ((this.revealed() || chosen === answer) && i === answer) {
      return 'border-kit-value bg-kit-value/15 text-kit-value';
    }
    if (chosen === i) return 'border-kit-error bg-kit-error/10 text-kit-error';
    return 'border-line bg-raised text-paper hover:border-accent';
  }
}
