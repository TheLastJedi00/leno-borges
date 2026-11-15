import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { SceneSlide } from '../kit.data';
import { SceneView, chestZoom, flowZoom } from './scene-view';

describe('chestZoom', () => {
  it('um baú não muda de tamanho', () => {
    expect(chestZoom([330])).toBe(1);
  });

  it('dois baús de inteiro encolhem para caber numa linha ao lado do código', () => {
    const z = chestZoom([260, 260]);
    expect(z).toBeLessThan(1);
    expect((260 * 2 + 48) * z).toBeLessThanOrEqual(504);
  });

  it('três baús de texto quebram em duas linhas em vez de ficarem minúsculos', () => {
    const z = chestZoom([330, 330, 330]);
    expect(z).toBeGreaterThan(0.65);
    expect((330 * 2 + 48) * z).toBeLessThanOrEqual(504);
  });
});

describe('flowZoom', () => {
  it('ao lado do código, cabe na largura livre', () => {
    const z = flowZoom([{ width: 700, height: 200 }], true);
    expect(700 * z).toBeLessThanOrEqual(504);
  });

  it('sozinho, cresce até 1,3 mas não passa da altura', () => {
    expect(flowZoom([{ width: 400, height: 200 }], false)).toBe(1.3);
    expect(560 * flowZoom([{ width: 400, height: 560 }], false)).toBeLessThanOrEqual(410);
  });

  it('usa o maior desenho do slide', () => {
    expect(flowZoom([{ width: 300, height: 200 }, { width: 600, height: 200 }], true)).toBe(504 / 600);
  });
});

describe('SceneView com gaveteiro', () => {
  const slide: SceneSlide = {
    id: 'l',
    kind: 'scene',
    depth: 'core',
    title: 't',
    notes: ['n'],
    code: '{k:let} {n:frutas} = [{v:"maçã"}];\n{n:frutas}.{f:push}({v:"uva"});',
    steps: [
      { list: { name: 'frutas', items: [{ id: 'm', value: '"maçã"' }] } },
      { list: { name: 'frutas', items: [{ id: 'm', value: '"maçã"' }, { id: 'u', value: '"uva"' }], focus: 1 } },
      { list: null },
    ],
  };
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));
  const render = (step: number) => {
    const fixture = TestBed.createComponent(SceneView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    fixture.componentRef.setInput('step', step);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra o gaveteiro de cada etapa e o tira com null', () => {
    expect(render(1).querySelectorAll('kit-list .drawer').length).toBe(2);
    expect(render(1).querySelector('kit-list .is-focus .index')!.textContent).toBe('1');
    expect(render(2).querySelector('kit-list')).toBeNull();
  });
});

describe('SceneView com pista do laço', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  it('mostra a pista da etapa', () => {
    const fixture = TestBed.createComponent(SceneView);
    fixture.componentRef.setInput('slide', {
      id: 'w',
      kind: 'scene',
      depth: 'core',
      title: 't',
      notes: ['n'],
      steps: [{ loop: { condition: 'i <= 3', body: ['i++'], laps: 1, answer: true } }],
    } satisfies SceneSlide);
    fixture.componentRef.setInput('syntax', 'js');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('kit-loop .node')!.classList).toContain('is-true');
    expect(fixture.componentInstance.loopZoom()).toBeGreaterThan(0);
  });
});

describe('SceneView com pilha de chamadas', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  const slide: SceneSlide = {
    id: 'f',
    kind: 'scene',
    depth: 'core',
    title: 't',
    notes: ['n'],
    code: '{k:let} {n:r} = {f:dobro}({v:4});',
    steps: [
      { stack: { frames: [{}, { name: 'dobro', vars: [{ name: 'n', value: '4' }] }], returning: '8' } },
      { stack: { frames: [{}] }, chests: [{ id: 'r', label: 'r', item: '8', shape: 'int', open: true }] },
    ],
  };

  it('a sala abre e fecha com o return; com baús, a pilha encolhe', () => {
    const fixture = TestBed.createComponent(SceneView);
    fixture.componentRef.setInput('slide', slide);
    fixture.componentRef.setInput('syntax', 'js');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('kit-stack .frame').length).toBe(2);
    expect(el.querySelector('kit-stack .returning')).not.toBeNull();
    expect(fixture.componentInstance.stackZoom()).toBeLessThanOrEqual(0.8);
    fixture.componentRef.setInput('step', 1);
    fixture.detectChanges();
    expect(el.querySelectorAll('kit-stack .frame').length).toBe(1);
  });
});
