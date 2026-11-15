import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ListState } from '../../kit.data';
import { List, listLayout } from './list';

const fruits = (...values: string[]): ListState => ({
  name: 'frutas',
  items: values.map((v) => ({ id: v, value: `"${v}"` })),
});

describe('gaveteiro da lista', () => {
  it('o índice é a posição da gaveta, a partir do 0', () => {
    const l = listLayout(fruits('maçã', 'uva', 'pera'));
    expect(l.slots.map((s) => s.index)).toEqual([0, 1, 2]);
    expect(l.slots[1].x).toBeGreaterThan(l.slots[0].x);
  });

  it('remover a primeira gaveta renumera as de depois, mantendo os ids', () => {
    const before = listLayout(fruits('maçã', 'uva', 'pera'));
    const after = listLayout(fruits('uva', 'pera'));
    expect(after.slots.find((s) => s.id === 'uva')!.index).toBe(0);
    expect(after.slots.find((s) => s.id === 'uva')!.x).toBe(before.slots[0].x);
    expect(after.cabinetW).toBeLessThan(before.cabinetW);
  });

  it('inserir no meio empurra as de depois uma casa', () => {
    const st = fruits('maçã', 'kiwi', 'uva');
    expect(listLayout(st).slots.find((s) => s.id === 'uva')!.index).toBe(2);
  });

  it('gaveta em destaque pelo índice', () => {
    const l = listLayout({ ...fruits('maçã', 'uva'), focus: 1 });
    expect(l.slots.map((s) => s.focus)).toEqual([false, true]);
  });

  it('índice fora da lista vira gaveta fantasma depois do gaveteiro', () => {
    const next = listLayout({ ...fruits('maçã', 'uva', 'pera'), outside: 3 });
    expect(next.ghost).toEqual(jasmine.objectContaining({ index: 3, skipped: false }));
    expect(next.ghost!.x).toBeGreaterThan(next.cabinetW);
    const far = listLayout({ ...fruits('maçã', 'uva', 'pera'), outside: 10 });
    expect(far.ghost!.skipped).toBeTrue();
    expect(far.width).toBeGreaterThan(next.width);
    expect(listLayout({ ...fruits('maçã'), outside: 0 }).ghost).toBeNull();
  });

  it('lista vazia ainda desenha o gaveteiro', () => {
    expect(listLayout(fruits()).cabinetW).toBeGreaterThan(0);
  });
});

describe('List (componente)', () => {
  const render = (state: ListState) => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(List);
    fixture.componentRef.setInput('state', state);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra o nome, as gavetas e os índices', () => {
    const el = render(fruits('maçã', 'uva'));
    expect(el.querySelector('.tag')!.textContent).toBe('frutas');
    expect([...el.querySelectorAll('.drawer .value')].map((v) => v.textContent)).toEqual(['"maçã"', '"uva"']);
    expect([...el.querySelectorAll('.drawer .index')].map((v) => v.textContent)).toEqual(['0', '1']);
  });

  it('leitor de tela descreve gavetas e o índice fora da lista', () => {
    const el = render({ ...fruits('maçã'), outside: 5 });
    const label = el.querySelector('[role="img"]')!.getAttribute('aria-label')!;
    expect(label).toContain('frutas: 0 "maçã"');
    expect(label).toContain('frutas[5]');
    expect(el.querySelector('.is-ghost .index')!.textContent).toBe('5');
  });

  it('array do Java: gaveteiro parafusado', () => {
    const el = render({ ...fruits('maçã'), fixed: true });
    expect(el.querySelector('.list')!.classList).toContain('is-fixed');
    expect(el.querySelectorAll('.bolt').length).toBe(4);
  });
});
