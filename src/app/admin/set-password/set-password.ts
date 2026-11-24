import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { adminStrings } from '../admin.strings';
import { Auth } from '../core/auth';

const MIN_LENGTH = 8;

/** Definir ou redefinir a senha, depois de abrir o link de recuperacao ou de convite do e-mail. */
@Component({
  selector: 'app-set-password',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './set-password.html',
})
export class SetPassword {
  readonly auth = inject(Auth);
  private readonly router = inject(Router);
  readonly s = adminStrings.setPassword;

  readonly ready = signal(false);
  readonly password = signal('');
  readonly confirm = signal('');
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.auth.whenReady().then(() => this.ready.set(true));
  }

  async submit() {
    if (this.saving()) return;
    if (this.password().length < MIN_LENGTH) {
      this.error.set(this.s.tooShort);
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set(this.s.mismatch);
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const failure = await this.auth.updatePassword(this.password());
    this.saving.set(false);
    if (failure) {
      this.error.set(failure);
      return;
    }
    await this.router.navigateByUrl('/admin');
  }
}
