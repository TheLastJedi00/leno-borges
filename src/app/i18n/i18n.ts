import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { Dictionary, Lang } from './dictionary';
import { en } from './en';
import { fr } from './fr';
import { pt } from './pt';

const STORAGE_KEY = 'lang';
const dictionaries: Record<Lang, Dictionary> = { en, fr, pt };

export const LANGS: Lang[] = ['en', 'fr', 'pt'];

function isLang(value: unknown): value is Lang {
  return LANGS.includes(value as Lang);
}

// Sem preferência salva → inglês (mercado principal), independente do idioma do navegador
function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : 'en';
  } catch {
    return 'en';
  }
}

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = signal<Lang>(readStoredLang());
  readonly t = computed(() => dictionaries[this.lang()]);

  constructor() {
    effect(() => {
      const { meta } = this.t();
      this.document.documentElement.lang = meta.htmlLang;
      this.title.setTitle(meta.title);
      this.meta.updateTag({ name: 'description', content: meta.description });
    });
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage bloqueado (modo privado etc.): a troca vale só para esta sessão
    }
  }
}
