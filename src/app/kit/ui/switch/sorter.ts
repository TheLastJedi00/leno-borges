import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type SorterState, sorterRoute } from '../../kit.data';

/** Largura de um caractere da JetBrains Mono a 22px (0,6 em). */
const CHAR = 13.2;
const ITEM_H = 44;
const TOP = 76;
const SLOT_H = 56;
const FLOOR = 24;
const PITCH = SLOT_H + FLOOR;
const PAD = 20;
const BREAK_W = 76;

const textW = (text: string) => text.length * CHAR;

export interface SorterSlot {
  index: number;
  label: string;
  out: string;
  y: number;
  ran: boolean;
  landed: boolean;
  /** Fundo do escaninho: `break` (fechado), aberto (cai no de baixo) ou nenhum (o último). */
  floor: 'break' | 'open' | 'none';
}

export interface SorterLayout {
  width: number;
  height: number;
  itemW: number;
  slotX: number;
  slotW: number;
  labelW: number;
  slots: SorterSlot[];
  /** Centro vertical do item: no alto, no escaninho onde caiu ou abaixo de todos. */
  itemY: number;
  /** O item passou direto (nenhum `case` e nenhum `default`). */
  missed: boolean;
}

/** Geometria da triagem: o item numa calha à esquerda, os escaninhos empilhados à direita. */
export function sorterLayout(state: SorterState): SorterLayout {
  const { landed, ran } = sorterRoute(state);
  const n = state.cases.length;
  const labels = [
    ...state.cases.map((c) => `case ${c.label}:`),
    ...(state.fallback ? ['default:'] : []),
  ];
  const outs = [...state.cases.map((c) => c.out ?? ''), ...(state.fallback ? [state.fallback.out ?? ''] : [])];
  const itemW = Math.max(64, textW(state.value) + 32);
  const labelW = Math.max(...labels.map(textW));
  const outW = Math.max(0, ...outs.map(textW));
  const slotX = itemW + 28;
  const slotW = PAD + labelW + (outW ? 28 + outW : 0) + PAD;
  const slots: SorterSlot[] = labels.map((label, i) => ({
    index: i,
    label,
    out: outs[i],
    y: TOP + i * PITCH,
    ran: ran.includes(i),
    landed: landed === i,
    floor: i === labels.length - 1 ? 'none' : i < n && state.cases[i].brk ? 'break' : 'open',
  }));
  const bottom = TOP + labels.length * PITCH - FLOOR;
  const missed = !!state.dropped && landed === null;
  const itemY = !state.dropped
    ? ITEM_H / 2
    : missed
      ? bottom + 16 + ITEM_H / 2
      : TOP + (landed ?? 0) * PITCH + SLOT_H / 2;
  return {
    width: slotX + slotW + BREAK_W,
    height: (missed ? bottom + 16 + ITEM_H : bottom) + 4,
    itemW,
    slotX,
    slotW,
    labelW,
    slots,
    itemY,
    missed,
  };
}

/**
 * Triagem do switch: o valor é um item (como o dos baús) que desce pela calha e cai no escaninho
 * com a etiqueta igual. Os escaninhos que rodam acendem; sem `break`, o fundo fica aberto e a
 * execução continua no de baixo.
 */
@Component({
  selector: 'kit-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sorter.css',
  host: { class: 'inline-block' },
  template: `
    @let l = layout();
    <svg
      [attr.viewBox]="'0 0 ' + l.width + ' ' + l.height"
      [attr.width]="l.width"
      [attr.height]="l.height"
      class="sorter"
      role="img"
      [attr.aria-label]="description()"
    >
      <line class="chute" [attr.x1]="l.itemW / 2" y1="44" [attr.x2]="l.itemW / 2" [attr.y2]="l.height - 4" />

      @for (slot of l.slots; track slot.index) {
        <g class="slot" [class.is-ran]="slot.ran" [class.is-landed]="slot.landed">
          <rect [attr.x]="l.slotX" [attr.y]="slot.y" [attr.width]="l.slotW" height="56" rx="12" />
          <text class="label" [attr.x]="l.slotX + 20" [attr.y]="slot.y + 36">{{ slot.label }}</text>
          @if (slot.out) {
            <text class="out" [attr.x]="l.slotX + 48 + l.labelW" [attr.y]="slot.y + 36">{{ slot.out }}</text>
          }
          @if (slot.floor === 'break') {
            <line
              class="break"
              [attr.x1]="l.slotX"
              [attr.y1]="slot.y + 68"
              [attr.x2]="l.slotX + l.slotW"
              [attr.y2]="slot.y + 68"
            />
            <text class="break-label" [attr.x]="l.slotX + l.slotW + 10" [attr.y]="slot.y + 74">break</text>
          } @else if (slot.floor === 'open') {
            <polygon
              class="fall"
              [class.is-lit]="slot.ran && l.slots[slot.index + 1].ran"
              [attr.points]="fallArrow(l.slotX + l.slotW / 2, slot.y + 58)"
            />
          }
        </g>
      }

      <g
        class="item"
        [class.is-missed]="l.missed"
        [style.transform]="'translateY(' + (l.itemY - 22) + 'px)'"
      >
        <rect x="0" y="0" [attr.width]="l.itemW" height="44" rx="10" />
        <text [attr.x]="l.itemW / 2" y="30" text-anchor="middle">{{ state().value }}</text>
      </g>
    </svg>
  `,
})
export class Sorter {
  state = input.required<SorterState>();

  readonly layout = computed(() => sorterLayout(this.state()));

  /** Leitor de tela: `switch (2): case 2, "Segunda"` (e os de baixo, se a queda continuar). */
  readonly description = computed(() => {
    const st = this.state();
    const ran = this.layout().slots.filter((s) => s.ran);
    const what = ran.map((s) => [s.label.replace(/:$/, ''), s.out].filter(Boolean).join(', '));
    return `switch (${st.value})` + (what.length ? `: ${what.join('; ')}` : '');
  });

  /** Seta curta para baixo pelo fundo aberto do escaninho. */
  fallArrow(x: number, y: number): string {
    return `${x - 9},${y} ${x + 9},${y} ${x},${y + 16}`;
  }
}
