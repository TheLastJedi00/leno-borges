import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type CardsSlide, type Syntax, pick } from '../kit.data';
import { parseCode } from '../ui/code/code-markup';
import { ROLE_CLASS } from '../ui/code/code';

const TONE: Record<string, string> = {
  good: 'border-kit-value',
  bad: 'border-kit-error',
  neutral: 'border-accent',
};

/** Slide de cards: um card a mais por etapa (o espaço já fica reservado, sem pular layout). */
@Component({
  selector: 'kit-cards-view',
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
      <ul
        class="mt-8 grid flex-1 content-center gap-6"
        [style.grid-template-columns]="'repeat(' + columns() + ', minmax(0, 1fr))'"
      >
        @for (card of cards(); track $index; let i = $index) {
          <li
            class="flex flex-col rounded-2xl border-l-[6px] bg-raised px-8 py-7 shadow-raised transition-[opacity,translate] duration-500"
            [class]="tone(card.tone)"
            [class.opacity-0]="i > step()"
            [class.translate-y-6]="i > step()"
            [attr.aria-hidden]="i > step()"
          >
            <p class="font-display text-[34px] leading-tight font-semibold text-paper">
              @if (card.tone === 'good') {
                <span class="text-kit-value" aria-hidden="true">✓ </span>
              } @else if (card.tone === 'bad') {
                <span class="text-kit-error" aria-hidden="true">✗ </span>
              }
              {{ card.title }}
            </p>
            @if (card.value) {
              <p class="mt-5 font-mono text-[40px] leading-tight break-words">
                @for (tok of card.value; track $index) {
                  <span [class]="tok.role ? role[tok.role] : 'text-muted'">{{ tok.text }}</span>
                }
              </p>
            }
            @if (card.text) {
              <p class="mt-4 text-[24px] leading-snug text-muted">{{ card.text }}</p>
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class CardsView {
  slide = input.required<CardsSlide>();
  step = input(0);
  syntax = input.required<Syntax>();

  readonly role: Record<string, string> = ROLE_CLASS;
  readonly lead = computed(() => pick(this.slide().lead, this.syntax()));
  readonly columns = computed(
    () => this.slide().columns ?? Math.min(4, Math.max(1, this.slide().cards.length)),
  );
  readonly cards = computed(() =>
    this.slide().cards.map((c) => {
      const value = pick(c.value, this.syntax());
      return {
        title: c.title,
        tone: c.tone,
        text: pick(c.text, this.syntax()),
        // O valor aceita a mesma marcação do código: {n:nome}, {v:25}...
        value: value ? parseCode(value)[0] : null,
      };
    }),
  );

  tone(tone: string | undefined) {
    return TONE[tone ?? 'neutral'];
  }
}
