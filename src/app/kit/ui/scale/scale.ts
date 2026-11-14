import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Compare } from '../../kit.data';

/** Inclinação do travessão, em graus, quando um lado pesa mais. */
const TILT_DEG = 11;

/** Número escrito sem aspas ("20", "-3.5"); texto e nomes não pesam na balança. */
function asNumber(value: string): number | null {
  const text = value.trim();
  if (!text || /^["']/.test(text)) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

/**
 * Para que lado a balança pende: -1 esquerda mais pesada, 1 direita, 0 nivelada.
 * Só inclina com números nos dois pratos; com texto, fica nivelada.
 */
export function scaleTilt(left: string, right: string): -1 | 0 | 1 {
  const a = asNumber(left);
  const b = asNumber(right);
  if (a === null || b === null || a === b) return 0;
  return a > b ? -1 : 1;
}

/**
 * Balança da aula de operadores relacionais: os itens vão para os pratos, o operador fica no
 * centro e a resposta (true/false) aparece embaixo, como um item pronto para guardar num baú.
 */
@Component({
  selector: 'kit-scale',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './scale.css',
  host: { class: 'inline-block' },
  template: `
    @let c = compare();
    <div class="scale" [style.--tilt]="tilt() * tiltDeg + 'deg'">
      <div class="beam">
        <div class="pan pan-left">
          @if (c.leftLabel) {
            <span class="label">{{ c.leftLabel }}</span>
          }
          @for (v of [c.left]; track v) {
            <span class="item" animate.enter="kit-item-drop">{{ v }}</span>
          }
          <span class="plate"></span>
        </div>
        <div class="pan pan-right">
          @if (c.rightLabel) {
            <span class="label">{{ c.rightLabel }}</span>
          }
          @for (v of [c.right]; track v) {
            <span class="item" animate.enter="kit-item-drop">{{ v }}</span>
          }
          <span class="plate"></span>
        </div>
      </div>
      <div class="pivot">
        @for (op of [c.op]; track op) {
          <span class="op" animate.enter="kit-pop">{{ op }}</span>
        }
      </div>
      <div class="post"></div>
      <div class="foot"></div>

      <div class="verdict-slot">
        @if (c.result !== undefined) {
          @for (r of [c.result]; track r) {
            <span
              class="verdict"
              [class.is-true]="r"
              [class.is-false]="!r"
              animate.enter="kit-item-drop"
              >{{ r }}</span
            >
          }
        }
      </div>
    </div>
  `,
})
export class Scale {
  compare = input.required<Compare>();
  readonly tiltDeg = TILT_DEG;
  /** Nivelada enquanto a turma palpita; inclina quando a balança responde. */
  readonly tilt = computed(() => {
    const c = this.compare();
    return c.result === undefined ? 0 : scaleTilt(c.left, c.right);
  });
}
