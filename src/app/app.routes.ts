import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  // Case BF Academy removido na spec 002; mantém links antigos funcionando
  { path: 'bfacademy', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
