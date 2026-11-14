import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { type CircuitMode, type CircuitState, circuitExpression, lampOn } from '../../kit.data';

interface SwitchSpot {
  index: number;
  cx: number;
  cy: number;
}

interface Layout {
  wires: string[];
  switches: SwitchSpot[];
  lamp: { x: number; y: number };
  inverter?: { x: number; y: number };
}

/**
 * Desenho de cada ligação (viewBox 600×320): fonte à esquerda, lâmpada à direita, retorno embaixo.
 * Série (&&): os dois interruptores no mesmo fio. Paralelo (||): um em cada ramo. Inversor (!):
 * o interruptor passa por uma caixa que inverte o sinal.
 */
const LAYOUTS: Record<CircuitMode, Layout> = {
  and: {
    wires: ['M50 203 V120 H170', 'M230 120 H330', 'M390 120 H530 V290 H50 V267'],
    switches: [
      { index: 0, cx: 200, cy: 120 },
      { index: 1, cx: 360, cy: 120 },
    ],
    lamp: { x: 530, y: 205 },
  },
  or: {
    wires: [
      'M50 203 V160 H130',
      'M130 160 V95 H250',
      'M310 95 H450 V160',
      'M130 160 V225 H250',
      'M310 225 H450 V160',
      'M450 160 H530 V290 H50 V267',
    ],
    switches: [
      { index: 0, cx: 280, cy: 95 },
      { index: 1, cx: 280, cy: 225 },
    ],
    lamp: { x: 530, y: 225 },
  },
  not: {
    wires: ['M50 203 V120 H170', 'M230 120 H330', 'M410 120 H530 V290 H50 V267'],
    switches: [{ index: 0, cx: 200, cy: 120 }],
    lamp: { x: 530, y: 205 },
    inverter: { x: 370, y: 120 },
  },
};

/** Ângulo da alavanca do interruptor desligado (aberta). */
const OPEN_DEG = -34;

/** Zigue-zague do filamento, centrado na lâmpada. */
function filamentPath(x: number, y: number): string {
  return `M${x - 12} ${y + 6} l6 -12 l6 12 l6 -12 l6 12`;
}

/**
 * Circuito de interruptores e lâmpada: a lâmpada acende quando a expressão lógica dá true.
 * Com `interactive`, cada interruptor vira um botão (clique, Enter ou espaço) e emite `toggled`.
 */
@Component({
  selector: 'kit-circuit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './circuit.css',
  host: { class: 'inline-block' },
  template: `
    @let l = layout();
    <svg
      viewBox="0 0 600 320"
      width="600"
      height="320"
      class="circuit"
      [class.is-on]="on()"
      role="img"
      [attr.aria-label]="description()"
    >
      <text class="expr" x="300" y="34" text-anchor="middle">
        {{ expression() }} <tspan class="arrow">→</tspan>
        <tspan [attr.class]="on() ? 'yes' : 'no'">{{ on() }}</tspan>
      </text>

      @for (d of l.wires; track $index) {
        <path class="wire" [attr.d]="d" />
      }

      <!-- Fonte -->
      <rect class="battery" x="32" y="203" width="36" height="64" rx="8" />
      <text class="battery-mark" x="50" y="230" text-anchor="middle">+</text>
      <text class="battery-mark" x="50" y="258" text-anchor="middle">−</text>

      @if (l.inverter; as inv) {
        <rect
          class="inverter"
          [attr.x]="inv.x - 40"
          [attr.y]="inv.y - 28"
          width="80"
          height="56"
          rx="12"
        />
        <text class="inverter-mark" [attr.x]="inv.x" [attr.y]="inv.y + 12" text-anchor="middle">
          !
        </text>
      }

      @for (sw of l.switches; track sw.index) {
        @let closed = !!state().switches[sw.index];
        <g
          class="switch"
          [class.is-interactive]="interactive()"
          [attr.role]="interactive() ? 'switch' : null"
          [attr.tabindex]="interactive() ? 0 : null"
          [attr.aria-checked]="interactive() ? closed : null"
          [attr.aria-label]="interactive() ? labelOf(sw.index) : null"
          (click)="toggle(sw.index)"
          (keydown.enter)="toggle(sw.index); $event.preventDefault()"
          (keydown.space)="toggle(sw.index); $event.preventDefault()"
        >
          <rect
            class="hit"
            [attr.x]="sw.cx - 46"
            [attr.y]="sw.cy - 62"
            width="92"
            height="104"
            rx="14"
          />
          <line
            class="lever"
            [attr.x1]="sw.cx - 30"
            [attr.y1]="sw.cy"
            [attr.x2]="sw.cx + 30"
            [attr.y2]="sw.cy"
            [style.transform-origin]="sw.cx - 30 + 'px ' + sw.cy + 'px'"
            [style.transform]="closed ? 'rotate(0deg)' : 'rotate(' + openDeg + 'deg)'"
          />
          <circle class="terminal" [attr.cx]="sw.cx - 30" [attr.cy]="sw.cy" r="7" />
          <circle class="terminal" [attr.cx]="sw.cx + 30" [attr.cy]="sw.cy" r="7" />
          <text class="label" [attr.x]="sw.cx" [attr.y]="sw.cy - 40" text-anchor="middle">
            {{ labelOf(sw.index) }}
          </text>
          <text
            class="value"
            [class.yes]="closed"
            [class.no]="!closed"
            [attr.x]="sw.cx"
            [attr.y]="sw.cy + 36"
            text-anchor="middle"
          >
            {{ closed }}
          </text>
        </g>
      }

      <!-- Lâmpada -->
      <circle class="glow" [attr.cx]="l.lamp.x" [attr.cy]="l.lamp.y" r="62" />
      <circle class="bulb" [attr.cx]="l.lamp.x" [attr.cy]="l.lamp.y" r="30" />
      <path class="filament" [attr.d]="filament()" />
    </svg>
  `,
})
export class Circuit {
  state = input.required<CircuitState>();
  interactive = input(false);
  /** Textos da lâmpada para leitor de tela ("a && b: lâmpada acesa"); vêm do dicionário. */
  lampText = input<{ on: string; off: string }>({ on: 'on', off: 'off' });
  toggled = output<number>();

  readonly openDeg = OPEN_DEG;
  readonly layout = computed(() => LAYOUTS[this.state().mode]);
  readonly filament = computed(() => filamentPath(this.layout().lamp.x, this.layout().lamp.y));
  readonly on = computed(() => lampOn(this.state().mode, this.state().switches));
  readonly expression = computed(() => circuitExpression(this.state().mode, this.state().labels));
  readonly description = computed(
    () => `${this.expression()}: ${this.on() ? this.lampText().on : this.lampText().off}`,
  );

  labelOf(index: number): string {
    return this.state().labels?.[index] ?? (index === 0 ? 'a' : 'b');
  }

  toggle(index: number) {
    if (this.interactive()) this.toggled.emit(index);
  }
}
