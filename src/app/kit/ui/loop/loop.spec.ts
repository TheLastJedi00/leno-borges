import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { LoopState } from '../../kit.data';
import { Loop, loopLayout } from './loop';

const count = (laps: number, answer: boolean | null): LoopState => ({
  condition: 'i <= 3',
  body: ['console.log(i)'],
  update: 'i++',
  init: 'let i = 1',
  laps,
  answer,
});

describe('pista do laço', () => {
  it('antes da primeira pergunta, nada acende', () => {
    expect(loopLayout(count(0, null)).arrows.some((a) => a.lit)).toBeFalse();
  });

  it('true entra na volta; false sai pela seta de saída', () => {
    const inside = loopLayout(count(0, true));
    expect(inside.arrows.find((a) => a.label === 'true')!.lit).toBeTrue();
    expect(inside.end.lit).toBeFalse();
    const out = loopLayout(count(3, false));
    expect(out.arrows.find((a) => a.label === 'false')!.lit).toBeTrue();
    expect(out.end.lit).toBeTrue();
    expect(out.arrows.find((a) => a.label === 'true')!.lit).toBeFalse();
  });

  it('a seta que volta acende depois da primeira volta', () => {
    const back = (st: LoopState) => loopLayout(st).arrows.find((a) => !a.label && a.points.length > 2)!;
    expect(back(count(0, true)).lit).toBeFalse();
    expect(back(count(1, true)).lit).toBeTrue();
  });

  it('no for, o começo fica antes da pista e o passo no fim do corpo', () => {
    const l = loopLayout(count(0, null));
    expect(l.init!.y).toBeLessThan(l.cond.y);
    expect(l.body.lines.at(-1)).toEqual(jasmine.objectContaining({ text: 'i++', update: true }));
  });

  it('no do...while, o corpo vem antes da condição', () => {
    const l = loopLayout({ ...count(0, null), kind: 'do', init: undefined });
    expect(l.body.y).toBeLessThan(l.cond.y);
    expect(l.end.y).toBeGreaterThan(l.cond.y);
  });
});

describe('Loop (componente)', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  const render = (state: LoopState) => {
    const fixture = TestBed.createComponent(Loop);
    fixture.componentRef.setInput('state', state);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra a condição, o placar e a resposta', () => {
    const el = render(count(2, true));
    expect(el.querySelector('.cond')!.textContent!.trim()).toBe('i <= 3');
    expect(el.querySelector('.badge text')!.textContent!.trim()).toMatch(/: 2$/);
    expect(el.querySelector('.node')!.classList).toContain('is-true');
    expect(el.querySelector('.body')!.classList).toContain('is-taken');
    expect(el.querySelector('[role="img"]')!.getAttribute('aria-label')).toContain('i <= 3: true');
  });

  it('do...while: o corpo roda antes da primeira pergunta', () => {
    const el = render({ ...count(0, null), kind: 'do' });
    expect(el.querySelector('.body')!.classList).toContain('is-taken');
  });
});
