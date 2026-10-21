import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { Header } from '../../shared/header/header';
import { Links } from '../../shared/links/links';
import { Owner } from '../../shared/owner/owner';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { SkillGroup } from '../../shared/skill-group/skill-group';
import { EducationItem } from '../../shared/education-item/education-item';
import { type Contact, contactInfo, whatsappUrl } from './home.data';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Header,
    Links,
    Owner,
    SectionHeading,
    ExperienceCard,
    SkillGroup,
    EducationItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  readonly t = inject(I18n).t;
  readonly currentYear = new Date().getFullYear();

  readonly contacts = computed<Contact[]>(() => [
    {
      label: this.t().contact.emailLabel,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      label: 'WhatsApp',
      value: contactInfo.phoneDisplay,
      href: whatsappUrl(this.t().contact.whatsappMessage),
    },
    { label: 'LinkedIn', value: contactInfo.linkedinHandle, href: contactInfo.linkedin },
    { label: 'GitHub', value: contactInfo.githubHandle, href: contactInfo.github },
  ]);
}
