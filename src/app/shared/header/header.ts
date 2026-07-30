import { Component } from '@angular/core';
import { Logo } from "../logo/logo";

@Component({
  selector: 'app-header',
  imports: [Logo],
  template: `
    <header class="h-header fixed bg-black/40 w-full backdrop-blur-[2px]">
        <app-logo></app-logo>
    </header>
  `
})
export class Header {

}
