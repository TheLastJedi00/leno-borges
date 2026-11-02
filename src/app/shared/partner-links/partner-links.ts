import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Partner } from '../../pages/home/home.data';

/** Linha "Parceria · Nome ↗" com link para o LinkedIn de cada parceiro. Sem parceiros, não renderiza nada. */
@Component({
  selector: 'app-partner-links',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partner-links.html',
})
export class PartnerLinks {
  partners = input<Partner[]>();
  label = input<string>();
  linkedinLabel = input<string>();
  newTabLabel = input<string>();
}
