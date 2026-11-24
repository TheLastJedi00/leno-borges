import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { adminStrings } from '../admin.strings';

const ROBOTS = 'robots';

/** Casca de todas as rotas /admin: fundo da marca, `noindex` e a saida das telas. */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="min-h-screen bg-ink"><router-outlet /></div>`,
})
export class AdminShell {
  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: ROBOTS, content: 'noindex, nofollow' });
    // Ao sair, a home volta com o titulo e a descricao dela (o I18n restaura sozinho)
    inject(I18n).usePageMeta(() => ({ title: adminStrings.title, description: adminStrings.title }));
    inject(DestroyRef).onDestroy(() => meta.removeTag(`name="${ROBOTS}"`));
  }
}
