import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { Header } from './header';

describe('Header', () => {
  beforeEach(() => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('tem o cadeado para a area restrita, rotulado no idioma ativo', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href="/admin"]');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('aria-label')).toBe('Admin area');

    TestBed.inject(I18n).lang.set('pt');
    fixture.detectChanges();
    expect(link?.getAttribute('aria-label')).toBe('Área restrita');
  });
});
