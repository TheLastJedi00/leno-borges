import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AdSlide, Network } from '../ad.types';
import { cleanPieceText, titleSize, type TitleSteps } from './piece-text';

/**
 * Instagram: um horizonte azul inclinado na base, continuo entre os slides. A altura na borda
 * `k` (entre os slides k-1 e k) alterna, entao a borda direita de um slide casa com a esquerda
 * do proximo e o deslize desenha uma linha so.
 */
export const horizonY = (border: number) => (border % 2 === 0 ? 900 : 800);

const STEPS: Record<Network, { cover: TitleSteps; inner: TitleSteps }> = {
  linkedin: {
    cover: [
      { chars: 24, size: 124 },
      { chars: 40, size: 104 },
      { chars: 60, size: 90 },
      { chars: 999, size: 78 },
    ],
    inner: [
      { chars: 28, size: 88 },
      { chars: 48, size: 76 },
      { chars: 999, size: 66 },
    ],
  },
  instagram: {
    cover: [
      { chars: 16, size: 176 },
      { chars: 28, size: 148 },
      { chars: 44, size: 124 },
      { chars: 999, size: 104 },
    ],
    inner: [
      { chars: 24, size: 120 },
      { chars: 40, size: 100 },
      { chars: 999, size: 86 },
    ],
  },
};

/**
 * Slide de carrossel 1:1 (1080x1080). Capa com o gancho em escala maxima, meio numa grade fixa
 * (mesma margem e mesma linha de base) e o ultimo com o CTA.
 *  - LinkedIn: barra de progresso fina embaixo, com o n/N.
 *  - Instagram: horizonte azul inclinado na base, continuo de um slide para o outro.
 */
@Component({
  selector: 'app-ad-carousel-slide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './piece.css',
  template: `
    <div class="piece" [attr.data-network]="network()" style="width: 1080px; height: 1080px">
      @if (background(); as bg) {
        <img class="bg-img" [src]="bg" alt="" />
        <div class="veil"></div>
      }
      @if (horizon(); as h) {
        <svg
          class="field horizon"
          style="inset: 0; background: none"
          width="1080"
          height="1080"
          viewBox="0 0 1080 1080"
          [attr.data-left]="h.left"
          [attr.data-right]="h.right"
          aria-hidden="true"
        >
          <polygon [attr.points]="'0,' + h.left + ' 1080,' + h.right + ' 1080,1080 0,1080'" fill="#2563d9" />
        </svg>
      }
      <img class="logo" style="top: 88px" src="images/logo.svg" alt="" />

      <div class="content" style="left: 96px; right: 96px; top: 230px">
        @if (text().kicker) {
          <p class="kicker">{{ text().kicker }}</p>
        }
        <h2 class="title" [style.font-size.px]="size()">{{ text().title }}</h2>
        @if (text().body) {
          <p class="body" [style.color]="network() === 'instagram' ? '#f2f3f5' : null">{{ text().body }}</p>
        }
      </div>

      @if (text().cta) {
        <div class="content" style="left: 96px; bottom: 96px">
          <span [class]="network() === 'instagram' ? 'pill' : 'plate cta'">{{ text().cta }}</span>
        </div>
      }

      @if (network() === 'linkedin') {
        <span class="count content" style="right: 96px; top: 104px">{{ index() + 1 }}/{{ total() }}</span>
        <div class="content" style="left: 96px; right: 96px; bottom: 88px; height: 6px; border-radius: 3px; background: #383838">
          <div style="height: 100%; border-radius: 3px; background: #3986ff" [style.width.%]="progress()"></div>
        </div>
      } @else {
        <span class="count content" style="right: 96px; bottom: 88px; color: #f2f3f5">{{ index() + 1 }}/{{ total() }}</span>
      }
    </div>
  `,
})
export class AdCarouselSlide {
  readonly slide = input.required<AdSlide>();
  readonly network = input.required<Network>();
  readonly index = input.required<number>();
  readonly total = input.required<number>();
  readonly background = input<string | null>(null);

  readonly text = computed(() => {
    const s = this.slide();
    return {
      kicker: cleanPieceText(s.kicker),
      title: cleanPieceText(s.title),
      body: cleanPieceText(s.body),
      cta: cleanPieceText(s.cta),
    };
  });

  readonly size = computed(() => {
    const steps = STEPS[this.network()];
    return titleSize(this.text().title, this.index() === 0 ? steps.cover : steps.inner);
  });

  readonly progress = computed(() => ((this.index() + 1) / this.total()) * 100);

  /** Alturas do horizonte nas bordas esquerda e direita deste slide (so no Instagram). */
  readonly horizon = computed(() => {
    if (this.network() !== 'instagram') return null;
    const i = this.index();
    return { left: horizonY(i), right: horizonY(i + 1) };
  });
}
