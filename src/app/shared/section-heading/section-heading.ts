import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-heading.html',
})
export class SectionHeading {
  index = input.required<string>();
  title = input.required<string>();
  lead = input<string>();
}
