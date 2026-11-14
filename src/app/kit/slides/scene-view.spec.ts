import { chestZoom } from './scene-view';

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
