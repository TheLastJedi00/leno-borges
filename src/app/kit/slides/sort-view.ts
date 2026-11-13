import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { type SortSlide, type Syntax, pick } from '../kit.data';
import { Chest } from '../ui/chest/chest';

/**
 * Exercício "cada item no seu baú": arrastar e soltar, ou clicar no item e depois no baú
 * (funciona com teclado). Sem pontuação salva; o feedback é imediato.
 */
@Component({
  selector: 'kit-sort-view',
  imports: [Chest],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let s = slide();
    @let ex = t().kit.exercise;
    <div class="flex h-full flex-col px-16 pt-14 pb-10" data-kit-exercise>
      <h2 class="pr-64 font-display text-[52px] leading-tight font-semibold tracking-tight text-paper">
        {{ s.title }}
      </h2>
      <p class="mt-3 text-[26px] leading-snug text-muted">{{ s.lead }}</p>
      <p class="mt-1 text-[18px] text-faint">{{ ex.sortHint }}</p>

      <ul class="mt-6 flex min-h-[64px] flex-wrap items-center gap-4" [attr.aria-label]="ex.items">
        @for (item of pending(); track item.value) {
          <li animate.leave="kit-fade-out">
            <button
              type="button"
              draggable="true"
              (dragstart)="onDragStart($event, item.value)"
              (click)="select(item.value)"
              [attr.aria-pressed]="selected() === item.value"
              class="cursor-grab rounded-xl border-2 px-5 py-2 font-mono text-[28px] font-semibold text-kit-value shadow-raised transition-[border-color,translate,box-shadow] active:cursor-grabbing"
              [class]="
                selected() === item.value
                  ? 'border-kit-value -translate-y-1 bg-kit-value/20'
                  : 'border-kit-value/40 bg-kit-value/10 hover:border-kit-value'
              "
            >
              {{ item.value }}
            </button>
          </li>
        }
      </ul>

      <div class="mt-4 flex flex-1 items-end justify-center gap-4">
        @for (bin of s.bins; track bin.id) {
          <div class="flex flex-col items-center gap-3">
            <button
              type="button"
              (click)="place(bin.id)"
              (dragover)="$event.preventDefault()"
              (drop)="onDrop($event, bin.id)"
              [attr.aria-label]="binLabel(bin.label)"
              class="rounded-3xl p-3 transition-[background-color] hover:bg-accent/5"
            >
              <kit-chest
                class="[zoom:0.8]"
                [state]="{
                  id: bin.id,
                  shape: bin.shape,
                  typeName: bin.label,
                  open: true,
                  error: wrongBin() === bin.id,
                  focus: selected() ? 'chest' : undefined,
                }"
                [syntax]="syntax()"
              ></kit-chest>
            </button>
            <ul class="flex min-h-[44px] flex-wrap justify-center gap-2">
              @for (v of placedIn(bin.id); track v) {
                <li
                  animate.enter="kit-rise"
                  class="rounded-lg bg-kit-value/15 px-3 py-1 font-mono text-[20px] text-kit-value"
                >
                  {{ v }}
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="mt-4 flex items-center justify-between gap-6">
        <p
          aria-live="polite"
          class="min-h-[36px] text-[24px] font-medium"
          [class]="feedback()?.tone === 'error' ? 'text-kit-error' : 'text-kit-value'"
        >
          {{ feedback()?.text }}
        </p>
        <button
          type="button"
          (click)="reset()"
          class="rounded-full bg-raised px-5 py-2 font-mono text-[16px] text-faint shadow-raised hover:text-paper active:shadow-inset"
        >
          {{ ex.reset }}
        </button>
      </div>
    </div>
  `,
})
export class SortView {
  slide = input.required<SortSlide>();
  syntax = input.required<Syntax>();
  readonly t = inject(I18n).t;

  /** valor → baú onde foi guardado */
  readonly placed = signal<Record<string, string>>({});
  readonly selected = signal<string | null>(null);
  readonly wrongBin = signal<string | null>(null);
  readonly feedback = signal<{ tone: 'ok' | 'error'; text: string } | null>(null);
  private shakeTimer: ReturnType<typeof setTimeout> | undefined;

  readonly pending = computed(() => this.slide().items.filter((i) => !this.placed()[i.value]));

  placedIn(bin: string) {
    return Object.entries(this.placed())
      .filter(([, b]) => b === bin)
      .map(([v]) => v);
  }

  binLabel(label: SortSlide['bins'][number]['label']) {
    return pick(label, this.syntax()) ?? '';
  }

  select(value: string) {
    this.selected.update((v) => (v === value ? null : value));
  }

  onDragStart(event: DragEvent, value: string) {
    event.dataTransfer?.setData('text/plain', value);
    this.selected.set(value);
  }

  onDrop(event: DragEvent, bin: string) {
    event.preventDefault();
    const value = event.dataTransfer?.getData('text/plain') || this.selected();
    this.place(bin, value);
  }

  place(binId: string, value = this.selected()) {
    const item = this.slide().items.find((i) => i.value === value);
    if (!item || this.placed()[item.value]) return;
    const ex = this.t().kit.exercise;
    const bin = this.slide().bins.find((b) => b.id === binId);
    if (item.bin !== binId) {
      this.feedback.set({ tone: 'error', text: ex.wrong });
      this.wrongBin.set(binId);
      clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => this.wrongBin.set(null), 600);
      return;
    }
    this.placed.update((p) => ({ ...p, [item.value]: binId }));
    this.selected.set(null);
    const done = this.pending().length === 0;
    this.feedback.set({
      tone: 'ok',
      text: done
        ? ex.done
        : `${ex.correct} ${item.value} ${ex.placedIn} ${bin ? this.binLabel(bin.label) : ''}`,
    });
  }

  reset() {
    this.placed.set({});
    this.selected.set(null);
    this.feedback.set(null);
  }
}
