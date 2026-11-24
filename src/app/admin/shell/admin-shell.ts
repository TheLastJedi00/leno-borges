import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Casca de todas as rotas /admin: fundo da marca e a saida das telas. */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="min-h-screen bg-ink"><router-outlet /></div>`,
})
export class AdminShell {}
