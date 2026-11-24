import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Session } from '@supabase/supabase-js';
import { Auth } from './auth';
import { Supabase } from './supabase';

type AuthListener = (event: string, session: Session | null) => void;

function fakeSession(email = 'dono@exemplo.com'): Session {
  return { user: { id: 'u1', email } } as Session;
}

function setup(initial: Session | null, signInError: unknown = null) {
  let listener: AuthListener = () => {};
  const auth = {
    getSession: jasmine.createSpy('getSession').and.resolveTo({ data: { session: initial } }),
    onAuthStateChange: jasmine.createSpy('onAuthStateChange').and.callFake((cb: AuthListener) => {
      listener = cb;
      return { data: { subscription: { unsubscribe() {} } } };
    }),
    signInWithPassword: jasmine
      .createSpy('signInWithPassword')
      .and.resolveTo({ error: signInError }),
    signOut: jasmine.createSpy('signOut').and.resolveTo({ error: null }),
  };
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: Supabase, useValue: { client: { auth } } }],
  });
  return { service: TestBed.inject(Auth), auth, emit: (s: Session | null) => listener('X', s) };
}

describe('Auth', () => {
  it('fica pronto so depois de ler a sessao salva', async () => {
    const { service } = setup(fakeSession());
    expect(service.ready()).toBeFalse();
    await service.whenReady();
    expect(service.ready()).toBeTrue();
    expect(service.signedIn()).toBeTrue();
    expect(service.user()?.email).toBe('dono@exemplo.com');
  });

  it('sem sessao salva, nao esta logado', async () => {
    const { service } = setup(null);
    await service.whenReady();
    expect(service.signedIn()).toBeFalse();
    expect(service.user()).toBeNull();
  });

  it('acompanha as mudancas de sessao do SDK', async () => {
    const { service, emit } = setup(null);
    await service.whenReady();
    emit(fakeSession());
    expect(service.signedIn()).toBeTrue();
    emit(null);
    expect(service.signedIn()).toBeFalse();
  });

  it('signIn devolve true quando entra e false em qualquer erro', async () => {
    const ok = setup(null);
    expect(await ok.service.signIn('a@b.c', 'x')).toBeTrue();
    expect(ok.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.c', password: 'x' });
    TestBed.resetTestingModule();
    const bad = setup(null, { message: 'Invalid login credentials' });
    expect(await bad.service.signIn('a@b.c', 'x')).toBeFalse();
  });

  it('signOut limpa a sessao', async () => {
    const { service, auth } = setup(fakeSession());
    await service.whenReady();
    await service.signOut();
    expect(auth.signOut).toHaveBeenCalled();
    expect(service.signedIn()).toBeFalse();
  });
});
