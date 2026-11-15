import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../../i18n/i18n';
import type { LoopState } from '../../kit.data';
import { arrowHead, lozenge } from '../flow/flow';

/** Largura de um caractere da JetBrains Mono a 22px (0,6 em). */
const CHAR = 13.2;
/** Altura do losango (a mesma do fluxograma). */
const H = 76;
const TIP = 34;
const ENTRY = 40;
const GAP = 48;
const LINE_H = 34;
const BOX_PAD = 14;
const INIT_H = 56;
/** Corredor da seta que volta, à esquerda. */
const LANE = 36;
/** Distância da seta de saída, à direita do losango. */
const EXIT = 64;
const END_R = 12;
const BADGE_H = 40;

const textW = (text: string) => text.length * CHAR;

type Point = [number, number];

export interface LoopArrow {
  points: Point[];
  lit: boolean;
  label?: 'true' | 'false';
  labelAt?: Point;
}

export interface LoopLayout {
  width: number;
  height: number;
  init: { x: number; y: number; w: number } | null;
  cond: { x: number; y: number; w: number };
  body: { x: number; y: number; w: number; h: number; lines: { text: string; y: number; update: boolean }[] };
  arrows: LoopArrow[];
  end: { x: number; y: number; lit: boolean };
  badge: { x: number; y: number; w: number };
}

/**
 * Geometria da pista. No `while` / `for`: começo (opcional), losango, corpo embaixo e a seta que
 * volta pela esquerda até o losango; a saída `false` sai pela direita. No `do...while`: corpo
 * primeiro, losango embaixo; o `true` volta pela esquerda até o corpo e o `false` desce.
 */
export function loopLayout(state: LoopState, badgeText = ''): LoopLayout {
  const isDo = state.kind === 'do';
  const lines = [
    ...state.body.map((text) => ({ text, update: false })),
    ...(state.update ? [{ text: state.update, update: true }] : []),
  ];
  const condW = Math.max(200, textW(state.condition) + 2 * TIP + 24);
  const bodyW = Math.max(160, ...lines.map((l) => textW(l.text) + 2 * 24));
  const initW = state.init ? textW(state.init) + 48 : 0;
  const colW = Math.max(condW, bodyW, initW);
  const cx = LANE + 24 + colW / 2;
  const bodyH = BOX_PAD * 2 + lines.length * LINE_H;
  const badgeW = textW(badgeText) + 32;

  const lit = state.answer !== null || state.laps > 0;
  let y = BADGE_H + 12;
  const init = state.init ? { x: cx - initW / 2, y, w: initW } : null;
  if (init) y += INIT_H;
  const entryTop = y;
  y += ENTRY;

  const arrows: LoopArrow[] = [];
  let cond: LoopLayout['cond'];
  let body: LoopLayout['body'];
  let end: LoopLayout['end'];
  const bodyLines = (top: number) =>
    lines.map((l, i) => ({ ...l, y: top + BOX_PAD + i * LINE_H + 24 }));

  if (!isDo) {
    cond = { x: cx - condW / 2, y, w: condW };
    const midY = y + H / 2;
    const bodyTop = y + H + GAP;
    body = { x: cx - bodyW / 2, y: bodyTop, w: bodyW, h: bodyH, lines: bodyLines(bodyTop) };
    const turnY = bodyTop + bodyH + 28;
    const exitX = cx + Math.max(condW, bodyW) / 2 + EXIT;
    arrows.push({ points: [[cx, entryTop], [cx, y]], lit });
    arrows.push({
      points: [[cx, y + H], [cx, bodyTop]],
      lit: state.answer === true,
      label: 'true',
      labelAt: [cx + 34, y + H + 30],
    });
    arrows.push({
      points: [[cx, bodyTop + bodyH], [cx, turnY], [LANE, turnY], [LANE, midY], [cx - condW / 2, midY]],
      lit: state.laps > 0 && state.answer !== false,
    });
    arrows.push({
      points: [[cx + condW / 2, midY], [exitX, midY], [exitX, turnY - END_R]],
      lit: state.answer === false,
      label: 'false',
      labelAt: [cx + condW / 2 + 10, midY - 12],
    });
    end = { x: exitX, y: turnY, lit: state.answer === false };
  } else {
    const bodyTop = y;
    body = { x: cx - bodyW / 2, y: bodyTop, w: bodyW, h: bodyH, lines: bodyLines(bodyTop) };
    const condTop = bodyTop + bodyH + GAP;
    cond = { x: cx - condW / 2, y: condTop, w: condW };
    const midY = condTop + H / 2;
    const bodyMid = bodyTop + bodyH / 2;
    arrows.push({ points: [[cx, entryTop], [cx, bodyTop]], lit });
    arrows.push({ points: [[cx, bodyTop + bodyH], [cx, condTop]], lit: state.answer !== null });
    arrows.push({
      points: [[cx - condW / 2, midY], [LANE, midY], [LANE, bodyMid], [cx - bodyW / 2, bodyMid]],
      lit: state.answer === true,
      label: 'true',
      labelAt: [cx - condW / 2 - 10, midY - 12],
    });
    const endY = condTop + H + GAP;
    arrows.push({
      points: [[cx, condTop + H], [cx, endY - END_R]],
      lit: state.answer === false,
      label: 'false',
      labelAt: [cx + 40, condTop + H + 30],
    });
    end = { x: cx, y: endY, lit: state.answer === false };
  }

  const right = Math.max(...arrows.flatMap((a) => a.points.map((p) => p[0])), cx + colW / 2) + 8;
  const width = Math.max(right + 40, badgeW + 8);
  return {
    width,
    height: end.y + END_R + 4,
    init,
    cond,
    body,
    arrows,
    end,
    badge: { x: width - badgeW, y: 0, w: badgeW },
  };
}

