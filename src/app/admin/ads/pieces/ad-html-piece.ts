import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FORMAT_SIZE, type AdFormat } from '../ad.types';
import { sanitizePieceHtml } from './piece-html';

/**
 * Arte criada pelo Gemini (HTML com estilos inline), numa moldura do tamanho real do formato.
 * O HTML ja sai limpo do `sanitizePieceHtml` (DOMPurify); o bypass so evita que o Angular tire
 * os atributos `style`, que sao a arte inteira.
 */
@Component({
  selector: 'app-ad-html-piece',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    .piece {
      position: relative;
      overflow: hidden;
      background: #1c1c1e;
      contain: paint;
    }
  `,
  template: `<div
    class="piece"
    [style.width.px]="size().width"
    [style.height.px]="size().height"
    [innerHTML]="safe()"
  ></div>`,
})
export class AdHtmlPiece {
  private readonly sanitizer = inject(DomSanitizer);

  readonly html = input.required<string>();
  readonly format = input.required<AdFormat>();
  /** Data URL do fundo gerado por IA, ou `null`. */
  readonly background = input<string | null>(null);

  readonly size = computed(() => FORMAT_SIZE[this.format()]);
  readonly safe = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(sanitizePieceHtml(this.html(), this.background())),
  );
}
