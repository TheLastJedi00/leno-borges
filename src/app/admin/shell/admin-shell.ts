import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { adminStrings } from '../admin.strings';
import { Auth } from '../core/auth';

const ROBOTS = 'robots';

/** Casca de todas as rotas /admin: fundo da marca, `noindex`, barra (logada) e a saida das telas. */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  private readonly router = inject(Router);
  readonly auth = inject(Auth);
  readonly s = adminStrings;

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: ROBOTS, content: 'noindex, nofollow' });
    // Ao sair, a home volta com o titulo e a descricao dela (o I18n restaura sozinho)
    inject(I18n).usePageMeta(() => ({ title: adminStrings.title, description: adminStrings.title }));
    inject(DestroyRef).onDestroy(() => meta.removeTag(`name="${ROBOTS}"`));
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}
