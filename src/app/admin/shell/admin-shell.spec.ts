import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  it('marca a pagina como noindex e remove a marca ao sair', () => {
    TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
    const meta = TestBed.inject(Meta);
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');

    fixture.destroy();
    expect(meta.getTag('name="robots"')).toBeNull();
  });
});
