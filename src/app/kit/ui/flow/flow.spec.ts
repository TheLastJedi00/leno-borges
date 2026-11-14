import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type FlowState, flowRoute } from '../../kit.data';
import { Flow, flowLayout } from './flow';

const chain = (answers: boolean[]): FlowState => ({
  conditions: ['nota >= 9', 'nota >= 7', 'nota >= 5'],
  outcomes: ['"A"', '"B"', '"C"', '"Reprovado"'],
  answers,
});

describe('fluxograma', () => {
  it('if sem else: true roda o bloco, false segue sem rodar nada', () => {
    const st = { conditions: ['idade >= 18'], outcomes: ['Pode entrar'] };
    expect(flowRoute({ ...st, answers: [] })).toEqual({ asked: 0, taken: null });
    expect(flowRoute({ ...st, answers: [true] })).toEqual({ asked: 1, taken: 0 });
    expect(flowRoute({ ...st, answers: [false] })).toEqual({ asked: 1, taken: 'none' });
  });

  it('if com else: sempre um dos dois caminhos', () => {
    const st = { conditions: ['idade >= 18'], outcomes: ['Pode entrar', 'Proibido'] };
    expect(flowRoute({ ...st, answers: [false] }).taken).toBe(1);
  });

  it('else if: para no primeiro true e não pergunta as seguintes', () => {
    expect(flowRoute(chain([false, true, true]))).toEqual({ asked: 2, taken: 1 });
    expect(flowRoute(chain([false]))).toEqual({ asked: 1, taken: null });
    expect(flowRoute(chain([false, false, false]))).toEqual({ asked: 3, taken: 3 });
  });

  it('acende o caminho percorrido e apaga o resto', () => {
    const l = flowLayout(chain([false, true]));
    expect(l.nodes.map((n) => n.answer)).toEqual([false, true, undefined]);
    expect(l.nodes.map((n) => n.dim)).toEqual([false, false, true]);
    expect(l.boxes.map((b) => b.taken)).toEqual([false, true, false, false]);
    expect(l.arrows.filter((a) => a.lit).map((a) => a.label)).toEqual([undefined, 'false', 'true']);
    expect(l.end).toBeUndefined();
  });

  it('nada aparece em cima de nada: as saídas ficam à direita dos losangos', () => {
    const l = flowLayout(chain([]));
    for (const n of l.nodes) expect(l.boxes[n.index].x).toBeGreaterThan(n.x + n.w);
    expect(l.boxes[3].y).toBeGreaterThan(l.nodes[2].y + 76);
    expect(l.width).toBeGreaterThan(l.boxes[0].x + l.boxes[0].w);
  });

  it('descreve o caminho para leitor de tela', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Flow);
    fixture.componentRef.setInput('state', chain([false, true]));
    await fixture.whenStable();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('nota >= 9: false; nota >= 7: true → "B"');
    expect(svg.querySelectorAll('.box.is-taken').length).toBe(1);
  });
});
