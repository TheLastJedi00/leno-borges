import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-experience-card',
  imports: [],
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.css',
})
export class ExperienceCard {
  title = input.required<string>();
  subtitle = input.required<string>();
  paths = input.required<{path: string, description: string}[]>();
}
