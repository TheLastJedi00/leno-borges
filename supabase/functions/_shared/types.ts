export type AdFormat = 'story' | 'carousel' | 'post';
export type Network = 'instagram' | 'linkedin';
export type Lang = 'en' | 'fr' | 'pt';

export interface GenerateInput {
  theme: string;
  format: AdFormat;
  network: Network;
  lang: Lang;
  /** 1 para story e post; 3 a 10 no carrossel. */
  slideCount: number;
  withBackground: boolean;
}

export interface AdSlide {
  kicker?: string;
  title: string;
  body?: string;
  cta?: string;
  /**
   * Arte da peca em HTML, criada pelo Gemini: so estilos inline, no tamanho exato do formato,
   * com os marcadores {{LOGO_URL}} e {{BACKGROUND_URL}}. Geracoes antigas nao tem (o front usa
   * os templates fixos).
   */
  html?: string;
}

export interface AdVariation {
  angle: string;
  slides: AdSlide[];
  caption: string;
  hashtags: string[];
  /** Preenchido pela funcao, nunca pelo Gemini. */
  warnings?: string[];
}

export interface GenerationRow {
  id: string;
  owner_id: string;
  theme: string;
  format: AdFormat;
  network: Network;
  lang: Lang;
  slide_count: number;
  variations: AdVariation[];
  background_path: string | null;
  model: string;
}

export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  GEMINI_THINKING_LEVEL: string;
  GEMINI_IMAGE_MODEL: string;
  OWNER_USER_ID: string;
}
