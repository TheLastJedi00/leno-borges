import { InjectionToken, Injectable, computed, inject, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';
import { Supabase } from './supabase';

/**
 * Hash da URL no momento em que a area restrita carrega. Os links de e-mail do Supabase
 * (recuperacao, convite) chegam com o token no hash; o SDK le e limpa o hash logo em seguida,
 * entao o tipo do link e guardado aqui antes. Token para os testes trocarem o valor.
 */
export const AUTH_URL_HASH = new InjectionToken<string>('AUTH_URL_HASH', {
  providedIn: 'root',
  factory: () => (typeof location === 'undefined' ? '' : location.hash),
});

/** Tipos de link que deixam o dono logado sem senha definida (ou com a senha esquecida). */
const PASSWORD_LINKS = ['recovery', 'invite'];

const LINK_EXPIRED = 'O link expirou ou já foi usado. Peça um novo no painel do Supabase.';
const LINK_INVALID = 'Não foi possível validar o link. Peça um novo no painel do Supabase.';

const PASSWORD_ERRORS: Record<string, string> = {
  weak_password: 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.',
  same_password: 'A senha nova precisa ser diferente da atual.',
};
const PASSWORD_FAILED = 'Não foi possível salvar a senha. Tente de novo.';

/** Sessao do dono. `ready` so vira true depois de ler a sessao salva, para o guard nao decidir cedo. */
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly client = inject(Supabase).client;

  readonly session = signal<Session | null>(null);
  readonly ready = signal(false);
  readonly user = computed(() => this.session()?.user ?? null);
  readonly signedIn = computed(() => this.session() !== null);
  /** O dono chegou por um link de recuperacao ou de convite e precisa definir a senha. */
  readonly needsPassword = signal(false);
  /** Mensagem quando o link do e-mail veio com erro (expirado, ja usado). */
  readonly linkError = signal<string | null>(null);

  private readonly loaded: Promise<void>;

  constructor() {
    this.readLink(inject(AUTH_URL_HASH));
    this.client.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      if (event === 'PASSWORD_RECOVERY') this.needsPassword.set(true);
    });
    this.loaded = this.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.ready.set(true);
    });
  }

  private readLink(hash: string) {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    if (params.get('error') || params.get('error_code')) {
      this.linkError.set(params.get('error_code') === 'otp_expired' ? LINK_EXPIRED : LINK_INVALID);
      return;
    }
    if (PASSWORD_LINKS.includes(params.get('type') ?? '')) this.needsPassword.set(true);
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

  /** Grava a senha nova. `null` deu certo; senao, a mensagem em portugues. */
  async updatePassword(password: string): Promise<string | null> {
    const { error } = await this.client.auth.updateUser({ password });
    if (error) {
      const code = (error as { code?: string }).code ?? '';
      return PASSWORD_ERRORS[code] ?? PASSWORD_FAILED;
    }
    this.needsPassword.set(false);
    return null;
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
    this.session.set(null);
  }
}
