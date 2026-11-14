import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ExprSlide, type Syntax, pick } from '../kit.data';
import { ROLE_CLASS } from '../ui/code/code';
import { type ExprPart, parseExpr } from '../ui/code/code-markup';

/**
 * Conta passo a passo: cada etapa acrescenta uma linha à "escada" da expressão. A linha atual fica
 * grande, com o trecho calculado em destaque; as anteriores ficam menores e apagadas.
 */
@Component({
  selector: 'kit-expr-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <div class="flex h-full flex-col px-16 pt-14 pb-12">
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ slide().title }}
      </h2>
      @if (caption(); as text) {
        @for (c of [text]; track c) {
          <p class="kit-fade mt-3 max-w-[1040px] text-[28px] leading-snug text-muted">{{ c }}</p>
        }
      }

      <div class="mt-4 flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
        @for (line of lines(); track line.key; let first = $first, last = $last) {
          <p
            class="kit-rise flex items-center gap-6 font-mono leading-tight whitespace-pre transition-[font-size,opacity] duration-500"
            [style.font-size.px]="last ? 76 : 46"
            [class.opacity-45]="!last"
          >
            <span aria-hidden="true" class="w-10 text-right text-faint">{{ first ? '' : '=' }}</span>
            <span [class.text-paper]="!line.result">
              @for (part of line.parts; track $index) {
                <span
                  class="rounded-2xl transition-[background-color,box-shadow] duration-500"
                  [class.kit-expr-focus]="part.focus && last"
                  >@for (tok of part.tokens; track $index) {<span
                    [class]="line.result ? 'text-kit-value' : tok.role ? role[tok.role] : ''"
                    >{{ tok.text }}</span
                  >}</span
                >
              }
            </span>
            <span aria-hidden="true" class="w-10"></span>
          </p>
        }
      </div>
    </div>
  `,
  styles: `
    .kit-expr-focus {
      background-color: color-mix(in oklab, var(--color-accent) 16%, transparent);
      box-shadow: 0 0 0 3px var(--color-accent);
      padding: 0.05em 0.25em;
      margin: 0 -0.1em;
    }
  `,
})
export class ExprView {
  slide = input.required<ExprSlide>();
  step = input(0);
  syntax = input.required<Syntax>();

  readonly role: Record<string, string> = ROLE_CLASS;

  /**
   * Linhas da conta atual, da última etapa com `reset` até a etapa ativa. Uma etapa com `replace`
   * troca a linha anterior e mantém a chave dela (a linha muda sem animar de novo).
   */
  readonly lines = computed(() => {
    const lines: { key: number; result: boolean; parts: ExprPart[] }[] = [];
    this.slide()
      .steps.slice(0, this.step() + 1)
      .forEach((s, i) => {
        if (s.reset) lines.length = 0;
        const line = {
          key: i,
          result: !!s.result,
          parts: parseExpr(pick(s.expr, this.syntax()) ?? ''),
        };
        if (s.replace && lines.length) lines[lines.length - 1] = { ...line, key: lines[lines.length - 1].key };
        else lines.push(line);
      });
    return lines;
  });

  /** A legenda mais recente até a etapa ativa. */
  readonly caption = computed(() => {
    let caption: string | undefined;
    for (const s of this.slide().steps.slice(0, this.step() + 1)) {
      caption = pick(s.caption, this.syntax()) ?? caption;
    }
    return caption;
  });
}
