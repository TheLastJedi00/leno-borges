import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { CircuitSlide } from '../kit.data';
import { CircuitView, challengeSolved } from './circuit-view';

const slide: CircuitSlide = {
  id: 'c',
  kind: 'circuit',
  depth: 'extra',
  tag: 'Exercício',
  title: 'Acenda a lâmpada',
  lead: 'lead',
  notes: ['n'],
  challenges: [
    { mode: 'and', start: [true, false], goal: true },
    { mode: 'not', start: [true], goal: true },
  ],
};

describe('exercício de circuito', () => {
  it('resolvido quando a lâmpada fica como o objetivo pede', () => {
    expect(challengeSolved({ mode: 'and', switches: [true, true] }, true)).toBeTrue();
    expect(challengeSolved({ mode: 'or', switches: [false, false] }, false)).toBeTrue();
    expect(challengeSolved({ mode: 'not', switches: [false] }, false)).toBeFalse();
  });

  it('liga o interruptor, avança de desafio e reinicia', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(CircuitView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    const view = fixture.componentInstance;

    expect(view.solved()).toBeFalse();
    view.nextChallenge();
    expect(view.index()).toBe(0);

    view.toggle(1);
    expect(view.solved()).toBeTrue();
    view.nextChallenge();
    expect(view.index()).toBe(1);
    expect(view.state().switches).toEqual([true]);

    view.toggle(0);
    expect(view.solved()).toBeTrue();
    expect(view.isLast()).toBeTrue();

    view.reset();
    expect(view.index()).toBe(0);
    expect(view.state().switches).toEqual([true, false]);
  });
});
