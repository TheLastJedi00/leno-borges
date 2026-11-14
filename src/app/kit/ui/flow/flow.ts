import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type FlowState, flowRoute } from '../../kit.data';

/** Largura de um caractere da JetBrains Mono a 22px (0,6 em). */
const CHAR = 13.2;
const ENTRY = 40;
/** Losango: altura, pontas laterais e espaço do texto. */
const H = 76;
const TIP = 34;
const PITCH = H + 48;
const GAP_X = 104;
const BOX_H = 60;
const END_R = 12;
const MIN_COND_W = 200;
const MIN_BOX_W = 120;

const textW = (text: string) => text.length * CHAR;

export interface FlowNode {
  index: number;
  text: string;
  x: number;
  y: number;
  w: number;
  /** Já perguntado, com a resposta; `undefined` se ainda não. */
  answer?: boolean;
  /** Fora do caminho (decisão tomada por outro lado, ou nem chegou a perguntar). */
  dim: boolean;
}

export interface FlowBox {
  text: string;
  x: number;
  y: number;
  w: number;
  taken: boolean;
  dim: boolean;
}

export interface FlowArrow {
  /** Pontos da linha (o último leva a ponta da seta). */
  points: [number, number][];
  label?: 'true' | 'false';
  labelAt?: [number, number];
  lit: boolean;
}

export interface FlowLayout {
  width: number;
  height: number;
  nodes: FlowNode[];
  boxes: FlowBox[];
  arrows: FlowArrow[];
  /** Fim sem `else`: círculo de "segue o programa". */
  end?: { x: number; y: number; lit: boolean };
}

/** Geometria do fluxograma: losangos numa coluna, o que roda à direita, `else` embaixo. */
export function flowLayout(state: FlowState): FlowLayout {
  const n = state.conditions.length;
  const { asked, taken } = flowRoute(state);
  const decided = taken !== null;
  const hasElse = state.outcomes.length > n;
  const condW = Math.max(MIN_COND_W, ...state.conditions.map((c) => textW(c) + 2 * TIP + 24));
  const sideTexts = state.outcomes.slice(0, n);
  const boxW = Math.max(MIN_BOX_W, ...sideTexts.map((t) => textW(t) + 40));
  const elseText = hasElse ? state.outcomes[n] : '';
  const elseW = hasElse ? Math.max(MIN_BOX_W, textW(elseText) + 40) : 0;
  const x0 = Math.max(8, elseW / 2 - condW / 2 + 8);
  const cx = x0 + condW / 2;
  const boxX = x0 + condW + GAP_X;

  const nodes: FlowNode[] = [];
  const boxes: FlowBox[] = [];
  const arrows: FlowArrow[] = [
    { points: [[cx, 0], [cx, ENTRY]], lit: asked > 0 },
  ];

  state.conditions.forEach((text, i) => {
    const y = ENTRY + i * PITCH;
    const cy = y + H / 2;
    const answer = i < asked ? state.answers[i] : undefined;
    nodes.push({ index: i, text, x: x0, y, w: condW, answer, dim: decided && i >= asked });
    const isTaken = taken === i;
    arrows.push({
      points: [[x0 + condW, cy], [boxX, cy]],
      label: 'true',
      labelAt: [x0 + condW + GAP_X / 2, cy - 14],
      lit: isTaken,
    });
    boxes.push({ text: state.outcomes[i] ?? '', x: boxX, y: cy - BOX_H / 2, w: boxW, taken: isTaken, dim: decided && !isTaken });
    const nextY = ENTRY + (i + 1) * PITCH;
    arrows.push({
      points: [[cx, y + H], [cx, nextY]],
      label: 'false',
      labelAt: [cx + 14, y + H + (PITCH - H) / 2 + 8],
      lit: answer === false,
    });
  });

  const bottom = ENTRY + n * PITCH;
  let height: number;
  let end: FlowLayout['end'];
  if (hasElse) {
    boxes.push({ text: elseText, x: cx - elseW / 2, y: bottom, w: elseW, taken: taken === n, dim: decided && taken !== n });
    height = bottom + BOX_H + 4;
  } else {
    const ey = bottom + END_R + 3;
    end = { x: cx, y: ey, lit: taken === 'none' };
    height = ey + END_R + 4;
  }
  const width = Math.max(boxX + boxW, cx + elseW / 2) + 8;
  return { width, height, nodes, boxes, arrows, end };
}

