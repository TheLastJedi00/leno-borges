import { exportName } from './ad-assets';

describe('exportName', () => {
  it('segue <formato>-<rede>-<aaaa-mm-dd>-v<n>[-<slide>].png', () => {
    expect(exportName('post', 'linkedin', '2026-11-23T22:10:00Z', 2)).toBe('post-linkedin-2026-11-23-v2.png');
    expect(exportName('carousel', 'instagram', '2026-11-23T22:10:00Z', 1, 4)).toBe(
      'carousel-instagram-2026-11-23-v1-4.png',
    );
  });
});
