import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { adminStrings } from '../admin.strings';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly s = adminStrings.login;
  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly failed = signal(false);

  async submit() {
    if (this.loading()) return;
    this.loading.set(true);
    this.failed.set(false);
    const ok = await this.auth.signIn(this.email().trim(), this.password());
    this.loading.set(false);
    if (ok) {
      await this.router.navigateByUrl('/admin');
    } else {
      this.failed.set(true);
    }
  }
}
