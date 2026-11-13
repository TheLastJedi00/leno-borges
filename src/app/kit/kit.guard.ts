import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { findLesson } from './kit.data';

/** Trilha ou aula inexistente volta para o catálogo do kit. */
export const lessonGuard: CanActivateFn = (route) =>
  findLesson(route.paramMap.get('trilha'), route.paramMap.get('aula'))
    ? true
    : inject(Router).createUrlTree(['/kit']);
