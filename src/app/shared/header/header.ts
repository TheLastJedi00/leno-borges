import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
})
export class Header {
  readonly scrolled = signal(false);

  readonly nav = [
    { label: 'Sobre', fragment: 'sobre' },
    { label: 'Experiência', fragment: 'experiencia' },
    { label: 'Competências', fragment: 'competencias' },
    { label: 'Formação', fragment: 'formacao' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 24);
  }
}
