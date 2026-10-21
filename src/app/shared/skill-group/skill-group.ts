import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TechIcon } from '../tech-icon/tech-icon';

@Component({
  selector: 'app-skill-group',
  imports: [TechIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skill-group.html',
})
export class SkillGroup {
  category = input.required<string>();
  skills = input.required<string[]>();
}
