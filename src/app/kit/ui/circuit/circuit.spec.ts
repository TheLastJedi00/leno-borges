import { circuitExpression, lampOn } from '../../kit.data';

describe('circuito', () => {
  it('série (&&): acende só com os dois ligados', () => {
    expect(lampOn('and', [true, true])).toBeTrue();
    expect(lampOn('and', [true, false])).toBeFalse();
    expect(lampOn('and', [false, true])).toBeFalse();
    expect(lampOn('and', [false, false])).toBeFalse();
  });

  it('paralelo (||): acende com qualquer um ligado', () => {
    expect(lampOn('or', [true, false])).toBeTrue();
    expect(lampOn('or', [false, true])).toBeTrue();
    expect(lampOn('or', [false, false])).toBeFalse();
  });

  it('inversor (!): acende com o interruptor desligado', () => {
    expect(lampOn('not', [false])).toBeTrue();
    expect(lampOn('not', [true])).toBeFalse();
  });

  it('expressão com as etiquetas', () => {
    expect(circuitExpression('and', ['maior', 'temIngresso'])).toBe('maior && temIngresso');
    expect(circuitExpression('or')).toBe('a || b');
    expect(circuitExpression('not', ['logado'])).toBe('!logado');
  });
});
