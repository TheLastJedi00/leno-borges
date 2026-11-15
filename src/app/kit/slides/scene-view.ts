import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { type ChestState, type SceneSlide, type SceneStep, type Syntax, pick } from '../kit.data';
import { ChestRow } from '../ui/chest/chest-row';
import { chestWidth } from '../ui/chest/chest';
import { Scale } from '../ui/scale/scale';
import { Circuit } from '../ui/circuit/circuit';
import { Flow, flowLayout } from '../ui/flow/flow';
import { List, listLayout } from '../ui/list/list';
import { Loop, loopLayout } from '../ui/loop/loop';
import { Sorter, sorterLayout } from '../ui/switch/sorter';
import { I18n } from '../../i18n/i18n';
import { Code } from '../ui/code/code';
import { codeWithValue, fitFontSize, parseCode, sceneAt } from '../ui/code/code-markup';

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
 * Tamanho da fonte do código: menor quando o trecho é comprido, para o código e a saída caberem
 * na altura livre do palco (~476px com uma linha de legenda). Até 6 linhas sozinho e até 7 ao
 * lado de uma ilustração, fica como sempre foi (30 e 26).
 */
export function codeFontSize(lines: number, withFigure: boolean): number {
  if (withFigure) return lines <= 7 ? 26 : lines <= 8 ? 24 : 22;
  return lines <= 6 ? 30 : lines <= 7 ? 26 : lines <= 8 ? 24 : 22;
}

/** Área da ilustração no palco: altura livre abaixo do título e da legenda, largura sem código. */
const FIGURE_H = 410;
const FIGURE_W_ALONE = 1100;

/**
 * Escala do fluxograma (e da triagem do switch): o maior que couber na área (ao lado do código ou sozinho), sem passar
 * de 1,3. Calculada com o maior desenho do slide, para não mudar de tamanho entre etapas.
 */
export function flowZoom(sizes: { width: number; height: number }[], withCode: boolean): number {
  if (!sizes.length) return 1;
  const width = Math.max(...sizes.map((s) => s.width));
  const height = Math.max(...sizes.map((s) => s.height));
  return Math.min(1.3, (withCode ? ROW_SPACE : FIGURE_W_ALONE) / width, FIGURE_H / height);
}

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
  imports: [ChestRow, Code, Scale, Circuit, Flow, Sorter, List, Loop],
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
            @if (flow(); as fl) {
              <kit-flow class="kit-fade" [style.zoom]="flowZoom()" [state]="fl"></kit-flow>
            }
            @if (sorter(); as so) {
              <kit-switch class="kit-fade" [style.zoom]="sorterZoom()" [state]="so"></kit-switch>
            }
            @if (loop(); as lo) {
              <kit-loop class="kit-fade" [style.zoom]="loopZoom()" [state]="lo"></kit-loop>
            }
            @if (list(); as li) {
              <kit-list class="kit-fade" [style.zoom]="listZoom()" [state]="li"></kit-list>
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
              [skipped]="skipped()"
              [fontSize]="fontSize()"
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
  /** Circuito da aula 4. */
  readonly circuit = computed(() => this.state().circuit ?? undefined);
  readonly flow = computed(() => pick(this.state().flow ?? undefined, this.syntax()));
  readonly flowZoom = computed(() => {
    const steps = this.slide().steps;
    const sizes = steps
      .map((_, i) => pick(sceneAt(steps, i).flow ?? undefined, this.syntax()))
      .filter((f) => !!f)
      .map((f) => flowLayout(f));
    return flowZoom(sizes, !!this.code());
  });
  readonly sorter = computed(() => pick(this.state().sorter ?? undefined, this.syntax()));
  readonly sorterZoom = computed(() => {
    const steps = this.slide().steps;
    const sizes = steps
      .map((_, i) => pick(sceneAt(steps, i).sorter ?? undefined, this.syntax()))
      .filter((s) => !!s)
      .map((s) => sorterLayout({ ...s, dropped: true, value: s.value }));
    return flowZoom(sizes, !!this.code());
  });
  readonly list = computed(() => pick(this.state().list ?? undefined, this.syntax()));
  /** Mesma escala em todas as etapas: a do gaveteiro mais largo do slide. */
  readonly listZoom = computed(() => {
    const steps = this.slide().steps;
    const sizes = steps
      .map((_, i) => pick(sceneAt(steps, i).list ?? undefined, this.syntax()))
      .filter((l) => !!l)
      .map((l) => listLayout(l));
    return flowZoom(sizes, !!this.code());
  });
  readonly loop = computed(() => pick(this.state().loop ?? undefined, this.syntax()));
  /** Mesma escala em todas as etapas: a da pista maior do slide (o placar cabe com 2 dígitos). */
  readonly loopZoom = computed(() => {
    const steps = this.slide().steps;
    const sizes = steps
      .map((_, i) => pick(sceneAt(steps, i).loop ?? undefined, this.syntax()))
      .filter((l) => !!l)
      .map((l) => loopLayout(l, 'voltas: 10'));
    return flowZoom(sizes, !!this.code());
  });
  readonly hasFigure = computed(
    () =>
      !!this.loop() ||
      !!this.list() ||
      !!this.compare() ||
      !!this.circuit() ||
      !!this.flow() ||
      !!this.sorter() ||
      this.chests().length > 0,
  );
  private readonly t = inject(I18n).t;
  readonly lampText = computed(() => ({
    on: this.t().kit.exercise.lampOn,
    off: this.t().kit.exercise.lampOff,
  }));
  readonly activeLine = computed(() => pick(this.state().activeLine, this.syntax()));
  readonly skipped = computed(() => pick(this.state().skip ?? undefined, this.syntax()) ?? []);
  readonly outputTone = computed(() => pick(this.state().outputTone, this.syntax()));
  readonly highlight = computed(() => pick(this.state().highlight, this.syntax()));
  readonly code = computed(() => {
    const markup = pick(this.slide().code, this.syntax());
    return markup === undefined ? undefined : codeWithValue(markup, this.state().value);
  });
  /** Pela altura (número de linhas) e pela largura (linha mais comprida: 552px ou 812px de texto). */
  readonly fontSize = computed(() => {
    const markup = this.code() ?? '';
    const byLines = codeFontSize(parseCode(markup).length, this.hasFigure());
    return fitFontSize(markup, byLines, this.hasFigure() ? 552 : 812);
  });
  readonly caption = computed(() => pick(this.state().caption, this.syntax()));
  readonly output = computed(() => pick(this.state().output ?? undefined, this.syntax()));
}
