import type { AdFormat, AdSlide, AdVariation, GenerateInput, Lang, Network } from './types.ts';

const FORMATS: AdFormat[] = ['story', 'carousel', 'post'];
const NETWORKS: Network[] = ['instagram', 'linkedin'];
const LANGS: Lang[] = ['en', 'fr', 'pt'];

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
  const html = text(raw.html);
  if (!title || !html) return null;
  const slide: AdSlide = { title };
  for (const field of ['kicker', 'body', 'cta'] as const) {
    if (raw[field] === undefined || raw[field] === null) continue;
    if (typeof raw[field] !== 'string') return null;
    const value = text(raw[field]);
    if (value) slide[field] = value;
  }
  slide.html = html;
  return slide;
}

/** Confere uma variacao do Gemini contra o contrato e devolve so os campos conhecidos. */
export function validateVariation(raw: unknown, input: GenerateInput): Parsed<AdVariation> {
  if (!isRecord(raw)) return fail('Variação inválida.');
  const angle = text(raw.angle);
  if (!angle) return fail('Variação sem ângulo.');
  const caption = text(raw.caption);
  if (!caption) return fail('Variação sem texto sugerido.');
  if (!Array.isArray(raw.hashtags) || raw.hashtags.some((h) => typeof h !== 'string')) {
    return fail('Hashtags inválidas.');
  }
  if (!Array.isArray(raw.slides) || raw.slides.length !== input.slideCount) {
    return fail(`A variação deveria ter ${input.slideCount} slide(s).`);
  }
  const slides: AdSlide[] = [];
  for (const [j, s] of raw.slides.entries()) {
    const slide = parseSlide(s);
    if (!slide) return fail(`Slide ${j + 1} inválido (título e html são obrigatórios).`);
    slides.push(slide);
  }
  const hashtags = (raw.hashtags as string[]).map((h) => h.trim()).filter(Boolean);
  return { ok: true, value: { angle, slides, caption, hashtags } };
}

/** Marcadores que o front troca pelos arquivos reais (os unicos "enderecos" aceitos no HTML). */
const PLACEHOLDER = /^\s*['"]?\s*(\{\{(LOGO_URL|BACKGROUND_URL)\}\}|data:image\/)/i;

/**
 * Problemas de seguranca no HTML gerado (vazio = aceito). O HTML e mostrado no painel, na mesma
 * origem da sessao: nada de script, handler, CSS em bloco ou endereco externo. O front ainda passa
 * tudo pelo DOMPurify; esta checagem serve para pedir ao Gemini um HTML limpo.
 */
export function unsafeHtml(html: string): string[] {
  const out: string[] = [];
  const has = (re: RegExp) => re.test(html);
  if (has(/<\s*script\b/i)) out.push('tem <script>');
  if (has(/<\s*style\b/i)) out.push('tem <style> (use só style="..." inline)');
  if (has(/<\s*(iframe|object|embed|link|meta|base|form|input|frame|frameset)\b/i)) {
    out.push('tem tag proibida (iframe, object, embed, link, meta, base, form ou input)');
  }
  if (has(/\son[a-z]+\s*=/i)) out.push('tem atributo de evento (on...=)');
  if (has(/javascript\s*:/i)) out.push('tem javascript:');
  if (has(/@import/i)) out.push('tem @import');

  const external: string[] = [];
  for (const m of html.matchAll(/\b(?:src|href|xlink:href)\s*=\s*(["'])(.*?)\1/gi)) {
    if (!PLACEHOLDER.test(m[2]) && !m[2].startsWith('#')) external.push(m[2]);
  }
  for (const m of html.matchAll(/url\(\s*([^)]*)\)/gi)) {
    if (!PLACEHOLDER.test(m[1]) && !/^\s*['"]?#/.test(m[1])) external.push(m[1]);
  }
  if (external.length > 0) out.push('tem endereço externo (use só {{LOGO_URL}}, {{BACKGROUND_URL}} ou data:)');
  return out;
}
