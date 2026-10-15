import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Owner } from '../../shared/owner/owner';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { experiences, metrics, summary, summaryExtra } from './home.data';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Owner, SectionHeading, ExperienceCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  readonly currentYear = new Date().getFullYear();
  readonly summary = summary;
  readonly summaryExtra = summaryExtra;
  readonly metrics = metrics;
  readonly experiences = experiences;
}
