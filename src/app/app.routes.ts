import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Bfacademy } from './pages/bfacademy/bfacademy';

export const routes: Routes = [
    {
        path: "", component: Home, pathMatch: 'full'
    },
    {
        path: "bfacademy", component: Bfacademy
    }
];
