import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { type ChestState, type SceneSlide, type SceneStep, type Syntax, pick } from '../kit.data';
import { ChestRow } from '../ui/chest/chest-row';
import { chestWidth } from '../ui/chest/chest';
import { Scale } from '../ui/scale/scale';
import { Circuit } from '../ui/circuit/circuit';
import { I18n } from '../../i18n/i18n';
import { Code } from '../ui/code/code';
import { sceneAt } from '../ui/code/code-markup';

/** Destacar um papel no código acende a parte correspondente do baú. */
const FOCUS_BY_ROLE: Partial<Record<string, ChestState['focus']>> = {
  n: 'label',
  v: 'item',
  t: 'type',
};

/** Espaço do palco 1280×720 ao lado do código (padding 2×64, código 600, vão 48) e vão entre baús. */
const ROW_SPACE = 1280 - 128 - 600 - 48;
const CHEST_GAP = 48;
/** Abaixo disso, os baús ficam pequenos demais numa linha só: melhor quebrar em duas. */
const MIN_ONE_ROW_ZOOM = 0.65;

/**
 * Escala dos baús ao lado do código: cabem numa linha ou, se ficarem pequenos demais, em duas.
 * Uma folga de 3% evita quebra de linha por arredondamento.
 */
export function chestZoom(widths: number[]): number {
  if (widths.length < 2) return 1;
  const row = (list: number[]) => list.reduce((a, b) => a + b, 0) + CHEST_GAP * (list.length - 1);
  const oneRow = ROW_SPACE / row(widths);
  if (oneRow >= MIN_ONE_ROW_ZOOM) return Math.min(1, oneRow * 0.97);
  const half = Math.ceil(widths.length / 2);
  return Math.min(1, (ROW_SPACE / Math.max(row(widths.slice(0, half)), row(widths.slice(half)))) * 0.97);
}

export function chestsFor(state: SceneStep, syntax: Syntax): ChestState[] {
  const highlight = pick(state.highlight, syntax);
  const derived = highlight ? FOCUS_BY_ROLE[highlight] : undefined;
  return (pick(state.chests, syntax) ?? []).map((c) =>
    c.focus || !derived ? c : { ...c, focus: derived },
  );
}

/** Slide de cena: baús animados por etapa, com código e saída opcionais ao lado. */
@Component({
  selector: 'kit-scene-view',
  imports: [ChestRow, Code, Scale, Circuit],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let st = state();
    <div class="flex h-full flex-col px-16 pt-14 pb-12">
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ slide().title }}
      </h2>
      @if (caption(); as text) {
        @for (c of [text]; track c) {
          <p class="kit-fade mt-3 max-w-[1040px] text-[28px] leading-snug text-muted">{{ c }}</p>
        }
      }

      <div
        class="mt-6 flex min-h-0 flex-1 items-center gap-12"
        [class.justify-center]="!code() || !hasFigure()"
      >
        @if (hasFigure()) {
          <div class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6">
            @if (compare(); as cmp) {
              <kit-scale class="kit-fade" [style.zoom]="code() ? 1 : 1.4" [compare]="cmp"></kit-scale>
            }
            @if (circuit(); as circ) {
              <kit-circuit
                class="kit-fade"
                [style.zoom]="code() ? 0.84 : 1.3"
                [state]="circ"
                [lampText]="lampText()"
              ></kit-circuit>
            }
            @if (chests().length) {
              <kit-chest-row
                class="self-stretch"
                [style.zoom]="compare() ? 0.6 : zoom()"
                [chests]="chests()"
                [syntax]="syntax()"
              ></kit-chest-row>
            }
          </div>
        }
        @if (code(); as markup) {
          <div class="grid shrink-0 gap-4" [style.width.px]="hasFigure() ? 600 : 860">
            <kit-code
              [markup]="markup"
              [syntax]="syntax()"
              [visible]="st.lines"
              [highlight]="highlight()"
              [activeLine]="activeLine()"
              [fontSize]="hasFigure() ? 26 : 30"
            ></kit-code>
            @if (output(); as out) {
              @for (o of [out]; track o) {
                <div
                  class="kit-rise flex gap-4 rounded-xl bg-ink px-6 py-4 font-mono text-[24px] whitespace-pre-wrap shadow-inset"
                  [class]="outputTone() === 'error' ? 'text-kit-error' : 'text-paper'"
                >
                  <span aria-hidden="true" class="text-faint">›</span><span>{{ o }}</span>
                </div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class SceneView {
  slide = input.required<SceneSlide>();
  step = input(0);
  syntax = input.required<Syntax>();

  readonly state = computed(() => sceneAt(this.slide().steps, this.step()));
  readonly chests = computed(() => chestsFor(this.state(), this.syntax()));
  /** Mesma escala em todas as etapas do slide (a da etapa com mais baús), sem pular de tamanho. */
  readonly zoom = computed(() => {
    if (!this.code()) return 1;
    const steps = this.slide().steps;
    return Math.min(
      ...steps.map((_, i) =>
        chestZoom(chestsFor(sceneAt(steps, i), this.syntax()).map((c) => chestWidth(c.shape))),
      ),
    );
  });
  readonly compare = computed(() => pick(this.state().compare ?? undefined, this.syntax()));
  /** Há ilustração (balança ou baús) à esquerda do código. */
  readonly circuit = computed(() => this.state().circuit ?? undefined);
  readonly hasFigure = computed(
    () => !!this.compare() || !!this.circuit() || this.chests().length > 0,
  );
  private readonly t = inject(I18n).t;
  readonly lampText = computed(() => ({
    on: this.t().kit.exercise.lampOn,
    off: this.t().kit.exercise.lampOff,
  }));
  readonly activeLine = computed(() => pick(this.state().activeLine, this.syntax()));
  readonly outputTone = computed(() => pick(this.state().outputTone, this.syntax()));
  readonly highlight = computed(() => pick(this.state().highlight, this.syntax()));
  readonly code = computed(() => pick(this.slide().code, this.syntax()));
  readonly caption = computed(() => pick(this.state().caption, this.syntax()));
  readonly output = computed(() => pick(this.state().output ?? undefined, this.syntax()));
}
