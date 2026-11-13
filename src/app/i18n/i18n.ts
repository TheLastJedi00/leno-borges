import { DOCUMENT, DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { Dictionary, Lang } from './dictionary';
import { en } from './en';
import { fr } from './fr';
import { pt } from './pt';

const STORAGE_KEY = 'lang';
const dictionaries: Record<Lang, Dictionary> = { en, fr, pt };

export const LANGS: Lang[] = ['en', 'fr', 'pt'];

/** Título e descrição de uma página, calculados a partir do dicionário ativo. */
export type PageMeta = (d: Dictionary) => { title: string; description: string };

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
  /** Meta da página atual; sem valor, valem os da home (`meta` do dicionário). */
  private readonly pageMeta = signal<PageMeta | null>(null);

  constructor() {
    effect(() => {
      const d = this.t();
      const page = this.pageMeta()?.(d) ?? d.meta;
      this.document.documentElement.lang = d.meta.htmlLang;
      this.title.setTitle(page.title);
      this.meta.updateTag({ name: 'description', content: page.description });
    });
  }

  /** Define a meta da página enquanto o componente que chamou existir. */
  usePageMeta(meta: PageMeta, destroyRef = inject(DestroyRef)) {
    this.pageMeta.set(meta);
    destroyRef.onDestroy(() => {
      if (this.pageMeta() === meta) this.pageMeta.set(null);
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
