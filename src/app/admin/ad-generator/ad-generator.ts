import { ChangeDetectionStrategy, Component } from '@angular/core';
import { adminStrings } from '../admin.strings';

@Component({
  selector: 'app-ad-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="mx-auto max-w-6xl px-4 py-16 sm:px-8">
    <h1 class="font-display text-3xl font-semibold text-paper">{{ s.heading }}</h1>
  </main>`,
})
export class AdGenerator {
  readonly s = adminStrings.adGenerator;
}
