import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { KitRouteReuseStrategy } from './kit/kit-route-reuse';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    // Seguir para a próxima aula recria o player (spec 007)
    { provide: RouteReuseStrategy, useClass: KitRouteReuseStrategy },
  ]
};
