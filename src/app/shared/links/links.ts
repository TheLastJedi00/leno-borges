import { Component, computed, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { contactInfo, whatsappUrl } from '../../pages/home/home.data';

@Component({
  selector: 'app-links',
  imports: [],
  templateUrl: './links.html',
  styleUrl: './links.css',
})
export class Links {
  readonly t = inject(I18n).t;
  readonly contact = contactInfo;
  readonly whatsapp = computed(() => whatsappUrl(this.t().contact.whatsappMessage));
}
