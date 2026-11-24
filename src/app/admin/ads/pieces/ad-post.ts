import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AdSlide, Network } from '../ad.types';
import { cleanPieceText, titleSize } from './piece-text';

/**
 * Post 3:4 (1080x1440). Uma ideia: titulo grande no terco de cima e um elemento de apoio embaixo.
 *  - LinkedIn: o apoio e a placa em relevo, com o corpo e o CTA.
 *  - Instagram: o apoio e um campo azul com canto arredondado, com o corpo e a pilula do CTA.
 */
@Component({
  selector: 'app-ad-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './piece.css',
  template: `
    <div class="piece" [attr.data-network]="network()" style="width: 1080px; height: 1440px">
      @if (background(); as bg) {
        <img class="bg-img" [src]="bg" alt="" />
        <div class="veil"></div>
      }
      <img class="logo" style="top: 88px" src="images/logo.svg" alt="" />

      <div class="content" style="left: 96px; right: 96px; top: 240px">
        @if (text().kicker) {
          <p class="kicker">{{ text().kicker }}</p>
        }
        <h2 class="title" [style.font-size.px]="size()">{{ text().title }}</h2>
      </div>

      @if (network() === 'linkedin') {
        @if (text().body || text().cta) {
          <div class="content plate" style="left: 96px; right: 96px; bottom: 96px; padding: 60px 64px">
            @if (text().body) {
              <p class="body" style="margin: 0">{{ text().body }}</p>
            }
            @if (text().cta) {
              <p
                style="margin: 40px 0 0; display: flex; align-items: center; gap: 24px; font-family: 'Outfit', sans-serif; font-size: 40px; font-weight: 600; color: #f2f3f5"
              >
                <span style="width: 56px; height: 8px; border-radius: 4px; background: #3986ff"></span>
                {{ text().cta }}
              </p>
            }
          </div>
        }
      } @else {
        <div class="field" style="left: 0; right: 0; top: 860px; bottom: 0; border-top-right-radius: 280px"></div>
        <div class="content" style="left: 96px; right: 160px; top: 960px; bottom: 96px; display: flex; flex-direction: column">
          @if (text().body) {
            <p class="body" style="margin: 0; color: #f2f3f5">{{ text().body }}</p>
          }
          @if (text().cta) {
            <span class="pill" style="margin-top: auto; align-self: flex-start">{{ text().cta }}</span>
          }
        </div>
      }
    </div>
  `,
})
export class AdPost {
  readonly slide = input.required<AdSlide>();
  readonly network = input.required<Network>();
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

  readonly size = computed(() =>
    titleSize(
      this.text().title,
      this.network() === 'instagram'
        ? [
            { chars: 18, size: 164 },
            { chars: 32, size: 136 },
            { chars: 50, size: 112 },
            { chars: 999, size: 96 },
          ]
        : [
            { chars: 24, size: 124 },
            { chars: 40, size: 104 },
            { chars: 60, size: 90 },
            { chars: 999, size: 78 },
          ],
    ),
  );
}
