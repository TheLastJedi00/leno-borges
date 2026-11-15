import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../../i18n/i18n';
import type { StackFrame, StackState } from '../../kit.data';

/** Largura de um caractere da JetBrains Mono a 22px (0,6 em). */
const CHAR = 13.2;
/** Medidas de uma sala: cabeçalho, linha de baús e vão entre salas. */
const HEAD_H = 44;
const VARS_H = 52;
const GAP = 14;
const PAD = 20;
const MIN_W = 240;

/** Largura de um baú em miniatura: `nome │ valor`. */
const varWidth = (v: { name: string; value: string }) => (v.name.length + v.value.length) * CHAR + 44;

/**
 * Tamanho da pilha (para a escala fixa do slide): a sala mais larga e a soma das alturas, mais a
 * etiqueta do `return` à direita da sala do topo.
 */
export function stackSize(state: StackState, fileName = ''): { width: number; height: number } {
  const widths = state.frames.map((f) =>
    Math.max(
      MIN_W,
      (f.name ?? fileName).length * CHAR + 2 * PAD,
      (f.vars ?? []).reduce((sum, v) => sum + varWidth(v) + 12, 2 * PAD - 12),
    ),
  );
  const heights = state.frames.map((f) => HEAD_H + (f.vars?.length ? VARS_H : 0) + 12);
  const tag = state.returning ? ('return '.length + state.returning.length) * CHAR + 56 : 0;
  return {
    width: Math.max(...widths, 0) + tag,
    height: heights.reduce((a, b) => a + b, 0) + GAP * Math.max(0, state.frames.length - 1),
  };
}

/**
 * Pilha de chamadas: cada chamada abre uma sala em cima da sala de quem chamou, com os próprios
 * baús (parâmetros e variáveis). A sala do topo é a que está rodando; o `return` entrega o valor
 * para a sala de baixo e a sala do topo fecha.
 */
@Component({
  selector: 'kit-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './stack.css',
  host: { class: 'inline-block' },
  template: `
    @let st = state();
    <div class="stack" role="img" [attr.aria-label]="description()">
      @for (f of st.frames; track $index; let i = $index; let top = $last) {
        <div class="frame" [class.is-top]="top" [class.is-file]="!f.name" aria-hidden="true">
          <div class="head">
            <span class="name">{{ f.name ?? fileName() }}</span>
            @if (top && st.returning) {
              <span class="returning"><span class="kw">return</span> {{ st.returning }}<span class="arrow">↓</span></span>
            }
          </div>
          @if (f.vars?.length) {
            <div class="vars">
              @for (v of f.vars; track v.name) {
                <span class="var"><span class="var-name">{{ v.name }}</span><span class="var-value">{{ v.value }}</span></span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Stack {
  state = input.required<StackState>();
  private readonly t = inject(I18n).t;

  /** Nome da sala de baixo no JS/TS, que não tem `main`: o próprio arquivo. */
  readonly fileName = computed(() => this.t().kit.exercise.stackFile);

  /** Leitor de tela: `pilha de chamadas: arquivo, dobro (n = 4); devolve 8`. */
  readonly description = computed(() => {
    const ex = this.t().kit.exercise;
    const st = this.state();
    const frame = (f: StackFrame) => {
      const vars = (f.vars ?? []).map((v) => `${v.name} = ${v.value}`).join(', ');
      return `${f.name ?? this.fileName()}${vars ? ` (${vars})` : ''}`;
    };
    const returning = st.returning ? `; ${ex.stackReturns} ${st.returning}` : '';
    return `${ex.stackLabel}: ${st.frames.map(frame).join(', ')}${returning}`;
  });
}
