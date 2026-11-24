import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Auth } from '../core/auth';
import { AdminShell } from './admin-shell';

import { signal } from '@angular/core';

const signedIn = signal(false);
const fakeAuth = {
  signedIn,
  user: () => (signedIn() ? { email: 'dono@exemplo.com' } : null),
  signOut: jasmine.createSpy('signOut').and.resolveTo(),
};

describe('AdminShell', () => {
  it('marca a pagina como noindex e remove a marca ao sair', () => {
    TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: Auth, useValue: fakeAuth },
      ],
    });
    const meta = TestBed.inject(Meta);
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');

    fixture.destroy();
    expect(meta.getTag('name="robots"')).toBeNull();
  });

  it('mostra a barra com o e-mail e o botao Sair so quando ha sessao', () => {
    TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: Auth, useValue: fakeAuth },
      ],
    });
    const fixture = TestBed.createComponent(AdminShell);
    const el = fixture.nativeElement as HTMLElement;
    signedIn.set(false);
    fixture.detectChanges();
    expect(el.querySelector('header')).toBeNull();

    signedIn.set(true);
    fixture.detectChanges();
    expect(el.querySelector('header')?.textContent).toContain('dono@exemplo.com');
    expect(el.querySelector('button')?.textContent?.trim()).toBe('Sair');
  });
});
