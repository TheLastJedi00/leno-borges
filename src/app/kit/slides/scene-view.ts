import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ChestState, type SceneSlide, type SceneStep, type Syntax, pick } from '../kit.data';
import { ChestRow } from '../ui/chest/chest-row';
import { Code } from '../ui/code/code';
import { sceneAt } from '../ui/code/code-markup';

/** Destacar um papel no código acende a parte correspondente do baú. */
const FOCUS_BY_ROLE: Partial<Record<string, ChestState['focus']>> = {
  n: 'label',
  v: 'item',
  t: 'type',
};

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
  imports: [ChestRow, Code],
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
        [class.justify-center]="!code() || !chests().length"
      >
        @if (chests().length) {
          <kit-chest-row class="flex-1" [chests]="chests()" [syntax]="syntax()"></kit-chest-row>
        }
        @if (code(); as markup) {
          <div class="grid shrink-0 gap-4" [style.width.px]="chests().length ? 600 : 860">
            <kit-code
              [markup]="markup"
              [syntax]="syntax()"
              [visible]="st.lines"
              [highlight]="highlight()"
              [activeLine]="st.activeLine"
              [fontSize]="chests().length ? 26 : 30"
            ></kit-code>
            @if (output(); as out) {
              @for (o of [out]; track o) {
                <div
                  class="kit-rise flex gap-4 rounded-xl bg-ink px-6 py-4 font-mono text-[24px] whitespace-pre-wrap shadow-inset"
                  [class]="st.outputTone === 'error' ? 'text-kit-error' : 'text-paper'"
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
  readonly highlight = computed(() => pick(this.state().highlight, this.syntax()));
  readonly code = computed(() => pick(this.slide().code, this.syntax()));
  readonly caption = computed(() => pick(this.state().caption, this.syntax()));
  readonly output = computed(() => pick(this.state().output ?? undefined, this.syntax()));
}
