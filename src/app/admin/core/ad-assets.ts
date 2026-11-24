import { Injectable, inject } from '@angular/core';
import { toPng } from 'html-to-image';
import type { AdFormat, Network } from '../ads/ad.types';
import { FORMAT_SIZE } from '../ads/ad.types';
import { Auth } from './auth';
import { Supabase } from './supabase';

const BUCKET = 'ads';
const SIGNED_URL_TTL = 60 * 60;

/** Nome do PNG: `<formato>-<rede>-<aaaa-mm-dd>-v<n>[-<slide>].png`. */
export function exportName(
  format: AdFormat,
  network: Network,
  createdAt: string,
  variation: number,
  slide?: number,
): string {
  const date = createdAt.slice(0, 10);
  const suffix = slide === undefined ? '' : `-${slide}`;
  return `${format}-${network}-${date}-v${variation}${suffix}.png`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Arquivos do gerador no Storage (bucket privado `ads`) e o export das pecas em PNG. */
@Injectable({ providedIn: 'root' })
export class AdAssets {
  private readonly client = inject(Supabase).client;
  private readonly auth = inject(Auth);

  /**
   * Fundo como data URL. Vem do Storage por URL assinada e e convertido aqui, para o export nao
   * esbarrar em CORS (canvas "tainted").
   */
  async background(path: string): Promise<string | null> {
    const { data, error } = await this.client.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
    if (error || !data) return null;
    const res = await fetch(data.signedUrl);
    if (!res.ok) return null;
    return blobToDataUrl(await res.blob());
  }

  /** Renderiza a peca no tamanho real. Espera as fontes, senao o PNG sai com fonte de sistema. */
  async render(element: HTMLElement, format: AdFormat): Promise<string> {
    await document.fonts.ready;
    const { width, height } = FORMAT_SIZE[format];
    return toPng(element, { width, height, pixelRatio: 1, cacheBust: true });
  }

  /** Baixa o PNG e guarda uma copia em `<dono>/exports/<geracao>/`. */
  async download(
    element: HTMLElement,
    format: AdFormat,
    generationId: string,
    fileName: string,
  ): Promise<void> {
    const dataUrl = await this.render(element, format);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();

    const owner = this.auth.user()?.id;
    if (!owner) return;
    const blob = await (await fetch(dataUrl)).blob();
    // Sem upsert: baixar de novo a mesma peca nao sobrescreve (e o erro de duplicado e ignorado)
    await this.client.storage
      .from(BUCKET)
      .upload(`${owner}/exports/${generationId}/${fileName}`, blob, { contentType: 'image/png' });
  }
}
