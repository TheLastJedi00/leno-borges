import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { type BranchSlide, type FlowState, type Syntax, pick } from '../kit.data';
import { Code } from '../ui/code/code';
import { codeWithValue } from '../ui/code/code-markup';
import { Flow, flowLayout } from '../ui/flow/flow';

/** Espaço da ilustração na coluna da direita do exercício. */
const FIG_W = 540;
const FIG_H = 250;

/**
 * Exercício "escolha o valor": a turma troca o valor da variável (botões, Tab e Enter) e vê o
 * caminho no fluxograma e a saída. Cada desafio pede uma saída. Nada é salvo: reiniciar volta ao
 * primeiro desafio e ao valor inicial.
 */
@Component({
  selector: 'kit-branch-view',
  imports: [Code, Flow],
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
      <p class="mt-1 text-[18px] text-faint">{{ ex.branchHint }}</p>

      <div class="mt-5 flex min-h-0 flex-1 gap-10">
        <div class="grid w-[560px] shrink-0 content-start gap-4">
          <kit-code [markup]="code()" [syntax]="syntax()" [fontSize]="21"></kit-code>
          <div
            class="flex gap-4 rounded-xl bg-ink px-6 py-3 font-mono text-[22px] whitespace-pre-wrap shadow-inset"
            [class]="output() ? 'text-paper' : 'text-faint'"
          >
            <span aria-hidden="true" class="text-faint">›</span>
            <span aria-live="polite">{{ output() || ex.nothingPrinted }}</span>
          </div>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-4">
          <p class="font-mono text-[18px] uppercase tracking-wider text-faint">
            {{ ex.challenge }} {{ index() + 1 }} / {{ s.goals.length }}
          </p>
          <p class="font-display text-[30px] leading-tight font-semibold text-paper">
            @if (goal()) {
              {{ ex.goalOutput }} <span class="font-mono text-kit-value">{{ goal() }}</span>
            } @else {
              {{ ex.goalNothing }}
            }
          </p>

          @if (flow(); as fl) {
            <div class="flex justify-center">
              <kit-flow [style.zoom]="flowZoom()" [state]="fl"></kit-flow>
            </div>
          }

          <div class="flex flex-wrap items-center gap-3" role="group" [attr.aria-label]="ex.valueOf + ' ' + s.variable">
            <span class="font-mono text-[22px] text-kit-name">{{ s.variable }} =</span>
            @for (c of s.choices; track $index; let i = $index) {
              <button
                type="button"
                (click)="choose(i)"
                [attr.aria-pressed]="choice() === i"
                class="rounded-xl px-4 py-2 font-mono text-[22px] font-semibold shadow-raised transition-[background-color,color] active:shadow-inset"
                [class]="choice() === i ? 'bg-accent-deep text-white' : 'bg-raised text-kit-value hover:text-paper'"
              >
                {{ c.value }}
              </button>
            }
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <p aria-live="polite" class="min-h-[34px] text-[24px] font-semibold text-kit-value">
              @if (solved()) {
                {{ isLast() ? ex.allDone : ex.solved }}
              }
            </p>
            <div class="ml-auto flex gap-3">
              @if (!isLast()) {
                <button
                  type="button"
                  (click)="nextChallenge()"
                  [disabled]="!solved()"
                  class="rounded-full bg-accent-deep px-5 py-2.5 text-[19px] font-semibold text-white shadow-raised transition-[filter,opacity] hover:brightness-110 active:shadow-inset disabled:opacity-40"
                >
                  {{ ex.nextChallenge }} <span aria-hidden="true">→</span>
                </button>
              }
              <button
                type="button"
                (click)="reset()"
                class="rounded-full bg-raised px-5 py-2.5 text-[19px] font-semibold text-muted shadow-raised hover:text-paper active:shadow-inset"
              >
                {{ ex.reset }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BranchView {
  slide = input.required<BranchSlide>();
  syntax = input.required<Syntax>();
  readonly t = inject(I18n).t;

  readonly index = signal(0);
  /** Valor escolhido pela turma (null = o valor inicial do slide). */
  private readonly picked = signal<number | null>(null);

  readonly choice = computed(() => this.picked() ?? this.slide().start ?? 0);
  readonly current = computed(() => this.slide().choices[this.choice()]);
  readonly code = computed(() =>
    codeWithValue(pick(this.slide().code, this.syntax()) ?? '', this.current().value),
  );
  readonly output = computed(() => pick(this.current().output, this.syntax()) ?? '');
  readonly flow = computed<FlowState | undefined>(() => {
    const base = pick(this.slide().flow, this.syntax());
    return base ? { ...base, answers: this.current().answers ?? [] } : undefined;
  });
  /** Escala fixa do slide: a do desenho com todas as condições respondidas. */
  readonly flowZoom = computed(() => {
    const base = pick(this.slide().flow, this.syntax());
    if (!base) return 1;
    const { width, height } = flowLayout({ ...base, answers: [] });
    return Math.min(1, FIG_W / width, FIG_H / height);
  });
  readonly goal = computed(() => this.slide().goals[this.index()]);
  readonly solved = computed(() => this.output() === this.goal());
  readonly isLast = computed(() => this.index() === this.slide().goals.length - 1);

  choose(i: number) {
    this.picked.set(i);
  }

  nextChallenge() {
    if (!this.solved() || this.isLast()) return;
    this.index.update((i) => i + 1);
  }

  reset() {
    this.index.set(0);
    this.picked.set(null);
  }
}
