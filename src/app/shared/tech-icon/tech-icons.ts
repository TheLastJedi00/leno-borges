import {
  type SimpleIcon,
  siAngular,
  siDocker,
  siFirebase,
  siGit,
  siGithub,
  siGooglecloud,
  siGooglegemini,
  siJavascript,
  siJsonwebtokens,
  siMysql,
  siNestjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siReactivex,
  siSpringboot,
  siTypescript,
  siVercel,
} from 'simple-icons';

export interface TechIconDef {
  path: string;
  /** Cor aplicada no hover; marcas quase pretas usam o token `paper` para não sumir no fundo escuro */
  hover: string;
}

const PAPER = 'var(--color-paper)';

// Cor oficial clássica, já que o hex atual do pacote é quase preto
const overrides: Record<string, string> = { Angular: '#dd0031' };

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function def(icon: SimpleIcon, title = icon.title): TechIconDef {
  const hover = overrides[title] ?? (luminance(icon.hex) < 0.06 ? PAPER : `#${icon.hex}`);
  return { path: icon.path, hover };
}

/** Nome exibido da tech → ícone. Nomes fora do mapa (conceitos) viram chip só de texto. */
export const techIcons: Record<string, TechIconDef> = {
  Angular: def(siAngular, 'Angular'),
  'Angular 20 (Signals)': def(siAngular, 'Angular'),
  TypeScript: def(siTypescript),
  JavaScript: def(siJavascript),
  Java: def(siOpenjdk),
  'Spring Boot': def(siSpringboot),
  NestJS: def(siNestjs),
  'NestJS 11': def(siNestjs),
  'Node.js': def(siNodedotjs),
  RxJS: def(siReactivex),
  PostgreSQL: def(siPostgresql),
  MySQL: def(siMysql),
  Firebase: def(siFirebase),
  Firestore: def(siFirebase),
  GCP: def(siGooglecloud),
  Vercel: def(siVercel),
  Docker: def(siDocker),
  Git: def(siGit),
  'Git/GitHub': def(siGithub),
  Gemini: def(siGooglegemini),
  'AI Studio': def(siGooglegemini),
  JWT: def(siJsonwebtokens),
};
