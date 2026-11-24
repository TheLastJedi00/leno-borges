import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { adminStrings } from '../admin.strings';
import { AdHistory } from '../core/ad-history';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly s = adminStrings.dashboard;
  readonly generator = adminStrings.adGenerator;
  readonly total = signal<number | null>(null);

  constructor() {
    inject(AdHistory)
      .count()
      .then((n) => this.total.set(n));
  }
}
