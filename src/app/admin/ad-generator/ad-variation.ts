import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { adminStrings } from '../admin.strings';
import { FORMAT_SIZE, type AdVariation, type Generation } from '../ads/ad.types';
import { AdCarouselSlide } from '../ads/pieces/ad-carousel-slide';
import { AdPost } from '../ads/pieces/ad-post';
import { AdStory } from '../ads/pieces/ad-story';
import { AdAssets, exportName } from '../core/ad-assets';

/** Escala do preview de cada formato (a peca e renderizada no tamanho real e reduzida). */
const PREVIEW_SCALE = { story: 0.25, carousel: 0.3, post: 0.27 } as const;

/** Uma variacao: previews, download de cada peca, texto sugerido e avisos. */
@Component({
  selector: 'app-ad-variation',
  imports: [AdStory, AdCarouselSlide, AdPost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ad-variation.html',
})
export class AdVariationCard {
  private readonly assets = inject(AdAssets);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly s = adminStrings.adGenerator.variation;

  readonly generation = input.required<Generation>();
  readonly variation = input.required<AdVariation>();
  /** Posicao da variacao (1, 2 ou 3). */
  readonly number = input.required<number>();
  readonly background = input<string | null>(null);

  readonly busy = signal<number | 'all' | null>(null);
  readonly copied = signal(false);
  readonly failed = signal(false);

  readonly format = computed(() => this.generation().format);
  readonly network = computed(() => this.generation().network);
  readonly scale = computed(() => PREVIEW_SCALE[this.format()]);
  readonly box = computed(() => {
    const { width, height } = FORMAT_SIZE[this.format()];
    return { width: width * this.scale(), height: height * this.scale() };
  });

  readonly captionText = computed(() => {
    const { caption, hashtags } = this.variation();
    return hashtags.length ? `${caption}\n\n${hashtags.join(' ')}` : caption;
  });

  private fileName(slide: number) {
    const g = this.generation();
    const many = g.format === 'carousel';
    return exportName(g.format, g.network, g.created_at, this.number(), many ? slide + 1 : undefined);
  }

  private pieceAt(index: number): HTMLElement | null {
    const frames = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-frame] .piece');
    return frames[index] ?? null;
  }

  async download(index: number) {
    const el = this.pieceAt(index);
    if (!el || this.busy() !== null) return;
    this.busy.set(index);
    this.failed.set(false);
    try {
      await this.assets.download(el, this.format(), this.generation().id, this.fileName(index));
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(null);
    }
  }

  async downloadAll() {
    if (this.busy() !== null) return;
    this.busy.set('all');
    this.failed.set(false);
    try {
      for (let i = 0; i < this.variation().slides.length; i++) {
        const el = this.pieceAt(i);
        if (el) await this.assets.download(el, this.format(), this.generation().id, this.fileName(i));
      }
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(null);
    }
  }

  async copy() {
    await navigator.clipboard.writeText(this.captionText());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
