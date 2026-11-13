import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CoverSlide } from '../kit.data';

@Component({
  selector: 'kit-cover-view',
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
      <p class="kit-rise mt-8 max-w-[760px] text-[30px] text-muted" style="animation-delay: 160ms">
        {{ s.subtitle }}
      </p>
      <ng-content />
    </div>
  `,
})
export class CoverView {
  slide = input.required<CoverSlide>();
}
