import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Auth } from '../core/auth';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let signIn: jasmine.Spy;

  function setup(result: boolean) {
    signIn = jasmine.createSpy('signIn').and.resolveTo(result);
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideZonelessChangeDetection(), provideRouter([]), { provide: Auth, useValue: { signIn } }],
    });
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
  }

  async function submitWith(email: string, password: string) {
    fixture.componentInstance.email.set(email);
    fixture.componentInstance.password.set(password);
    await fixture.componentInstance.submit();
    fixture.detectChanges();
  }

  it('erro de credencial mostra uma mensagem generica', async () => {
    setup(false);
    await submitWith('dono@exemplo.com', 'errada');
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role=alert]');
    expect(alert?.textContent?.trim()).toBe('E-mail ou senha inválidos.');
  });

  it('entrou: vai para o dashboard', async () => {
    setup(true);
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    await submitWith(' dono@exemplo.com ', 'certa');
    expect(signIn).toHaveBeenCalledWith('dono@exemplo.com', 'certa');
    expect(navigate).toHaveBeenCalledWith('/admin');
  });

  it('botao fica desligado enquanto faltar e-mail ou senha', () => {
    setup(true);
    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });
});
