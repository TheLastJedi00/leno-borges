import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { StackState } from '../../kit.data';
import { Stack, stackSize } from './stack';

const call: StackState = {
  frames: [{ name: 'main' }, { name: 'dobro', vars: [{ name: 'n', value: '4' }] }],
};

describe('pilha de chamadas (tamanho)', () => {
  it('cresce com as salas e com a etiqueta do return', () => {
    const one = stackSize({ frames: [{ name: 'main' }] });
    const two = stackSize(call);
    expect(two.height).toBeGreaterThan(one.height);
    expect(stackSize({ ...call, returning: '8' }).width).toBeGreaterThan(two.width);
  });
});

describe('Stack (componente)', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  const render = (state: StackState) => {
    const fixture = TestBed.createComponent(Stack);
    fixture.componentRef.setInput('state', state);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('salas de baixo para cima, com a do topo acesa e os baús em miniatura', () => {
    const el = render(call);
    const frames = el.querySelectorAll('.frame');
    expect(frames.length).toBe(2);
    expect(frames[0].querySelector('.name')!.textContent!.trim()).toBe('main');
    expect(frames[1].classList).toContain('is-top');
    expect(frames[0].classList).not.toContain('is-top');
    expect(frames[1].querySelector('.var-name')!.textContent).toBe('n');
    expect(frames[1].querySelector('.var-value')!.textContent).toBe('4');
  });

  it('sala sem nome é o arquivo (JS/TS)', () => {
    const el = render({ frames: [{}] });
    expect(el.querySelector('.frame')!.classList).toContain('is-file');
    expect(el.querySelector('.name')!.textContent!.trim()).toBeTruthy();
  });

  it('etiqueta do return na sala do topo e rótulo para leitor de tela', () => {
    const el = render({ ...call, returning: '8' });
    expect(el.querySelectorAll('.returning').length).toBe(1);
    expect(el.querySelector('.frame.is-top .returning')!.textContent).toContain('8');
    const label = el.querySelector('[role="img"]')!.getAttribute('aria-label')!;
    expect(label).toContain('main, dobro (n = 4)');
    expect(label).toMatch(/8$/);
  });
});
