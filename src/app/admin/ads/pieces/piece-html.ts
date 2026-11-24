import DOMPurify from 'dompurify';

/** Logo da marca, servida pelo proprio site (mesma origem, entao o export em PNG funciona). */
export const LOGO_URL = 'images/logo.svg';

const LOGO_TOKEN = /\{\{\s*LOGO_URL\s*\}\}/g;
const BACKGROUND_TOKEN = /\{\{\s*BACKGROUND_URL\s*\}\}/;
const CSS_URL = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;

const FORBID_TAGS = [
  'style', 'link', 'meta', 'base', 'form', 'input', 'button', 'textarea', 'select', 'option',
  'video', 'audio', 'source', 'track', 'iframe', 'frame', 'object', 'embed', 'foreignObject',
  'script', 'template', 'noscript',
];

/**
 * Reescreve o `style` inline: o fundo entra no lugar do marcador; qualquer outro url() que nao
 * seja data:image vira `none`; position:fixed vira absolute (a arte nunca cobre o painel).
 */
function cleanStyle(style: string, background: string | null): string {
  return style
    .replace(CSS_URL, (_m, _q, target: string) => {
      if (BACKGROUND_TOKEN.test(target)) return background ? `url('${background}')` : 'none';
      if (/^data:image\//i.test(target.trim())) return `url('${target.trim()}')`;
      return 'none';
    })
    .replace(/@import[^;]*;?/gi, '')
    .replace(/expression\s*\(/gi, '(')
    .replace(/position\s*:\s*fixed/gi, 'position:absolute');
}

const isSafeImage = (src: string) => src === LOGO_URL || /^data:image\//i.test(src);

/**
 * Sanitiza a arte criada pelo Gemini antes de colocar no painel (mesma origem da sessao do dono).
 * DOMPurify tira scripts, eventos e tags perigosas; os hooks cuidam do que ele deixa passar
 * (url() no CSS, imagens e links externos).
 */
export function sanitizePieceHtml(html: string, background: string | null): string {
  const purify = DOMPurify(window);
  purify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName === 'style') data.attrValue = cleanStyle(data.attrValue, background);
  });
  purify.addHook('afterSanitizeAttributes', (node) => {
    const el = node as Element;
    if (el.tagName === 'IMG' && !isSafeImage(el.getAttribute('src') ?? '')) {
      el.remove();
      return;
    }
    for (const attr of ['href', 'xlink:href']) {
      const value = el.getAttribute(attr);
      if (value !== null && !value.startsWith('#')) el.removeAttribute(attr);
    }
  });
  return purify.sanitize(html.replace(LOGO_TOKEN, LOGO_URL), {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    FORBID_TAGS,
    FORBID_ATTR: ['class', 'srcset'],
    ALLOW_DATA_ATTR: false,
  });
}
