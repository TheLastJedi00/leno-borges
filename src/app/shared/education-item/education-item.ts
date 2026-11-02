import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PartnerLinks } from '../partner-links/partner-links';
import type { Partner } from '../../pages/home/home.data';

@Component({
  selector: 'app-education-item',
  imports: [PartnerLinks],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education-item.html',
})
export class EducationItem {
  title = input.required<string>();
  institution = input.required<string>();
  period = input.required<string>();
  modules = input<{ name: string; hours: string; description: string }[]>();

  /** Parceiros da formação; sem valor, a linha de parceria não é renderizada. */
  partners = input<Partner[]>();
  partnerLabel = input<string>();
  linkedinLabel = input<string>();
  newTabLabel = input<string>();
}
