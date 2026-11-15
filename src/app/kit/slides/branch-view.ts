import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import {
  type BranchSlide,
  type FlowState,
  type ListState,
  type LoopState,
  type SorterState,
  type Syntax,
  pick,
} from '../kit.data';
import { Code } from '../ui/code/code';
import { codeWithValue, fitFontSize } from '../ui/code/code-markup';
import { Flow, flowLayout } from '../ui/flow/flow';
import { List, listLayout } from '../ui/list/list';
import { Loop, loopLayout } from '../ui/loop/loop';
import { Sorter, sorterLayout } from '../ui/switch/sorter';

/** Espaço da ilustração na coluna da direita do exercício. */
const FIG_W = 552;
const FIG_H = 360;

/** Gaveteiro com o índice `value` lido: em destaque se existe, fantasma se não. */
function listAt(base: Omit<ListState, 'focus' | 'outside'>, value: string): ListState {
  const index = Number(value);
  return index < base.items.length ? { ...base, focus: index } : { ...base, outside: index };
}

/**
 * Exercício "escolha o valor": a turma troca o valor da variável (botões, Tab e Enter) e vê o
 * caminho no fluxograma e a saída. Cada desafio pede uma saída. Nada é salvo: reiniciar volta ao
 * primeiro desafio e ao valor inicial.
 */
@Component({
  selector: 'kit-branch-view',
  imports: [Code, Flow, Sorter, List, Loop],
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

      <div class="mt-5 flex min-h-0 flex-1 gap-10">
        <div class="grid w-[560px] shrink-0 content-start gap-3">
          <kit-code [markup]="code()" [syntax]="syntax()" [fontSize]="fontSize()"></kit-code>
          <div
            class="flex gap-4 rounded-xl bg-ink px-6 py-2.5 font-mono text-[22px] whitespace-pre-wrap shadow-inset"
            [class]="output() ? 'text-paper' : 'text-faint'"
          >
            <span aria-hidden="true" class="text-faint">›</span>
            <span aria-live="polite">{{ output() || ex.nothingPrinted }}</span>
          </div>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <p class="flex flex-wrap items-baseline gap-x-4 font-display text-[28px] leading-tight font-semibold text-paper">
            <span class="font-mono text-[16px] font-normal uppercase tracking-wider text-faint">
              {{ ex.challenge }} {{ index() + 1 }} / {{ s.goals.length }}
            </span>
            @if (goal()) {
              <span>{{ ex.goalOutput }} <span class="font-mono text-kit-value">{{ goalText() }}</span></span>
            } @else {
              <span>{{ ex.goalNothing }}</span>
            }
          </p>

          @if (flow(); as fl) {
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <kit-flow [style.zoom]="flowZoom()" [state]="fl"></kit-flow>
            </div>
          }
          @if (sorter(); as so) {
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <kit-switch [style.zoom]="sorterZoom()" [state]="so"></kit-switch>
            </div>
          }
          @if (loop(); as lo) {
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <kit-loop [style.zoom]="loopZoom()" [state]="lo"></kit-loop>
            </div>
          }
          @if (list(); as li) {
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <kit-list [style.zoom]="listZoom()" [state]="li"></kit-list>
            </div>
          }
        </div>
      </div>

      <div class="mt-4 flex items-center gap-6">
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

        <p aria-live="polite" class="ml-auto text-[24px] font-semibold text-kit-value">
          @if (solved()) {
            {{ isLast() ? ex.allDone : ex.solved }}
          }
        </p>
        <div class="flex gap-3">
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
  /** 18, ou menos quando a linha mais comprida não cabe nos 512px de texto. */
  readonly fontSize = computed(() => fitFontSize(this.code(), 18, 512));
  /** Saída pedida, numa linha: `Seg, Ter`. */
  readonly goalText = computed(() => this.goal().replaceAll('\n', ', '));
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
  readonly sorter = computed<SorterState | undefined>(() => {
    const base = pick(this.slide().sorter, this.syntax());
    return base ? { ...base, value: this.current().value, dropped: true } : undefined;
  });
  /** Escala fixa do slide: a do valor mais largo, com o item no escaninho mais baixo. */
  readonly sorterZoom = computed(() => {
    const base = pick(this.slide().sorter, this.syntax());
    if (!base) return 1;
    const sizes = this.slide().choices.map((c) => sorterLayout({ ...base, value: c.value, dropped: true }));
    const width = Math.max(...sizes.map((s) => s.width));
    const height = Math.max(...sizes.map((s) => s.height));
    return Math.min(1, FIG_W / width, FIG_H / height);
  });
  /** Gaveteiro: o valor escolhido é o índice lido (gaveta em destaque, ou fantasma se não existir). */
  readonly list = computed<ListState | undefined>(() => {
    const base = pick(this.slide().list, this.syntax());
    return base ? listAt(base, this.current().value) : undefined;
  });
  /** Escala fixa do slide: a do índice mais distante entre os valores. */
  readonly listZoom = computed(() => {
    const base = pick(this.slide().list, this.syntax());
    if (!base) return 1;
    const sizes = this.slide().choices.map((c) => listLayout(listAt(base, c.value)));
    const width = Math.max(...sizes.map((s) => s.width));
    const height = Math.max(...sizes.map((s) => s.height));
    return Math.min(1, FIG_W / width, FIG_H / height);
  });
  /** Pista: o laço já terminou, com as voltas do valor escolhido. */
  readonly loop = computed<LoopState | undefined>(() => {
    const base = pick(this.slide().loop, this.syntax());
    return base ? { ...base, laps: this.current().laps ?? 0, answer: false } : undefined;
  });
  /** Escala fixa do slide (o placar com 2 dígitos). */
  readonly loopZoom = computed(() => {
    const base = pick(this.slide().loop, this.syntax());
    if (!base) return 1;
    const { width, height } = loopLayout({ ...base, laps: 0, answer: null }, 'voltas: 10');
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
