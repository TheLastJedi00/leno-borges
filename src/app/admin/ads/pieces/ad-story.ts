import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AdSlide, Network } from '../ad.types';
import { cleanPieceText, titleSize } from './piece-text';

/**
 * Stories 9:16 (1080x1920). Nada de texto nas faixas de 250 px do topo e de baixo, onde ficam a
 * interface do app e o campo de resposta.
 *  - LinkedIn: pilha editorial no terco do meio e o CTA numa placa em relevo acima da faixa segura.
 *  - Instagram: campo azul ocupando a metade de baixo; o titulo cruza a borda do campo.
 */
@Component({
  selector: 'app-ad-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './piece.css',
  template: `
    <div class="piece" [attr.data-network]="network()" style="width: 1080px; height: 1920px">
      @if (background(); as bg) {
        <img class="bg-img" [src]="bg" alt="" />
        <div class="veil"></div>
      }
      <img class="logo" style="top: 290px" src="images/logo.svg" alt="" />

      @if (network() === 'linkedin') {
        <div class="content" style="left: 96px; right: 96px; top: 720px">
          <div style="width: 120px; height: 8px; border-radius: 4px; background: #3986ff; margin-bottom: 44px"></div>
          @if (text().kicker) {
            <p class="kicker">{{ text().kicker }}</p>
          }
          <h2 class="title" [style.font-size.px]="size()">{{ text().title }}</h2>
          @if (text().body) {
            <p class="body">{{ text().body }}</p>
          }
        </div>
        @if (text().cta) {
          <div class="content" style="left: 96px; bottom: 310px">
            <span class="plate cta">{{ text().cta }}</span>
          </div>
        }
      } @else {
        <div class="field" style="left: 0; right: 0; top: 1060px; bottom: 0; border-top-left-radius: 260px"></div>
        <div
          class="content"
          style="left: 96px; right: 80px; bottom: 760px; display: flex; flex-direction: column; justify-content: flex-end"
        >
          @if (text().kicker) {
            <p class="kicker">{{ text().kicker }}</p>
          }
          <h2 class="title" [style.font-size.px]="size()">{{ text().title }}</h2>
        </div>
        <div class="content" style="left: 96px; right: 96px; top: 1220px; bottom: 270px; display: flex; flex-direction: column">
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
export class AdStory {
  readonly slide = input.required<AdSlide>();
  readonly network = input.required<Network>();
  /** Data URL do fundo gerado por IA, ou `null`. */
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
            { chars: 18, size: 172 },
            { chars: 32, size: 144 },
            { chars: 50, size: 118 },
            { chars: 999, size: 100 },
          ]
        : [
            { chars: 24, size: 148 },
            { chars: 40, size: 126 },
            { chars: 60, size: 106 },
            { chars: 999, size: 92 },
          ],
    ),
  );
}
