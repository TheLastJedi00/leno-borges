import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TechIcon } from '../tech-icon/tech-icon';
import { displayUrl } from '../../pages/home/home.data';

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
  techsLabel = input<string>();

  /** Página oficial do sistema; sem valor, o botão não é renderizado. */
  url = input<string>();
  visitLabel = input<string>();
  newTabLabel = input<string>();

  protected readonly urlText = computed(() => {
    const url = this.url();
    return url ? displayUrl(url) : '';
  });
}
