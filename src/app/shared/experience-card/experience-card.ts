import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TechIcon } from '../tech-icon/tech-icon';

@Component({
  selector: 'app-experience-card',
  imports: [TechIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.css',
})
export class ExperienceCard {
  title = input.required<string>();
  subtitle = input.required<string>();
  paths = input.required<{ path: string; description: string }[]>();

  role = input<string>();
  period = input<string>();
  location = input<string>();
  badge = input<string>();
  techs = input<string[]>();
}
