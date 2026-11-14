import { type TruthSlide, stepCount } from '../kit.data';

describe('tabela-verdade', () => {
  it('uma etapa por linha', () => {
    const slide: TruthSlide = {
      id: 't',
      kind: 'truth',
      depth: 'core',
      title: 't',
      notes: ['n'],
      head: ['{n:a}', '{n:b}', '{n:a} && {n:b}'],
      rows: [
        [true, true, true],
        [true, false, false],
        [false, true, false],
        [false, false, false],
      ],
      results: [2],
    };
    expect(stepCount(slide)).toBe(4);
  });
});
