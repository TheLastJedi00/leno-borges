import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Syntax, type TableSlide, pick } from '../kit.data';
import { parseCode } from '../ui/code/code-markup';
import { ROLE_CLASS } from '../ui/code/code';

/** Tabela que muda com a sintaxe ativa (células aceitam a marcação de código). */
@Component({
  selector: 'kit-table-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    <div class="flex h-full flex-col px-16 pt-14 pb-12">
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ s.title }}
      </h2>
      <div class="mt-8 flex flex-1 flex-col justify-center">
        @for (r of [rows()]; track syntax()) {
          <table class="kit-fade w-full overflow-hidden rounded-2xl bg-raised text-left shadow-raised">
            <thead>
              <tr class="border-b border-line">
                @for (h of s.head; track $index) {
                  <th
                    [style.padding-block.px]="dense() ? 12 : 20"
                    class="px-8 font-mono text-[18px] font-medium uppercase tracking-wider text-faint">
                    {{ h }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of r; track $index) {
                <tr class="border-b border-line/50 last:border-0">
                  @for (cell of row; track $index; let c = $index) {
                    <td
                      class="px-8"
                      [style.padding-block.px]="dense() ? 7 : 18"
                      [style.font-size.px]="dense() ? 24 : 26"
                      [class]="c === 0 ? 'font-display font-medium text-paper' : 'font-mono text-muted'"
                    >
                      @for (tok of cell; track $index) {
                        <span [class]="tok.role ? role[tok.role] : ''">{{ tok.text }}</span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        }
        @if (footnote(); as note) {
          <p class="text-[22px] text-muted" [style.margin-top.px]="dense() ? 16 : 24">{{ note }}</p>
        }
      </div>
    </div>
  `,
})
export class TableView {
  slide = input.required<TableSlide>();
  syntax = input.required<Syntax>();

  readonly role: Record<string, string> = ROLE_CLASS;
  readonly rows = computed(() =>
    (pick(this.slide().rows, this.syntax()) ?? []).map((row) =>
      row.map((cell) => parseCode(cell)[0]),
    ),
  );
  /** Mais de 6 linhas: linhas mais baixas para a tabela caber no palco. */
  readonly dense = computed(() => this.rows().length > 6);
  readonly footnote = computed(() => pick(this.slide().footnote, this.syntax()));
}
