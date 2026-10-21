import type {
  Education,
  Experience,
  Language,
  Metric,
  SkillGroup,
} from '../pages/home/home.data';

export type Lang = 'en' | 'fr' | 'pt';

/** Contrato de tradução: en.ts, fr.ts e pt.ts implementam esta interface (chave faltando = erro de build). */
export interface Dictionary {
  meta: { htmlLang: string; title: string; description: string };
  header: {
    navLabel: string;
    home: string;
    nav: { about: string; experience: string; skills: string; education: string };
    contact: string;
    langLabel: string;
    langNames: Record<Lang, string>;
  };
  hero: {
    location: string;
    roleLead: string;
    roleTail: string;
    tagline: string;
    ctaExperience: string;
    ctaContact: string;
  };
  owner: { alt: string; caption: string };
  about: { title: string; summary: string; summaryExtra: string; metrics: Metric[] };
  experience: { title: string; lead: string; techsLabel: string; items: Experience[] };
  skills: { title: string; groups: SkillGroup[] };
  education: { title: string; items: Education[] };
  languages: { title: string; items: Language[] };
  contact: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    emailLabel: string;
    whatsappMessage: string;
  };
  footer: { location: string; rights: string };
}
