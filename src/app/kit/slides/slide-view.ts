import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Slide, Syntax } from '../kit.data';
import { CoverView } from './cover-view';

/** Moldura comum de um slide (título, selo de aprofundamento) e escolha do layout pelo `kind`. */
@Component({
  selector: 'kit-slide-view',
  imports: [CoverView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block' },
  template: `
    @let s = slide();
    @if (s.tag) {
      <span
        class="absolute top-10 right-12 z-10 rounded-full bg-accent/10 px-4 py-1.5 font-mono text-[15px] uppercase tracking-wider text-accent-soft"
      >
        {{ s.tag }}
      </span>
    }
    @switch (s.kind) {
      @case ('cover') {
        <kit-cover-view [slide]="s"></kit-cover-view>
      }
      @default {
        <div class="flex h-full flex-col px-16 pt-14 pb-12">
          <h2 class="font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
            {{ s.title }}
          </h2>
        </div>
      }
    }
  `,
})
export class SlideView {
  slide = input.required<Slide>();
  step = input(0);
  syntax = input.required<Syntax>();
}
