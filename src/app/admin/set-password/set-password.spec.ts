import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Auth } from '../core/auth';
import { SetPassword } from './set-password';

describe('SetPassword', () => {
  let fixture: ComponentFixture<SetPassword>;
  let updatePassword: jasmine.Spy;
  const signedIn = signal(true);
  const linkError = signal<string | null>(null);

  function setup() {
    updatePassword = jasmine.createSpy('updatePassword').and.resolveTo(null);
    TestBed.configureTestingModule({
      imports: [SetPassword],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: Auth,
          useValue: { signedIn, linkError, updatePassword, whenReady: () => Promise.resolve() },
        },
      ],
    });
    fixture = TestBed.createComponent(SetPassword);
    fixture.detectChanges();
  }

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    signedIn.set(true);
    linkError.set(null);
  });

  it('senhas diferentes nao sao enviadas', async () => {
    setup();
    const c = fixture.componentInstance;
    c.password.set('senha-forte-1');
    c.confirm.set('senha-forte-2');
    await c.submit();
    fixture.detectChanges();
    expect(updatePassword).not.toHaveBeenCalled();
    expect(el().querySelector('[role=alert]')?.textContent?.trim()).toBe('As senhas não conferem.');
  });

  it('senha curta nao e enviada', async () => {
    setup();
    const c = fixture.componentInstance;
    c.password.set('curta');
    c.confirm.set('curta');
    await c.submit();
    expect(updatePassword).not.toHaveBeenCalled();
    expect(c.error()).toBe('Use pelo menos 8 caracteres.');
  });

  it('salvou: vai para o painel', async () => {
    setup();
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const c = fixture.componentInstance;
    c.password.set('senha-forte-1');
    c.confirm.set('senha-forte-1');
    await c.submit();
    expect(updatePassword).toHaveBeenCalledWith('senha-forte-1');
    expect(navigate).toHaveBeenCalledWith('/admin');
  });

  it('erro do Supabase aparece na tela', async () => {
    setup();
    updatePassword.and.resolveTo('A senha nova precisa ser diferente da atual.');
    const c = fixture.componentInstance;
    c.password.set('senha-forte-1');
    c.confirm.set('senha-forte-1');
    await c.submit();
    expect(c.error()).toBe('A senha nova precisa ser diferente da atual.');
  });

  it('sem sessao do link: explica e nao mostra o formulario', async () => {
    signedIn.set(false);
    linkError.set('O link expirou ou já foi usado. Peça um novo no painel do Supabase.');
    setup();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el().querySelector('form')).toBeNull();
    expect(el().textContent).toContain('O link expirou ou já foi usado.');
  });
});
