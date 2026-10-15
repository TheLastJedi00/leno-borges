import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skill-group',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skill-group.html',
})
export class SkillGroup {
  category = input.required<string>();
  skills = input.required<string[]>();
}
