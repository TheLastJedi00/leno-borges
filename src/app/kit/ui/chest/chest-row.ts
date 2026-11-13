import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ChestState, Syntax } from '../../kit.data';
import { Chest } from './chest';

/** Fileira de baús; cada baú mantém a identidade pelo `id` e anima só o que mudou. */
@Component({
  selector: 'kit-chest-row',
  imports: [Chest],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap items-end justify-center gap-x-12 gap-y-10' },
  template: `
    @for (c of chests(); track c.id) {
      <kit-chest animate.enter="kit-rise" [state]="c" [syntax]="syntax()"></kit-chest>
    }
  `,
})
export class ChestRow {
  chests = input.required<ChestState[]>();
  syntax = input.required<Syntax>();
}
