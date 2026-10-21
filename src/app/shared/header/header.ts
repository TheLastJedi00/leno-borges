import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
})
export class Header {
  readonly t = inject(I18n).t;
  readonly scrolled = signal(false);

  readonly nav = computed(() => {
    const { nav } = this.t().header;
    return [
      { label: nav.about, fragment: 'about' },
      { label: nav.experience, fragment: 'experience' },
      { label: nav.skills, fragment: 'skills' },
      { label: nav.education, fragment: 'education' },
    ];
  });

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 24);
  }
}
