import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SegmentedOption {
  value: string;
  label: string;
  title?: string;
}

/** Seletor em pílula no mesmo visual do toggle de idioma do header. */
@Component({
  selector: 'kit-segmented',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="group"
      [attr.aria-label]="label()"
      class="inline-flex items-center gap-0.5 rounded-full bg-ink/60 p-1 shadow-inset"
    >
      @for (o of options(); track o.value) {
        <button
          type="button"
          (click)="changed.emit(o.value)"
          [attr.aria-pressed]="value() === o.value"
          [attr.title]="o.title ?? null"
          class="rounded-full px-3 py-1 font-mono text-[11px] font-medium tracking-wider transition-[color,background-color,box-shadow]"
          [class]="
            value() === o.value ? 'bg-raised text-paper shadow-raised' : 'text-faint hover:text-paper'
          "
        >
          {{ o.label }}
        </button>
      }
    </div>
  `,
})
export class Segmented {
  options = input.required<SegmentedOption[]>();
  value = input.required<string>();
  label = input.required<string>();
  changed = output<string>();
}
