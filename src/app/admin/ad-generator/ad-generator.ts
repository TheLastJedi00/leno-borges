import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { adminStrings } from '../admin.strings';
import type { AdFormat, AdLang, GenerateRequest, Generation, Network } from '../ads/ad.types';
import { AdApi } from '../core/ad-api';

@Component({
  selector: 'app-ad-generator',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ad-generator.html',
})
export class AdGenerator {
  private readonly api = inject(AdApi);
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
      this.generation.set(result.generation);
      this.notice.set(result.backgroundError ?? null);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}
