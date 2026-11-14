import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CoverSlide, Syntax } from '../kit.data';
import { Chest } from '../ui/chest/chest';

@Component({
  selector: 'kit-cover-view',
  imports: [Chest],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    <div class="relative flex h-full flex-col justify-center px-24">
      <div
        aria-hidden="true"
        class="absolute -right-24 -bottom-40 h-[560px] w-[560px] rounded-full bg-accent/10 blur-3xl"
      ></div>
      <p
        class="kit-rise inline-flex items-center gap-3 self-start rounded-full bg-ink/50 px-5 py-2 font-mono text-[18px] text-accent-soft shadow-inset"
      >
        <span class="h-2.5 w-2.5 rounded-full bg-accent"></span>
        {{ s.eyebrow }}
      </p>
      <h1
        class="kit-rise mt-10 max-w-[900px] font-display text-[104px] leading-[0.95] font-semibold tracking-tight text-paper"
        style="animation-delay: 80ms"
      >
        {{ s.title }}
      </h1>
      <p class="kit-rise mt-8 max-w-[640px] text-[30px] text-muted" style="animation-delay: 160ms">
        {{ s.subtitle }}
      </p>
      <kit-chest
        aria-hidden="true"
        class="kit-rise absolute right-28 bottom-28 scale-[1.6]"
        style="animation-delay: 260ms"
        [state]="{ id: 'capa', shape: 'any', label: 'aula' }"
        [syntax]="syntax()"
      ></kit-chest>
    </div>
  `,
})
export class CoverView {
  slide = input.required<CoverSlide>();
  syntax = input.required<Syntax>();
}
