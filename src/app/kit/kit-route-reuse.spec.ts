import type { ActivatedRouteSnapshot, Route } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { KitRouteReuseStrategy } from './kit-route-reuse';
import { type Track, nextLesson } from './kit.data';

function snap(routeConfig: Route | null, params: Record<string, string>): ActivatedRouteSnapshot {
  return { routeConfig, paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;
}

describe('KitRouteReuseStrategy', () => {
  const strategy = new KitRouteReuseStrategy();
  const player: Route = { path: 'kit/:trilha/:aula/:slide' };
  const lesson1 = { trilha: 'logica', aula: 'a1' };

  it('reaproveita ao trocar só o slide', () => {
    expect(
      strategy.shouldReuseRoute(snap(player, { ...lesson1, slide: '3' }), snap(player, { ...lesson1, slide: '2' })),
    ).toBeTrue();
  });

  it('recria ao trocar de aula', () => {
    expect(
      strategy.shouldReuseRoute(
        snap(player, { trilha: 'logica', aula: 'a2', slide: '1' }),
        snap(player, { ...lesson1, slide: '9' }),
      ),
    ).toBeFalse();
  });

  it('não reaproveita rotas diferentes', () => {
    expect(strategy.shouldReuseRoute(snap({ path: 'kit' }, {}), snap(player, lesson1))).toBeFalse();
  });

  it('rotas sem parâmetros seguem o padrão do Angular', () => {
    const home: Route = { path: '' };
    expect(strategy.shouldReuseRoute(snap(home, {}), snap(home, {}))).toBeTrue();
  });
});

describe('nextLesson', () => {
  const load = async () => ({ slides: [] });
  const list = [
    {
      slug: 'logica-de-programacao',
      lessons: [
        { slug: 'variaveis-e-tipos', syntaxes: ['js'], counts: { essencial: 1, completo: 1 }, load },
        { slug: 'operadores-aritmeticos', syntaxes: ['js'], counts: { essencial: 1, completo: 1 }, load },
      ],
    },
  ] as unknown as Track[];

  it('devolve a aula seguinte da trilha', () => {
    expect(nextLesson('logica-de-programacao', 'variaveis-e-tipos', list)?.slug).toBe(
      'operadores-aritmeticos' as never,
    );
  });

  it('última aula, aula ou trilha desconhecida: sem próxima', () => {
    expect(nextLesson('logica-de-programacao', 'operadores-aritmeticos', list)).toBeUndefined();
    expect(nextLesson('logica-de-programacao', 'x', list)).toBeUndefined();
    expect(nextLesson('x', 'variaveis-e-tipos', list)).toBeUndefined();
  });
});
