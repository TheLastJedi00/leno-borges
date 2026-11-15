import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type BranchSlide, stepCount } from '../kit.data';
import { codeWithValue } from '../ui/code/code-markup';
import { BranchView } from './branch-view';

const slide: BranchSlide = {
  id: 'b',
  kind: 'branch',
  depth: 'extra',
  tag: 'Exercício',
  title: 'Escolha o valor',
  lead: 'lead',
  notes: ['n'],
  variable: 'idade',
  code: `{k:let} {n:idade} = {v:@@};\n{k:if} ({n:idade} >= {v:18}) {f:console.log}({v:"Entra"});`,
  flow: { conditions: ['idade >= 18'], outcomes: ['"Entra"'] },
  choices: [
    { value: '15', answers: [false], output: '' },
    { value: '20', answers: [true], output: 'Entra' },
  ],
  goals: ['Entra', ''],
};

describe('exercício escolha o valor', () => {
  it('troca @@ pelo valor escolhido', () => {
    expect(codeWithValue('{v:@@} e {v:@@}', '"verde"')).toBe('{v:"verde"} e {v:"verde"}');
  });

  it('tem uma etapa só', () => {
    expect(stepCount(slide)).toBe(1);
  });

  it('escolhe o valor, resolve, avança e reinicia', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(BranchView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    const view = fixture.componentInstance;
    await fixture.whenStable();

    expect(view.output()).toBe('');
    expect(view.solved()).toBeFalse();
    view.nextChallenge();
    expect(view.index()).toBe(0);

    view.choose(1);
    expect(view.flow()?.answers).toEqual([true]);
    expect(view.code()).toContain('{v:20}');
    expect(view.solved()).toBeTrue();
    view.nextChallenge();
    expect(view.index()).toBe(1);
    expect(view.solved()).toBeFalse();

    view.choose(0);
    expect(view.solved()).toBeTrue();
    expect(view.isLast()).toBeTrue();

    view.reset();
    expect(view.index()).toBe(0);
    expect(view.choice()).toBe(0);
  });

  it('botões de valor funcionam por clique (e por teclado, por serem botões)', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(BranchView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('[aria-pressed]')];
    expect(buttons.map((b) => b.textContent!.trim())).toEqual(['15', '20']);
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(el.textContent).toContain('Entra');
  });

  it('com gaveteiro, o valor escolhido é o índice lido', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(BranchView);
    fixture.componentRef.setInput('slide', {
      ...slide,
      variable: 'i',
      code: '{f:console.log}({n:frutas}[{v:@@}]);',
      flow: undefined,
      list: { name: 'frutas', items: [{ id: 'm', value: '"maçã"' }, { id: 'u', value: '"uva"' }] },
      choices: [
        { value: '1', output: 'uva' },
        { value: '2', output: 'undefined' },
      ],
      goals: ['uva'],
    } satisfies BranchSlide);
    fixture.componentRef.setInput('syntax', 'js');
    const view = fixture.componentInstance;
    await fixture.whenStable();
    expect(view.list()?.focus).toBe(1);
    view.choose(1);
    expect(view.list()?.outside).toBe(2);
    expect(view.list()?.focus).toBeUndefined();
    expect(view.listZoom()).toBeLessThanOrEqual(1);
  });

  it('com pista, o laço termina com as voltas do valor escolhido', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(BranchView);
    fixture.componentRef.setInput('slide', {
      ...slide,
      variable: 'inicio',
      code: '{k:for} ({k:let} {n:i} = {v:@@}; {n:i} >= {v:1}; {n:i}--) {f:console.log}({n:i});',
      flow: undefined,
      loop: { condition: 'i >= 1', body: ['console.log(i)'], update: 'i--' },
      choices: [
        { value: '2', output: '2' + String.fromCharCode(10) + '1', laps: 2 },
        { value: '0', output: '', laps: 0 },
      ],
      goals: [''],
    } satisfies BranchSlide);
    fixture.componentRef.setInput('syntax', 'js');
    const view = fixture.componentInstance;
    await fixture.whenStable();
    expect(view.loop()).toEqual(jasmine.objectContaining({ laps: 2, answer: false }));
    view.choose(1);
    expect(view.loop()?.laps).toBe(0);
    expect(view.solved()).toBeTrue();
  });
});
