import type {
  Education,
  Experience,
  Language,
  Metric,
  SkillGroup,
} from '../pages/home/home.data';
import type { LessonId, Mode, TrackId } from '../kit/kit.data';

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
  experience: {
    title: string;
    lead: string;
    techsLabel: string;
    /** Verbo do botão de link do card: "<visit> <domínio> ↗". */
    visit: string;
    /** Aviso sr-only de que o link abre em nova aba. */
    newTab: string;
    items: Experience[];
  };
  skills: { title: string; groups: SkillGroup[] };
  /** Linha de parceria em experiência e formação: "<label> · <nome> <linkedin sr-only>". */
  partners: { label: string; linkedin: string };
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
  /** Kit de Ensino: interface trilíngue; o conteúdo das aulas fica no deck (PT). */
  kit: {
    /** Botão interno no card de experiência que leva ao kit. */
    cardButton: string;
    meta: { title: string; description: string; lessonSuffix: string };
    /** Aviso exibido em EN/FR: o conteúdo das aulas está em português. */
    ptOnly: string;
    catalog: {
      eyebrow: string;
      title: string;
      intro: string;
      back: string;
      duration: string;
      slides: string;
      essentialSlides: string;
      totalSlides: string;
      syntax: string;
      mode: string;
      present: string;
    };
    modes: Record<Mode, string>;
    modeHints: Record<Mode, string>;
    tracks: Record<
      TrackId,
      {
        title: string;
        description: string;
        lessons: Record<LessonId, { title: string; summary: string; duration: string }>;
      }
    >;
    player: {
      loading: string;
      controls: string;
      back: string;
      prev: string;
      next: string;
      fullscreen: string;
      exitFullscreen: string;
      presenter: string;
      syntax: string;
      mode: string;
      /** "<slide> <n> <of> <total>". */
      slide: string;
      of: string;
      slideRole: string;
      progress: string;
    };
    presenter: {
      title: string;
      current: string;
      next: string;
      end: string;
      notes: string;
      noNotes: string;
      timer: string;
      start: string;
      pause: string;
      reset: string;
      hint: string;
    };
    exercise: {
      correct: string;
      wrong: string;
      reset: string;
      sortHint: string;
      items: string;
      placedIn: string;
      done: string;
      choose: string;
      reveal: string;
      answer: string;
    };
  };
}
