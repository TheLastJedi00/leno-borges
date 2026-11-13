import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { CodeMarkup, Syntax, TokenRole } from '../../kit.data';
import { parseCode, plainCode } from './code-markup';

const FILE: Record<Syntax, string> = { js: 'aula.js', ts: 'aula.ts', java: 'Aula.java' };

/** Cor de cada papel: nome = etiqueta, valor = item, tipo = baú (as mesmas cores da ilustração). */
export const ROLE_CLASS: Record<TokenRole, string> = {
  k: 'text-kit-keyword',
  t: 'text-accent-soft',
  n: 'text-kit-name',
  v: 'text-kit-value',
  f: 'text-paper',
  c: 'text-faint italic',
};

/** Bloco de código com linhas reveladas por etapa e destaque por papel ou por linha. */
@Component({
  selector: 'kit-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <figure class="overflow-hidden rounded-2xl bg-ink shadow-inset">
      <figcaption class="flex items-center gap-2 border-b border-line/60 px-6 py-3">
        <span class="h-3 w-3 rounded-full bg-line"></span>
        <span class="h-3 w-3 rounded-full bg-line"></span>
        <span class="h-3 w-3 rounded-full bg-line"></span>
        <span class="ml-3 font-mono text-[16px] text-faint">{{ file() }}</span>
      </figcaption>
      <pre
        class="px-6 py-5 font-mono leading-[1.55] whitespace-pre text-muted"
        [style.font-size.px]="fontSize()"
        [attr.aria-label]="plain()"
      ><code aria-hidden="true">@for (line of lines(); track $index; let i = $index) {<span
        class="-mx-6 block px-6 transition-[opacity,background-color] duration-500"
        [class.opacity-0]="visible() !== undefined && i >= visible()!"
        [class.kit-line-active]="activeLine() === i + 1"
        [class.opacity-40]="activeLine() && activeLine() !== i + 1 && (visible() === undefined || i < visible()!)"
      >@for (tok of line; track $index) {<span
        class="rounded-md transition-[opacity,background-color,box-shadow] duration-300"
        [class]="tok.role ? roleClass[tok.role] : ''"
        [class.opacity-35]="highlight() && tok.role !== highlight()"
        [class.kit-token-focus]="highlight() && tok.role === highlight()"
      >{{ tok.text }}</span>}&#8203;</span>}</code></pre>
    </figure>
  `,
})
export class Code {
  markup = input.required<CodeMarkup>();
  syntax = input.required<Syntax>();
  /** Linhas visíveis; sem valor, todas. */
  visible = input<number | undefined>(undefined);
  highlight = input<TokenRole | null | undefined>(null);
  activeLine = input<number | null | undefined>(null);
  fontSize = input(28);

  readonly roleClass = ROLE_CLASS;
  readonly lines = computed(() => parseCode(this.markup()));
  readonly plain = computed(() => plainCode(this.markup()));
  readonly file = computed(() => FILE[this.syntax()]);
}
