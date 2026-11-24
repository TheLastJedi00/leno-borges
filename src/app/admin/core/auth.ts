import { Injectable, computed, inject, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';
import { Supabase } from './supabase';

/** Sessao do dono. `ready` so vira true depois de ler a sessao salva, para o guard nao decidir cedo. */
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly client = inject(Supabase).client;

  readonly session = signal<Session | null>(null);
  readonly ready = signal(false);
  readonly user = computed(() => this.session()?.user ?? null);
  readonly signedIn = computed(() => this.session() !== null);

  private readonly loaded: Promise<void>;

  constructor() {
    this.client.auth.onAuthStateChange((_event, session) => this.session.set(session));
    this.loaded = this.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.ready.set(true);
    });
  }

  /** Resolve quando a sessao inicial ja foi lida. */
  whenReady(): Promise<void> {
    return this.loaded;
  }

  /** Devolve `true` se entrou; `false` com qualquer falha (a tela nao diz se foi o e-mail ou a senha). */
  async signIn(email: string, password: string): Promise<boolean> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    return !error;
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
    this.session.set(null);
  }
}
