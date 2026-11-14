import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ChestShape, type ChestState, type Syntax, pick } from '../../kit.data';

/** Largura do baú (px no palco 1280×720) e marca de canto por formato (tipo). */
const SHAPES: Record<ChestShape, { width: number; glyph: string }> = {
  text: { width: 330, glyph: 'Aa' },
  int: { width: 260, glyph: '123' },
  decimal: { width: 260, glyph: '1.5' },
  bool: { width: 230, glyph: 'V/F' },
  any: { width: 280, glyph: '*' },
};

/** Largura do baú no palco, usada para encaixar fileiras de baús ao lado do código. */
export function chestWidth(shape: ChestShape | undefined): number {
  return SHAPES[shape ?? 'any'].width;
}

/**
 * Baú da metáfora: o baú é a variável, a etiqueta é o nome, o item é o valor e o formato é o tipo.
 * Cada parte entra com a própria animação (o item cai, a etiqueta é colada, a tampa abre).
 */
@Component({
  selector: 'kit-chest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chest.css',
  host: { class: 'inline-block' },
  template: `
    @let c = state();
    <div
      class="chest"
      [class.is-open]="c.open"
      [class.is-error]="c.error"
      [class.is-dim]="c.dim"
      [class.focus-chest]="c.focus === 'chest'"
      [class.focus-type]="c.focus === 'type'"
      [style.width.px]="width()"
    >
      @if (c.address) {
        <span class="address" [class.is-focus]="c.focus === 'address'">{{ c.address }}</span>
      }

      <div class="box" [style.height.px]="width() * 0.6">
        <div class="mouth"></div>

        @if (c.item; as item) {
          @for (v of [item]; track v) {
            <span
              class="item"
              [class.is-focus]="c.focus === 'item'"
              animate.enter="kit-item-drop"
              animate.leave="kit-item-lift"
              >{{ v }}</span
            >
          }
        }

        <div class="body">
          <span class="glyph">{{ glyph() }}</span>
          @if (typeName(); as type) {
            <span class="type">{{ type }}</span>
          }
          @if (c.locked) {
            <svg class="lock" viewBox="0 0 24 24" aria-hidden="true" animate.enter="kit-pop">
              <rect x="5" y="10" width="14" height="11" rx="2.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke-width="2.4" />
            </svg>
          }
        </div>

        <div class="lid"></div>

        @if (c.label; as label) {
          @for (v of [label]; track v) {
            <span
              class="label"
              [class.is-focus]="c.focus === 'label'"
              animate.enter="kit-label-stick"
              animate.leave="kit-fade-out"
              >{{ v }}</span
            >
          }
        }
      </div>
    </div>
  `,
})
export class Chest {
  state = input.required<ChestState>();
  syntax = input.required<Syntax>();

  readonly width = computed(() => SHAPES[this.state().shape ?? 'any'].width);
  readonly glyph = computed(() => SHAPES[this.state().shape ?? 'any'].glyph);
  readonly typeName = computed(() => pick(this.state().typeName, this.syntax()));
}
