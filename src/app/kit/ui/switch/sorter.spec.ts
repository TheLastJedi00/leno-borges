import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type SorterState, sorterRoute } from '../../kit.data';
import { Sorter, sorterLayout } from './sorter';

const days = (value: string, brk = true): SorterState => ({
  value,
  dropped: true,
  cases: [
    { label: '1', out: '"Domingo"', brk },
    { label: '2', out: '"Segunda"', brk },
    { label: '3', out: '"Terça"', brk },
  ],
  fallback: { out: '"Inválido"' },
});

describe('triagem do switch', () => {
  it('antes de cair, nada roda', () => {
    expect(sorterRoute({ ...days('2'), dropped: false })).toEqual({ landed: null, ran: [] });
  });

  it('cai no case com a etiqueta igual e para no break', () => {
    expect(sorterRoute(days('2'))).toEqual({ landed: 1, ran: [1] });
  });

  it('sem etiqueta igual, cai no default', () => {
    expect(sorterRoute(days('9'))).toEqual({ landed: 3, ran: [3] });
  });

  it('compara como ===: o texto "2" não é o número 2', () => {
    expect(sorterRoute(days('"2"')).landed).toBe(3);
  });

  it('sem break, continua caindo até o fim (fall-through)', () => {
    expect(sorterRoute(days('1', false)).ran).toEqual([0, 1, 2, 3]);
  });

  it('para no primeiro break da queda; etiquetas juntas valem para os dois valores', () => {
    const st: SorterState = {
      value: '7',
      dropped: true,
      cases: [{ label: '1, 7', out: '"Fim de semana"', brk: true }, { label: '2' }],
    };
    expect(sorterRoute(st)).toEqual({ landed: 0, ran: [0] });
    expect(sorterRoute({ ...st, value: '5' })).toEqual({ landed: null, ran: [] });
  });

  it('o item fica no escaninho onde caiu, e passa direto quando não há onde cair', () => {
    const l = sorterLayout(days('3'));
    expect(l.itemY).toBe(l.slots[2].y + 28);
    expect(l.slots.map((s) => s.floor)).toEqual(['break', 'break', 'break', 'none']);
    const miss = sorterLayout({ ...days('9'), fallback: undefined });
    expect(miss.missed).toBeTrue();
    expect(miss.itemY).toBeGreaterThan(miss.slots[2].y + 56);
  });

  it('descreve o que rodou para leitor de tela', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Sorter);
    fixture.componentRef.setInput('state', days('2', false));
    await fixture.whenStable();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe(
      'switch (2): case 2, "Segunda"; case 3, "Terça"; default, "Inválido"',
    );
  });
});
