import type { PlayerState } from './player-state';

export interface DeckKeyActions {
  fullscreen?: () => void;
  presenter?: () => void;
}

/**
 * Atalhos comuns ao player e à janela do apresentador. Devolve `true` quando a tecla foi usada.
 * Teclas dentro de um exercício ficam com o exercício (menos PageUp/PageDown, do passador);
 * espaço sobre um botão aciona o botão.
 */
export function handleDeckKey(
  event: KeyboardEvent,
  state: PlayerState,
  actions: DeckKeyActions = {},
): boolean {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return false;
  const target = event.target as HTMLElement | null;
  // Passadores de slide enviam PageUp/PageDown: esses continuam valendo dentro do exercício
  const inExercise = !!target?.closest?.('[data-kit-exercise]');
  if (inExercise && event.key !== 'PageDown' && event.key !== 'PageUp') return false;
  const onControl = !!target?.closest?.('button, a, input, select, textarea');
  const syntaxes = state.lesson()?.syntaxes ?? [];

  switch (event.key) {
    case 'ArrowRight':
    case 'PageDown':
      state.next();
      break;
    case ' ':
      if (onControl) return false;
      state.next();
      break;
    case 'ArrowLeft':
    case 'PageUp':
      state.prev();
      break;
    case 'Home':
      state.first();
      break;
    case 'End':
      state.last();
      break;
    case 'f':
    case 'F':
      if (!actions.fullscreen) return false;
      actions.fullscreen();
      break;
    case 'n':
    case 'N':
      if (!actions.presenter) return false;
      actions.presenter();
      break;
    case 'r':
    case 'R':
      state.toggleMode();
      break;
    case '1':
    case '2':
    case '3': {
      const syntax = syntaxes[Number(event.key) - 1];
      if (!syntax) return false;
      state.setSyntax(syntax);
      break;
    }
    default:
      return false;
  }
  event.preventDefault();
  return true;
}
