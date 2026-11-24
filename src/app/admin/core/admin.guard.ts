import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

// `inject()` so funciona antes do primeiro `await`, entao as dependencias saem primeiro.

/** Espera a sessao inicial ser lida (sem piscar o login em quem ja esta logado) e barra quem nao entrou. */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  await auth.whenReady();
  if (!auth.signedIn()) {
    // Link de e-mail com erro: a tela de senha explica o que houve
    return router.createUrlTree([auth.linkError() ? '/admin/redefinir-senha' : '/admin/login']);
  }
  return auth.needsPassword() ? router.createUrlTree(['/admin/redefinir-senha']) : true;
};

/** Inverso: quem ja esta logado nao ve o login. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  await auth.whenReady();
  if (!auth.signedIn()) return true;
  return router.createUrlTree([auth.needsPassword() ? '/admin/redefinir-senha' : '/admin']);
};
