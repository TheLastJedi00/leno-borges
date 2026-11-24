/** Contrato da Edge Function `generate-ad` (espelha supabase/functions/_shared/types.ts). */
export type AdFormat = 'story' | 'carousel' | 'post';
export type Network = 'instagram' | 'linkedin';
export type AdLang = 'en' | 'fr' | 'pt';

export interface GenerateRequest {
  theme: string;
  format: AdFormat;
  network: Network;
  lang: AdLang;
  slideCount?: number;
  withBackground: boolean;
}

export interface AdSlide {
  kicker?: string;
  title: string;
  body?: string;
  cta?: string;
}

export interface AdVariation {
  angle: string;
  slides: AdSlide[];
  caption: string;
  hashtags: string[];
  warnings?: string[];
}

export interface Generation {
  id: string;
  created_at: string;
  theme: string;
  format: AdFormat;
  network: Network;
  lang: AdLang;
  slide_count: number;
  variations: AdVariation[];
  background_path: string | null;
  model: string;
}

/** Tamanho real de cada peca, em px. */
export const FORMAT_SIZE: Record<AdFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  carousel: { width: 1080, height: 1080 },
  post: { width: 1080, height: 1440 },
};