/**
 * Pista do laço: a execução passa pelo portão da condição a cada volta; `true` entra para mais
 * uma volta, `false` sai. O placar conta as voltas completadas.
 */
@Component({
  selector: 'kit-loop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './loop.css',
  host: { class: 'inline-block' },
  template: `
    @let l = layout();
    @let st = state();
    <svg
      [attr.viewBox]="'0 0 ' + l.width + ' ' + l.height"
      [attr.width]="l.width"
      [attr.height]="l.height"
      class="loop"
      role="img"
      [attr.aria-label]="description()"
    >
      <g class="badge">
        <rect [attr.x]="l.badge.x" [attr.y]="l.badge.y" [attr.width]="l.badge.w" height="40" rx="12" />
        <text [attr.x]="l.badge.x + l.badge.w / 2" [attr.y]="l.badge.y + 27" text-anchor="middle">
          {{ badgeText() }}
        </text>
      </g>

      @if (l.init; as i) {
        <g class="init">
          <rect [attr.x]="i.x" [attr.y]="i.y" [attr.width]="i.w" height="44" rx="10" />
          <text [attr.x]="i.x + i.w / 2" [attr.y]="i.y + 29" text-anchor="middle">{{ st.init }}</text>
        </g>
      }

      @for (a of l.arrows; track $index) {
        <g class="arrow" [class.is-lit]="a.lit">
          <polyline [attr.points]="pointsOf(a.points)" />
          <polygon class="head" [attr.points]="head(a.points)" />
          @if (a.label && a.labelAt; as at) {
            <text
              class="arrow-label"
              [class.yes]="a.label === 'true'"
              [class.no]="a.label === 'false'"
              [attr.x]="at[0]"
              [attr.y]="at[1]"
              [attr.text-anchor]="a.label === 'true' && st.kind === 'do' ? 'end' : 'start'"
            >
              {{ a.label }}
            </text>
          }
        </g>
      }

      <g class="node" [class.is-true]="st.answer === true" [class.is-false]="st.answer === false">
        <polygon class="lozenge" [attr.points]="lozenge(l.cond.x, l.cond.y, l.cond.w)" />
        <text class="cond" [attr.x]="l.cond.x + l.cond.w / 2" [attr.y]="l.cond.y + 46" text-anchor="middle">
          {{ st.condition }}
        </text>
      </g>

      <g class="body" [class.is-taken]="bodyTaken()">
        <rect [attr.x]="l.body.x" [attr.y]="l.body.y" [attr.width]="l.body.w" [attr.height]="l.body.h" rx="14" />
        @for (line of l.body.lines; track $index) {
          @if (line.update) {
            <line
              class="divider"
              [attr.x1]="l.body.x + 12"
              [attr.x2]="l.body.x + l.body.w - 12"
              [attr.y1]="line.y - 26"
              [attr.y2]="line.y - 26"
            />
          }
          <text
            [class.update]="line.update"
            [attr.x]="l.body.x + l.body.w / 2"
            [attr.y]="line.y"
            text-anchor="middle"
          >
            {{ line.text }}
          </text>
        }
      </g>

      <circle class="end" [class.is-lit]="l.end.lit" [attr.cx]="l.end.x" [attr.cy]="l.end.y" r="12" />
    </svg>
  `,
})
export class Loop {
  state = input.required<LoopState>();
  private readonly t = inject(I18n).t;

  /** Placar: `voltas: 2`. */
  readonly badgeText = computed(() => `${this.t().kit.exercise.loopLaps}: ${this.state().laps}`);
  readonly layout = computed(() => loopLayout(this.state(), this.badgeText()));
  readonly lozenge = lozenge;
  readonly head = arrowHead;

  /** O corpo roda nesta etapa: `true` no `while`; no `do...while`, também antes da primeira pergunta. */
  readonly bodyTaken = computed(() => {
    const st = this.state();
    return st.answer === true || (st.kind === 'do' && st.answer === null);
  });

  /** Leitor de tela: `i <= 3: true; voltas: 2`. */
  readonly description = computed(() => {
    const st = this.state();
    const answer = st.answer === null ? '' : `: ${st.answer}`;
    return `${st.condition}${answer}; ${this.badgeText()}`;
  });

  pointsOf(points: [number, number][]): string {
    return points.map((p) => p.join(',')).join(' ');
  }
}
