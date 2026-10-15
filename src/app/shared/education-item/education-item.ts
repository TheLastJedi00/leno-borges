import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-education-item',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education-item.html',
})
export class EducationItem {
  title = input.required<string>();
  institution = input.required<string>();
  period = input.required<string>();
  modules = input<{ name: string; hours: string; description: string }[]>();
}
