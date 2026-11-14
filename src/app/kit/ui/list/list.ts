import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../../i18n/i18n';
import type { ListState } from '../../kit.data';

/** Largura de um caractere da JetBrains Mono a 22px (0,6 em). */
const CHAR = 13.2;
const DRAWER_H = 60;
const GAP = 14;
const PAD = 18;
const TAG_H = 40;
const TAG_GAP = 10;
const INDEX_H = 40;
/** Distância entre o gaveteiro e a gaveta fantasma (mais um espaço quando o índice pula casas). */
const GHOST_GAP = 28;
const SKIP_W = 40;

export interface ListSlot {
  id: string;
  value: string;
  /** Posição da gaveta: é o índice. */
  index: number;
  x: number;
  focus: boolean;
}

export interface ListLayout {
  width: number;
  height: number;
  drawerW: number;
  cabinetW: number;
  /** Topo do gaveteiro (abaixo da etiqueta com o nome). */
  cabinetY: number;
  slots: ListSlot[];
  /** Gaveta fantasma do índice que não existe, depois do gaveteiro. */
  ghost: { index: number; x: number; skipped: boolean } | null;
}

/** Geometria do gaveteiro: gavetas da mesma largura, lado a lado, com o índice embaixo. */
export function listLayout(state: ListState): ListLayout {
  const n = state.items.length;
  const longest = Math.max(state.name.length, ...state.items.map((i) => i.value.length));
  const drawerW = Math.max(96, Math.ceil(longest * CHAR) + 32);
  const pitch = drawerW + GAP;
  const cabinetW = PAD * 2 + Math.max(1, n) * pitch - GAP;
  const slots: ListSlot[] = state.items.map((item, i) => ({
    id: item.id,
    value: item.value,
    index: i,
    x: PAD + i * pitch,
    focus: state.focus === i,
  }));
  const out = state.outside ?? null;
  const ghost =
    out !== null && out >= n
      ? { index: out, x: cabinetW + GHOST_GAP + (out > n ? SKIP_W : 0), skipped: out > n }
      : null;
  const cabinetY = TAG_H + TAG_GAP;
  return {
    width: ghost ? ghost.x + drawerW : cabinetW,
    height: cabinetY + PAD * 2 + DRAWER_H + INDEX_H,
    drawerW,
    cabinetW,
    cabinetY,
    slots,
    ghost,
  };
}

/**
 * Gaveteiro da lista: a etiqueta com o nome e as gavetas numeradas a partir do 0. Gavetas entram
 * pela direita, abrem espaço no meio e saem fechando o espaço; os índices acompanham a posição.
 * Um índice que não existe aparece como gaveta fantasma; `fixed` é o array do Java (parafusado).
 */
@Component({
  selector: 'kit-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './list.css',
  host: { class: 'inline-block' },
  template: `
    @let l = layout();
    <div
      class="list"
      [class.is-fixed]="state().fixed"
      [style.width.px]="l.width"
      [style.height.px]="l.height"
      role="img"
      [attr.aria-label]="description()"
    >
      <span class="tag">{{ state().name }}</span>
      <div class="cabinet" [style.top.px]="l.cabinetY" [style.width.px]="l.cabinetW">
        @if (state().fixed) {
          <span class="bolt" style="left: 6px; top: 6px"></span>
          <span class="bolt" style="right: 6px; top: 6px"></span>
          <span class="bolt" style="left: 6px; bottom: 6px"></span>
          <span class="bolt" style="right: 6px; bottom: 6px"></span>
        }
        @for (s of l.slots; track s.id) {
          <div
            class="drawer"
            animate.enter="drawer-in"
            animate.leave="drawer-out"
            [class.is-focus]="s.focus"
            [style.left.px]="s.x"
            [style.width.px]="l.drawerW"
          >
            <span class="value">{{ s.value }}</span>
            <span class="index">{{ s.index }}</span>
          </div>
        }
      </div>
      @if (l.ghost; as g) {
        @if (g.skipped) {
          <span class="skip" [style.left.px]="g.x - 36" [style.top.px]="l.cabinetY + 34">…</span>
        }
        <div
          class="drawer is-ghost"
          animate.enter="drawer-in"
          [style.left.px]="g.x"
          [style.top.px]="l.cabinetY + 18"
          [style.width.px]="l.drawerW"
        >
          <span class="value">?</span>
          <span class="index">{{ g.index }}</span>
        </div>
      }
    </div>
  `,
})
export class List {
  state = input.required<ListState>();
  private readonly t = inject(I18n).t;

  readonly layout = computed(() => listLayout(this.state()));

  /** Leitor de tela: `frutas: 0 "maçã", 1 "uva"` e o índice fora da lista, se houver. */
  readonly description = computed(() => {
    const st = this.state();
    const items = st.items.map((item, i) => `${i} ${item.value}`).join(', ');
    const ghost = this.layout().ghost;
    const outside = ghost ? `; ${st.name}[${ghost.index}]: ${this.t().kit.exercise.outsideList}` : '';
    return `${st.name}: ${items}${outside}`;
  });
}
