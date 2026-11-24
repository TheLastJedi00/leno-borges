import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type CanActivateFn, Router, UrlTree, provideRouter } from '@angular/router';
import { adminGuard, guestGuard } from './admin.guard';
import { Auth } from './auth';

function run(guard: CanActivateFn, signedIn: boolean, delayMs = 0, needsPassword = false, linkError: string | null = null) {
  const signedInSignal = signal(signedIn);
  const fakeAuth = {
    signedIn: signedInSignal,
    needsPassword: signal(needsPassword),
    linkError: signal(linkError),
    whenReady: () => new Promise<void>((resolve) => setTimeout(resolve, delayMs)),
  };
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), provideRouter([]), { provide: Auth, useValue: fakeAuth }],
  });
  return TestBed.runInInjectionContext(() => guard({} as never, {} as never)) as Promise<boolean | UrlTree>;
}

describe('guards da area restrita', () => {
  it('adminGuard deixa passar com sessao', async () => {
    expect(await run(adminGuard, true)).toBeTrue();
  });

  it('adminGuard manda para o login sem sessao', async () => {
    const result = await run(adminGuard, false);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/login');
  });

  it('adminGuard espera a sessao carregar antes de decidir', async () => {
    let settled = false;
    const pending = run(adminGuard, true, 30).then((r) => {
      settled = true;
      return r;
    });
    expect(settled).toBeFalse();
    expect(await pending).toBeTrue();
  });

  it('guestGuard deixa ver o login sem sessao', async () => {
    expect(await run(guestGuard, false)).toBeTrue();
  });

  it('guestGuard manda quem ja entrou para o dashboard', async () => {
    const result = await run(guestGuard, true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin');
  });

  it('adminGuard manda para definir a senha quando o link e de recuperacao ou convite', async () => {
    const result = await run(adminGuard, true, 0, true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/redefinir-senha');
  });

  it('guestGuard tambem manda para definir a senha', async () => {
    const result = await run(guestGuard, true, 0, true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/redefinir-senha');
  });

  it('adminGuard leva o link expirado para a tela que explica, nao para o login', async () => {
    const result = await run(adminGuard, false, 0, false, 'O link expirou.');
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/redefinir-senha');
  });
});
