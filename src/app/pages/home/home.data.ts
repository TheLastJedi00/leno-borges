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
  techs: string[];
  paths: ExperiencePath[];
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

export function whatsappUrl(message: string): string {
  return `https://wa.me/${contactInfo.phoneE164}?text=${encodeURIComponent(message)}`;
}
