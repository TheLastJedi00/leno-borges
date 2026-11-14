import { chestZoom, flowZoom } from './scene-view';

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
