import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { type CircuitSlide, type CircuitState, type Syntax, lampOn } from '../kit.data';
import { Circuit } from '../ui/circuit/circuit';

/** O desafio está resolvido quando a lâmpada fica como o objetivo pede. */
export function challengeSolved(state: CircuitState, goal: boolean): boolean {
  return lampOn(state.mode, state.switches) === goal;
}

/**
 * Exercício "acenda a lâmpada": a turma liga e desliga os interruptores (clique, Tab e Enter)
 * até cumprir o objetivo de cada desafio. Nada é salvo: reiniciar volta ao primeiro desafio.
 */
@Component({
  selector: 'kit-circuit-view',
  imports: [Circuit],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    @let ex = t().kit.exercise;
    <div class="flex h-full flex-col px-16 pt-14 pb-10" data-kit-exercise>
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ s.title }}
      </h2>
      <p class="mt-3 text-[26px] leading-snug text-muted">{{ s.lead }}</p>
      <p class="mt-1 text-[18px] text-faint">{{ ex.circuitHint }}</p>

      <div class="mt-4 flex min-h-0 flex-1 items-center gap-12">
        @for (c of [index()]; track c) {
          <kit-circuit
            class="kit-fade shrink-0"
            [style.zoom]="1.05"
            [state]="state()"
            [interactive]="true"
            [lampText]="{ on: ex.lampOn, off: ex.lampOff }"
            (toggled)="toggle($event)"
          ></kit-circuit>
        }

        <div class="flex min-w-0 flex-1 flex-col gap-5">
          <p class="font-mono text-[18px] uppercase tracking-wider text-faint">
            {{ ex.challenge }} {{ index() + 1 }} / {{ s.challenges.length }}
          </p>
          <p class="font-display text-[34px] leading-tight font-semibold text-paper">
            {{ challenge().goal ? ex.goalOn : ex.goalOff }}
          </p>
          <p
            aria-live="polite"
            class="min-h-[34px] text-[26px] font-semibold"
            [class.text-kit-value]="solved()"
          >
            @if (solved()) {
              {{ isLast() ? ex.allDone : ex.solved }}
            }
          </p>
          <div class="mt-2 flex flex-wrap gap-3">
            @if (!isLast()) {
              <button
                type="button"
                (click)="nextChallenge()"
                [disabled]="!solved()"
                class="rounded-full bg-accent-deep px-6 py-3 text-[20px] font-semibold text-white shadow-raised transition-[filter,opacity] hover:brightness-110 active:shadow-inset disabled:opacity-40"
              >
                {{ ex.nextChallenge }} <span aria-hidden="true">→</span>
              </button>
            }
            <button
              type="button"
              (click)="reset()"
              class="rounded-full bg-raised px-6 py-3 text-[20px] font-semibold text-muted shadow-raised hover:text-paper active:shadow-inset"
            >
              {{ ex.reset }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CircuitView {
  slide = input.required<CircuitSlide>();
  syntax = input.required<Syntax>();
  readonly t = inject(I18n).t;

  readonly index = signal(0);
  /** Interruptores mexidos pela turma no desafio atual (null = ainda como começou). */
  private readonly switches = signal<boolean[] | null>(null);

  readonly challenge = computed(() => this.slide().challenges[this.index()]);
  readonly state = computed<CircuitState>(() => ({
    mode: this.challenge().mode,
    labels: this.challenge().labels,
    switches: this.switches() ?? this.challenge().start,
  }));
  readonly solved = computed(() => challengeSolved(this.state(), this.challenge().goal));
  readonly isLast = computed(() => this.index() === this.slide().challenges.length - 1);

  toggle(i: number) {
    const next = [...this.state().switches];
    next[i] = !next[i];
    this.switches.set(next);
  }

  nextChallenge() {
    if (!this.solved() || this.isLast()) return;
    this.index.update((i) => i + 1);
    this.switches.set(null);
  }

  reset() {
    this.index.set(0);
    this.switches.set(null);
  }
}
