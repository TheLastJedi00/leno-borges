// Tipos e dados neutros de idioma da Home. Textos traduzíveis ficam em src/app/i18n/ (en, fr, pt).
// Fonte de verdade dos fatos: .specs/001 - Rebuild/resume.md

export interface ExperiencePath {
  path: string;
  description: string;
}

export interface Experience {
  title: string;
  subtitle: string;
  role: string;
  period: string;
  location: string;
  badge?: string;
  /** Página oficial do sistema (de `projectUrls`); sem valor, o card não mostra o botão. */
  url?: string;
  /** Rota interna do site (de `kitPaths`); mostra o botão do Kit de Ensino, na mesma aba. */
  kitPath?: string;
  techs: string[];
  paths: ExperiencePath[];
  /** Parceiros do projeto (de `partners`); sem valor, o card não mostra a linha de parceria. */
  partners?: Partner[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EducationModule {
  name: string;
  hours: string;
  description: string;
}

export interface Education {
  title: string;
  institution: string;
  period: string;
  modules?: EducationModule[];
  /** Parceiros da formação (de `partners`). */
  partners?: Partner[];
}

export interface Partner {
  name: string;
  linkedin: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Contact {
  label: string;
  value: string;
  href: string;
}

export const contactInfo = {
  email: 'lenoborges.dev@gmail.com',
  phoneDisplay: '+55 (47) 99247-8232',
  phoneE164: '5547992478232',
  linkedin: 'https://www.linkedin.com/in/jediaelborges00/',
  linkedinHandle: 'in/jediaelborges00',
  github: 'https://github.com/TheLastJedi00',
  githubHandle: 'TheLastJedi00',
  instagram: 'https://www.instagram.com/lenoborges.dev/',
};

/** Páginas oficiais dos sistemas exibidos na timeline (neutras de idioma). */
export const projectUrls = {
  ligaDev: 'https://liga.lenoborges.com.br/comunidade',
  delcastanher: 'https://www.delcastanher.srv.br',
  tichr: 'https://www.tichr.com.br',
  bfAcademy: 'https://www.barbarafarias.com.br/academy',
};

/** Rotas internas exibidas como botão nos cards (neutras de idioma). */
export const kitPaths = {
  root: '/kit',
};

/** Parceiros dos projetos (nomes próprios, neutros de idioma). URLs sem parâmetros de rastreio. */
export const partners = {
  barbaraFarias: {
    name: 'Bárbara Farias',
    linkedin: 'https://www.linkedin.com/in/b%C3%A1rbara-farias-490041186/',
  },
  lidianeDelcastanher: {
    name: 'Lidiane Delcastanher',
    linkedin: 'https://www.linkedin.com/in/lidiane-delcastanher-5b2861153/',
  },
  paulaMarjorie: {
    name: 'Paula Marjorie',
    linkedin: 'https://www.linkedin.com/in/paula-marjorie/',
  },
  proway: { name: 'ProWay', linkedin: 'https://www.linkedin.com/company/prowayinfo/' },
  tsystems: { name: 'T-Systems', linkedin: 'https://www.linkedin.com/company/tsystems-brasil/' },
} satisfies Record<string, Partner>;

/** URL legível para o botão: sem protocolo, sem `www.` e sem barra final. */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${contactInfo.phoneE164}?text=${encodeURIComponent(message)}`;
}
