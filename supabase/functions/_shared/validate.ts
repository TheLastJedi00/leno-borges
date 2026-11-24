import type { AdFormat, AdSlide, AdVariation, GenerateInput, Lang, Network } from './types.ts';

const FORMATS: AdFormat[] = ['story', 'carousel', 'post'];
const NETWORKS: Network[] = ['instagram', 'linkedin'];
const LANGS: Lang[] = ['en', 'fr', 'pt'];

export const VARIATION_COUNT = 3;

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Valida o corpo da requisicao. Mensagens de erro em portugues (vao direto para a tela). */
export function parseInput(body: unknown): Parsed<GenerateInput> {
  if (!isRecord(body)) return fail('Corpo da requisição inválido.');

  const theme = typeof body.theme === 'string' ? body.theme.trim() : '';
  if (theme.length < 3) return fail('Informe um tema com pelo menos 3 caracteres.');

  if (!FORMATS.includes(body.format as AdFormat)) return fail('Formato inválido.');
  if (!NETWORKS.includes(body.network as Network)) return fail('Rede inválida.');

  const lang = body.lang === undefined ? 'en' : body.lang;
  if (!LANGS.includes(lang as Lang)) return fail('Idioma inválido.');

  const format = body.format as AdFormat;
  let slideCount = 1;
  if (format === 'carousel') {
    const raw = body.slideCount === undefined ? 5 : body.slideCount;
    if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 3 || raw > 10) {
      return fail('O carrossel precisa de 3 a 10 slides.');
    }
    slideCount = raw;
  }

  const withBackground = body.withBackground === undefined ? false : body.withBackground;
  if (typeof withBackground !== 'boolean') return fail('Valor inválido para o fundo com IA.');

  return {
    ok: true,
    value: { theme, format, network: body.network as Network, lang: lang as Lang, slideCount, withBackground },
  };
}

const text = (x: unknown): string | null => (typeof x === 'string' && x.trim() ? x.trim() : null);

function parseSlide(raw: unknown): AdSlide | null {
  if (!isRecord(raw)) return null;
  const title = text(raw.title);
  if (!title) return null;
  const slide: AdSlide = { title };
  for (const field of ['kicker', 'body', 'cta'] as const) {
    if (raw[field] === undefined || raw[field] === null) continue;
    if (typeof raw[field] !== 'string') return null;
    const value = text(raw[field]);
    if (value) slide[field] = value;
  }
  return slide;
}

/** Confere a saida do Gemini contra o contrato e devolve so os campos conhecidos. */
export function validateVariations(raw: unknown, input: GenerateInput): Parsed<AdVariation[]> {
  if (!isRecord(raw) || !Array.isArray(raw.variations)) return fail('Resposta sem variações.');
  if (raw.variations.length !== VARIATION_COUNT) {
    return fail(`Esperava ${VARIATION_COUNT} variações, vieram ${raw.variations.length}.`);
  }

  const out: AdVariation[] = [];
  for (const [i, item] of raw.variations.entries()) {
    const n = i + 1;
    if (!isRecord(item)) return fail(`Variação ${n} inválida.`);
    const angle = text(item.angle);
    if (!angle) return fail(`Variação ${n} sem ângulo.`);
    const caption = text(item.caption);
    if (!caption) return fail(`Variação ${n} sem texto sugerido.`);
    if (!Array.isArray(item.hashtags) || item.hashtags.some((h) => typeof h !== 'string')) {
      return fail(`Variação ${n} com hashtags inválidas.`);
    }
    if (!Array.isArray(item.slides) || item.slides.length !== input.slideCount) {
      return fail(`Variação ${n} deveria ter ${input.slideCount} slide(s).`);
    }
    const slides: AdSlide[] = [];
    for (const [j, s] of item.slides.entries()) {
      const slide = parseSlide(s);
      if (!slide) return fail(`Variação ${n}, slide ${j + 1} inválido (título obrigatório).`);
      slides.push(slide);
    }
    const hashtags = (item.hashtags as string[]).map((h) => h.trim()).filter(Boolean);
    out.push({ angle, slides, caption, hashtags });
  }
  return { ok: true, value: out };
}
