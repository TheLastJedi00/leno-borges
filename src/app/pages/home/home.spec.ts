import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  it('o rodape tem o link discreto para a area restrita', () => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('footer a[href="/admin"]');
    expect(link?.textContent?.trim()).toBe('Admin area');
  });
});
