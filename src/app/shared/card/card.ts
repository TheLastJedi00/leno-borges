import { Component, inject, input, output } from '@angular/core';
import { Icons } from '../icons/icons';
import { Styles } from '../../core/services/styles';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [Icons, NgClass],
  template: `
    <div
      [style.backgroundImage]="isTransparent()"
      class="card flex flex-col gap-5 border-gradient w-[250px] h-full"
    >
      <app-icons [icon]="icon()" class="text-blue h-fit"></app-icons>
      <div class="grid gap-2">
        <h4 class="text-blue font-semibold text-lg">{{ title() }}</h4>
        <p [innerHTML]="description()" [ngClass]="transparent() ? 'text-white/80' : 'text-black/80'"></p>
        @if (buttonText() !== null) {
          <button>{{buttonText()}}</button>
        }
      </div>
    </div>
  `,
  styles: `
    .card {
      padding: 1em;
      border-radius: 1rem;
    }

    .scrollable-card {
      flex: 0 0 250px;
      min-width: 250px;
    }

    .border-gradient {
      border: 3px solid transparent;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
    }
  `,
})
export class Card {
  stylesService = inject(Styles);
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  transparent = input<boolean>(false);
  buttonText = input<string | null>(null);
  click = output();

  onClick() {
    this.click.emit();
  }

  isTransparent() {
    const LAYER = `linear-gradient(to right, ${this.stylesService.green}, ${this.stylesService.blue})`;
    if (this.transparent()) {
      return `
        linear-gradient(#00000098, #00000098),
        ${LAYER}
        `;
    }
    return `
      linear-gradient(#FFF, #FFF),
      ${LAYER}`;
  }
}
