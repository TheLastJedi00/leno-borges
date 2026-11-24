import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdHistory } from '../core/ad-history';
import { Dashboard } from './dashboard';

async function render(count: number | null) {
  TestBed.configureTestingModule({
    imports: [Dashboard],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: AdHistory, useValue: { count: () => Promise.resolve(count) } },
    ],
  });
  const fixture = TestBed.createComponent(Dashboard);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('Dashboard', () => {
  it('card do gerador leva a /admin/publicidade e mostra o total', async () => {
    const el = await render(3);
    const link = el.querySelector('a[href="/admin/publicidade"]');
    expect(link?.textContent).toContain('Gerador de publicidade');
    expect(link?.textContent).toContain('3 gerações');
  });

  it('se a consulta falhar, o card continua sem o numero', async () => {
    const el = await render(null);
    expect(el.querySelector('a[href="/admin/publicidade"]')?.textContent).not.toContain('geraç');
  });

  it('tem o card apagado reservado para os modulos do CRM', async () => {
    const el = await render(0);
    expect(el.textContent).toContain('Em breve');
  });
});
