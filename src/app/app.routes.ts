import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { lessonGuard } from './kit/kit.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  // Kit de Ensino (spec 006): tudo lazy, para não pesar o bundle da home
  { path: 'kit', loadComponent: () => import('./kit/catalog/catalog').then((m) => m.Catalog) },
  // Antes de `:slide`, para "apresentador" não ser lido como número de slide
  {
    path: 'kit/:trilha/:aula/apresentador',
    canActivate: [lessonGuard],
    loadComponent: () => import('./kit/presenter/presenter').then((m) => m.Presenter),
  },
  // Uma só configuração de rota para o player, assim trocar de slide reaproveita o componente
  { path: 'kit/:trilha/:aula', redirectTo: 'kit/:trilha/:aula/1' },
  {
    path: 'kit/:trilha/:aula/:slide',
    canActivate: [lessonGuard],
    loadComponent: () => import('./kit/player/player').then((m) => m.Player),
  },
  { path: 'kit/**', redirectTo: 'kit' },
  // Case BF Academy removido na spec 002; mantém links antigos funcionando
  { path: 'bfacademy', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
