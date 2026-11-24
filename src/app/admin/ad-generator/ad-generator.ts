import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { adminStrings } from '../admin.strings';
import type { AdFormat, AdLang, GenerateRequest, Generation, Network } from '../ads/ad.types';
import { AdApi } from '../core/ad-api';
import { AdAssets } from '../core/ad-assets';
import { AdVariationCard } from './ad-variation';

@Component({
  selector: 'app-ad-generator',
  imports: [FormsModule, RouterLink, AdVariationCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ad-generator.html',
})
export class AdGenerator {
  private readonly api = inject(AdApi);
  private readonly assets = inject(AdAssets);
  readonly s = adminStrings.adGenerator;

  readonly formats: AdFormat[] = ['story', 'carousel', 'post'];
  readonly networks: Network[] = ['instagram', 'linkedin'];
  readonly langs: AdLang[] = ['en', 'fr', 'pt'];

  readonly theme = signal('');
  readonly format = signal<AdFormat>('carousel');
  readonly network = signal<Network>('linkedin');
  readonly lang = signal<AdLang>('en');
  readonly slideCount = signal(5);
  readonly withBackground = signal(false);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly generation = signal<Generation | null>(null);
  /** Fundo da geracao atual como data URL (null sem fundo ou enquanto carrega). */
  readonly background = signal<string | null>(null);

  /** Mostra uma geracao (nova ou do historico) e carrega o fundo dela, se houver. */
  async show(g: Generation) {
    this.generation.set(g);
    this.background.set(null);
    if (g.background_path) {
      const bg = await this.assets.background(g.background_path).catch(() => null);
      if (this.generation()?.id === g.id) this.background.set(bg);
    }
  }

  readonly canSubmit = computed(() => {
    const t = this.theme().trim().length;
    return !this.loading() && t >= 3 && t <= 500;
  });

  request(): GenerateRequest {
    const req: GenerateRequest = {
      theme: this.theme().trim(),
      format: this.format(),
      network: this.network(),
      lang: this.lang(),
      withBackground: this.withBackground(),
    };
    if (req.format === 'carousel') req.slideCount = this.slideCount();
    return req;
  }

  async submit() {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);
    this.notice.set(null);
    try {
      const result = await this.api.generate(this.request());
      this.notice.set(result.backgroundError ?? null);
      await this.show(result.generation);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}
