import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { techIcons } from './tech-icons';

/** Chip de tecnologia: logo monocromática (cor da marca no hover) + nome. Conceitos sem logo ficam só com texto. */
@Component({
  selector: 'app-tech-icon',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tech-icon.html',
})
export class TechIcon {
  name = input.required<string>();
  size = input<'sm' | 'md'>('sm');

  readonly icon = computed(() => techIcons[this.name()]);
}
