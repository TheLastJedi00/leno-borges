import { Component, input } from '@angular/core';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-card',
  imports: [Icons],
  template: `
    <div class="card grid border-gradient w-[250px] h-full">
      <app-icons [icon]="icon()" class="text-blue h-fit"></app-icons>
      <div class="grid">
        <h4 class="text-blue font-semibold text-lg">{{ title() }}</h4>
        <p class="text-black/80">
          {{ description() }}
        </p>
      </div>
    </div>
  `,
  styles: `
    .card {
      padding: 1em;
      border-radius: 1rem;
      display: grid;
      gap: 0.5rem;
    }

    .scrollable-card {
      flex: 0 0 250px;
      min-width: 250px;
    }
  `,
})
export class Card {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
