import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Syntax, type TruthSlide, pick } from '../kit.data';
import { ROLE_CLASS } from '../ui/code/code';
import { parseCode } from '../ui/code/code-markup';

/**
 * Tabela-verdade: entradas à esquerda, resultados destacados à direita. Uma linha aparece por
 * etapa; o espaço das próximas já fica reservado, sem pular o layout.
 */
@Component({
  selector: 'kit-truth-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    <div class="flex h-full flex-col px-16 pt-14 pb-12">
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ s.title }}
      </h2>
      @if (lead(); as text) {
        <p class="mt-3 max-w-[1040px] text-[28px] leading-snug text-muted">{{ text }}</p>
      }
      <div class="mt-6 flex flex-1 flex-col items-center justify-center">
        <table class="overflow-hidden rounded-2xl bg-raised text-center shadow-raised">
          <thead>
            <tr class="border-b border-line">
              @for (h of head(); track $index; let c = $index) {
                <th
                  class="px-9 py-4 font-mono text-[24px] font-semibold whitespace-nowrap"
                  [class.border-l-2]="c === firstResult()"
                  [class.border-line]="c === firstResult()"
                  [class.bg-ink]="isResult(c)"
                >
                  @for (tok of h; track $index) {
                    <span [class]="tok.role ? role[tok.role] : 'text-muted'">{{ tok.text }}</span>
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of s.rows; track $index; let r = $index) {
              <tr
                class="border-b border-line/50 transition-[opacity,translate] duration-500 last:border-0"
                [class.opacity-0]="r > step()"
                [class.translate-y-3]="r > step()"
                [attr.aria-hidden]="r > step()"
              >
                @for (cell of row; track $index; let c = $index) {
                  <td
                    class="px-9 py-[14px] font-mono text-[30px]"
                    [class.font-bold]="isResult(c)"
                    [class.bg-ink]="isResult(c)"
                    [class.border-l-2]="c === firstResult()"
                    [class.border-line]="c === firstResult()"
                    [class.text-kit-value]="cell"
                    [class.text-kit-error]="!cell"
                    [class.kit-truth-new]="r === step()"
                  >
                    {{ cell }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
        @if (footnote(); as note) {
          <p class="mt-6 text-[22px] text-muted">{{ note }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .kit-truth-new {
      background-color: color-mix(in oklab, var(--color-accent) 12%, transparent);
    }
  `,
})
export class TruthView {
  slide = input.required<TruthSlide>();
  step = input(0);
  syntax = input.required<Syntax>();

  readonly role: Record<string, string> = ROLE_CLASS;
  readonly lead = computed(() => pick(this.slide().lead, this.syntax()));
  readonly footnote = computed(() => pick(this.slide().footnote, this.syntax()));
  readonly head = computed(() =>
    (pick(this.slide().head, this.syntax()) ?? []).map((h) => parseCode(h)[0]),
  );
  readonly firstResult = computed(() => Math.min(...this.slide().results));

  isResult(column: number): boolean {
    return this.slide().results.includes(column);
  }
}
