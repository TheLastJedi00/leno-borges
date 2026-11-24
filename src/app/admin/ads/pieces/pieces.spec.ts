import { provideZonelessChangeDetection, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { AdSlide, Network } from '../ad.types';
import { AdCarouselSlide } from './ad-carousel-slide';
import { AdPost } from './ad-post';
import { AdStory } from './ad-story';

const slide: AdSlide = {
  kicker: 'Kit de Ensino 🚀',
  title: 'Funções — no ar',
  body: 'Nove aulas com Java conferido em um JDK de verdade.',
  cta: 'Veja o kit 👉',
};

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [AdStory, AdPost, AdCarouselSlide],
    providers: [provideZonelessChangeDetection()],
  });
});

function render<T>(cmp: Type<T>, inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(cmp);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const host = fixture.nativeElement as HTMLElement;
  return { host, piece: host.querySelector('.piece') as HTMLElement };
}

const size = (el: HTMLElement) => [el.style.width, el.style.height];

describe('pecas de publicidade', () => {
  for (const network of ['linkedin', 'instagram'] as Network[]) {
    describe(network, () => {
      it('stories mede 1080x1920', () => {
        expect(size(render(AdStory, { slide, network }).piece)).toEqual(['1080px', '1920px']);
      });

      it('post mede 1080x1440', () => {
        expect(size(render(AdPost, { slide, network }).piece)).toEqual(['1080px', '1440px']);
      });

      it('slide de carrossel mede 1080x1080 e mostra o n/N', () => {
        const { piece } = render(AdCarouselSlide, { slide, network, index: 1, total: 5 });
        expect(size(piece)).toEqual(['1080px', '1080px']);
        expect(piece.querySelector('.count')?.textContent?.trim()).toBe('2/5');
      });

      it('nenhuma peca sai com emoji ou travessao', () => {
        for (const piece of [
          render(AdStory, { slide, network }).piece,
          render(AdPost, { slide, network }).piece,
          render(AdCarouselSlide, { slide, network, index: 0, total: 3 }).piece,
        ]) {
          expect(piece.textContent).not.toMatch(/[—–]|\p{Extended_Pictographic}/u);
          expect(piece.textContent).toContain('Funções, no ar');
        }
      });

      it('com fundo, a imagem vai atras de um veu', () => {
        const { piece } = render(AdPost, { slide, network, background: 'data:image/png;base64,AA==' });
        expect(piece.querySelector('img.bg-img')?.getAttribute('src')).toBe('data:image/png;base64,AA==');
        expect(piece.querySelector('.veil')).toBeTruthy();
      });
    });
  }

  it('LinkedIn: a barra de progresso acompanha o slide', () => {
    const { piece } = render(AdCarouselSlide, { slide, network: 'linkedin', index: 1, total: 4 });
    const fill = piece.querySelector('.content[style*="height: 6px"] > div') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('Instagram: as formas ficam nas bordas entre slides e casam de um slide para o outro', () => {
    const circlesOf = (index: number) =>
      Array.from(
        render(AdCarouselSlide, { slide, network: 'instagram', index, total: 3 }).piece.querySelectorAll<HTMLElement>('.field'),
      ).map((el) => ({ left: parseFloat(el.style.left), top: parseFloat(el.style.top) }));

    const first = circlesOf(0);
    const middle = circlesOf(1);
    const last = circlesOf(2);
    expect(first.length).toBe(1);
    expect(middle.length).toBe(2);
    expect(last.length).toBe(1);
    // A forma da direita do slide 1 e a mesma da esquerda do slide 2, deslocada 1080 px
    expect(first[0].left - 1080).toBe(middle[0].left);
    expect(first[0].top).toBe(middle[0].top);
    expect(middle[1].left - 1080).toBe(last[0].left);
  });

  it('LinkedIn nao usa formas azuis no carrossel', () => {
    const { piece } = render(AdCarouselSlide, { slide, network: 'linkedin', index: 1, total: 3 });
    expect(piece.querySelectorAll('.field').length).toBe(0);
  });
});