/** Losango alongado (pontas à esquerda e à direita) para o texto da condição caber. */
export function lozenge(x: number, y: number, w: number): string {
  const m = y + H / 2;
  return [
    [x, m], [x + TIP, y], [x + w - TIP, y], [x + w, m], [x + w - TIP, y + H], [x + TIP, y + H],
  ].map((p) => p.join(',')).join(' ');
}

/** Ponta da seta no fim da linha, apontando na direção do último segmento. */
export function arrowHead(points: [number, number][]): string {
  const [[x1, y1], [x2, y2]] = points.slice(-2);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (d: number, s: number) =>
    `${x2 - d * Math.cos(a) + s * Math.sin(a)},${y2 - d * Math.sin(a) - s * Math.cos(a)}`;
  return `${x2},${y2} ${p(14, 8)} ${p(14, -8)}`;
}

/**
 * Fluxograma do if / else / else if: a execução desce pelos losangos e o caminho percorrido
 * acende, como a corrente do circuito da aula 4. O losango perguntado mostra a resposta.
 */
@Component({
  selector: 'kit-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './flow.css',
  host: { class: 'inline-block' },
  template: `
    @let l = layout();
    <svg
      [attr.viewBox]="'0 0 ' + l.width + ' ' + l.height"
      [attr.width]="l.width"
      [attr.height]="l.height"
      class="flow"
      role="img"
      [attr.aria-label]="description()"
    >
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
              [attr.text-anchor]="a.label === 'true' ? 'middle' : 'start'"
            >
              {{ a.label }}
            </text>
          }
        </g>
      }

      @for (node of l.nodes; track node.index) {
        <g
          class="node"
          [class.is-dim]="node.dim"
          [class.is-true]="node.answer === true"
          [class.is-false]="node.answer === false"
        >
          <polygon class="lozenge" [attr.points]="lozenge(node.x, node.y, node.w)" />
          <text class="cond" [attr.x]="node.x + node.w / 2" [attr.y]="node.y + 46" text-anchor="middle">
            {{ node.text }}
          </text>
        </g>
      }

      @for (box of l.boxes; track $index) {
        <g class="box" [class.is-taken]="box.taken" [class.is-dim]="box.dim">
          <rect [attr.x]="box.x" [attr.y]="box.y" [attr.width]="box.w" height="60" rx="14" />
          <text [attr.x]="box.x + box.w / 2" [attr.y]="box.y + 38" text-anchor="middle">
            {{ box.text }}
          </text>
        </g>
      }

      @if (l.end; as e) {
        <circle class="end" [class.is-lit]="e.lit" [attr.cx]="e.x" [attr.cy]="e.y" r="12" />
      }
    </svg>
  `,
})
export class Flow {
  state = input.required<FlowState>();

  readonly layout = computed(() => flowLayout(this.state()));
  readonly lozenge = lozenge;
  readonly head = arrowHead;

  /** Leitor de tela: cada condição com a resposta e o que rodou (`nota >= 9: false; nota >= 7: true → "B"`). */
  readonly description = computed(() => {
    const st = this.state();
    const { asked, taken } = flowRoute(st);
    const parts = st.conditions.slice(0, Math.max(asked, 1)).map((c, i) => (i < asked ? `${c}: ${st.answers[i]}` : c));
    const result = typeof taken === 'number' ? ` → ${st.outcomes[taken]}` : '';
    return parts.join('; ') + result;
  });

  pointsOf(points: [number, number][]): string {
    return points.map((p) => p.join(',')).join(' ');
  }
}
