import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Syntax, type TraceSlide, pick } from '../kit.data';
import { Code, ROLE_CLASS } from '../ui/code/code';
import { fitFontSize, parseCode } from '../ui/code/code-markup';

/**
 * Teste de mesa: o código à esquerda e, à direita, uma tabela com o valor das variáveis a cada
 * volta. Uma linha aparece por etapa (o espaço das próximas já fica reservado); a linha nova fica
 * em destaque e a linha do código correspondente acende.
 */
@Component({
  selector: 'kit-trace-view',
  imports: [Code],
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
      <div class="mt-6 flex min-h-0 flex-1 items-center gap-10">
        <div class="w-[520px] shrink-0">
          <kit-code
            [markup]="code()"
            [syntax]="syntax()"
            [activeLine]="activeLine()"
            [fontSize]="fontSize()"
          ></kit-code>
        </div>
        <table class="flex-1 overflow-hidden rounded-2xl bg-raised text-center shadow-raised">
          <thead>
            <tr class="border-b border-line">
              @for (h of head(); track $index) {
                <th class="px-5 py-3 font-mono text-[22px] font-semibold whitespace-nowrap">
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
                @for (cell of row.cells; track $index) {
                  <td
                    class="px-5 py-[10px] font-mono text-[26px] whitespace-pre"
                    [class]="cellClass(cell)"
                    [class.kit-trace-new]="r === step()"
                  >
                    {{ cell }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .kit-trace-new {
      background-color: color-mix(in oklab, var(--color-accent) 12%, transparent);
    }
  `,
})
export class TraceView {
  slide = input.required<TraceSlide>();
  step = input(0);
  syntax = input.required<Syntax>();

  readonly role: Record<string, string> = ROLE_CLASS;
  readonly lead = computed(() => pick(this.slide().lead, this.syntax()));
  readonly code = computed(() => pick(this.slide().code, this.syntax()) ?? '');
  /** 24, ou menos quando a linha mais comprida não cabe nos 472px de texto. */
  readonly fontSize = computed(() => fitFontSize(this.code(), 24, 472));
  readonly head = computed(() =>
    this.slide().columns.map((c) => parseCode(pick(c.head, this.syntax()) ?? '')[0]),
  );
  readonly activeLine = computed(() => {
    const row = this.slide().rows[Math.min(this.step(), this.slide().rows.length - 1)];
    return pick(row?.line, this.syntax()) ?? null;
  });

  /** true em verde, false em vermelho, o resto na cor de valor. */
  cellClass(cell: string): string {
    if (cell === 'true') return 'text-kit-value font-bold';
    if (cell === 'false') return 'text-kit-error font-bold';
    return 'text-paper';
  }
}
