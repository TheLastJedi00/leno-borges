import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Session } from '@supabase/supabase-js';
import { AUTH_URL_HASH, Auth } from './auth';
import { Supabase } from './supabase';

type AuthListener = (event: string, session: Session | null) => void;

function fakeSession(email = 'dono@exemplo.com'): Session {
  return { user: { id: 'u1', email } } as Session;
}

function setup(initial: Session | null, signInError: unknown = null, hash = '') {
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
    updateUser: jasmine.createSpy('updateUser').and.resolveTo({ error: null }),
  };
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: Supabase, useValue: { client: { auth } } },
      { provide: AUTH_URL_HASH, useValue: hash },
    ],
  });
  return {
    service: TestBed.inject(Auth),
    auth,
    emit: (s: Session | null, event = 'X') => listener(event, s),
  };
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

  it('link de recuperacao ou de convite pede para definir a senha', () => {
    expect(setup(null, null, '#access_token=a&type=recovery').service.needsPassword()).toBeTrue();
    TestBed.resetTestingModule();
    expect(setup(null, null, '#access_token=a&type=invite').service.needsPassword()).toBeTrue();
    TestBed.resetTestingModule();
    expect(setup(null, null, '#access_token=a&type=signup').service.needsPassword()).toBeFalse();
    TestBed.resetTestingModule();
    expect(setup(null).service.needsPassword()).toBeFalse();
  });

  it('o evento PASSWORD_RECOVERY do SDK tambem pede a senha', async () => {
    const { service, emit } = setup(null);
    await service.whenReady();
    emit(fakeSession(), 'PASSWORD_RECOVERY');
    expect(service.needsPassword()).toBeTrue();
  });

  it('link expirado vira mensagem em portugues', () => {
    const { service } = setup(null, null, '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid');
    expect(service.linkError()).toBe('O link expirou ou já foi usado. Peça um novo no painel do Supabase.');
    expect(service.needsPassword()).toBeFalse();
  });

  it('updatePassword grava a senha e encerra o pedido', async () => {
    const { service, auth } = setup(fakeSession(), null, '#type=recovery');
    expect(await service.updatePassword('nova-senha-123')).toBeNull();
    expect(auth.updateUser).toHaveBeenCalledWith({ password: 'nova-senha-123' });
    expect(service.needsPassword()).toBeFalse();
  });

  it('updatePassword devolve a mensagem do erro e mantem o pedido', async () => {
    const { service, auth } = setup(fakeSession(), null, '#type=recovery');
    auth.updateUser.and.resolveTo({ error: { code: 'weak_password', message: 'weak' } });
    expect(await service.updatePassword('123')).toBe('Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.');
    auth.updateUser.and.resolveTo({ error: { code: 'same_password', message: 'same' } });
    expect(await service.updatePassword('igual')).toBe('A senha nova precisa ser diferente da atual.');
    auth.updateUser.and.resolveTo({ error: { message: 'outra coisa' } });
    expect(await service.updatePassword('x')).toBe('Não foi possível salvar a senha. Tente de novo.');
    expect(service.needsPassword()).toBeTrue();
  });
});
