import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/admin.guard';

/** Area restrita (spec 013). Tudo lazy: o SDK do Supabase so entra neste chunk. */
export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/admin-shell').then((m) => m.AdminShell),
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./login/login').then((m) => m.Login),
      },
      {
        // Sem guard: a propria tela trata link expirado ou ausente
        path: 'redefinir-senha',
        loadComponent: () => import('./set-password/set-password').then((m) => m.SetPassword),
      },
      {
        path: '',
        pathMatch: 'full',
        canActivate: [adminGuard],
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'publicidade',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./ad-generator/ad-generator').then((m) => m.AdGenerator),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
