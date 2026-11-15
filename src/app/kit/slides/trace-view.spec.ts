import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type TraceSlide, stepCount } from '../kit.data';
import { TraceView } from './trace-view';

const slide: TraceSlide = {
  id: 'mesa',
  kind: 'trace',
  depth: 'extra',
  tag: 'Aprofundamento',
  title: 'Teste de mesa',
  notes: ['n'],
  code: ['{k:let} {n:i} = {v:1};', '{k:while} ({n:i} <= {v:2}) {', '  {n:i}++;', '}'].join(String.fromCharCode(10)),
  columns: [{ head: 'Volta' }, { head: '{n:i}', js: 'i' }, { head: '{n:i} <= {v:2}', js: 'i <= 2' }],
  rows: [
    { cells: ['1', '1', 'true'], line: 3 },
    { cells: ['2', '2', 'true'], line: 3 },
    { cells: ['', '3', 'false'], line: { js: 2, ts: 2, java: 2 } },
  ],
  at: 3,
  end: 5,
};

describe('teste de mesa', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  const render = (step: number) => {
    const fixture = TestBed.createComponent(TraceView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    fixture.componentRef.setInput('step', step);
    fixture.detectChanges();
    return fixture;
  };

  it('uma etapa por linha da tabela', () => {
    expect(stepCount(slide)).toBe(3);
  });

  it('revela uma linha por etapa e destaca a nova', () => {
    const el = render(1).nativeElement as HTMLElement;
    const rows = [...el.querySelectorAll('tbody tr')];
    expect(rows.map((r) => r.getAttribute('aria-hidden'))).toEqual(['false', 'false', 'true']);
    expect(rows[1].querySelector('td')!.classList).toContain('kit-trace-new');
  });

  it('acende a linha do código da volta', () => {
    expect(render(0).componentInstance.activeLine()).toBe(3);
    expect(render(2).componentInstance.activeLine()).toBe(2);
  });

  it('true em verde, false em vermelho', () => {
    const el = render(2).nativeElement as HTMLElement;
    const last = [...el.querySelectorAll('tbody tr')][2].querySelectorAll('td');
    expect(last[2].classList).toContain('text-kit-error');
  });
});
