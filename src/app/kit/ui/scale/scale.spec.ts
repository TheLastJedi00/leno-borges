import { scaleTilt } from './scale';

describe('scaleTilt', () => {
  it('pende para o lado do número maior', () => {
    expect(scaleTilt('20', '18')).toBe(-1);
    expect(scaleTilt('3', '7.5')).toBe(1);
    expect(scaleTilt('-1', '-3')).toBe(-1);
  });

  it('fica nivelada na igualdade', () => {
    expect(scaleTilt('18', '18')).toBe(0);
    expect(scaleTilt('2.0', '2')).toBe(0);
  });

  it('texto e valores sem número não pesam', () => {
    expect(scaleTilt('"5"', '5')).toBe(0);
    expect(scaleTilt('"Ana"', '"Bia"')).toBe(0);
    expect(scaleTilt('NaN', '3')).toBe(0);
    expect(scaleTilt('true', '1')).toBe(0);
  });
});
