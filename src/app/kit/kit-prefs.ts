import { MODES, type Mode, SYNTAXES, type Syntax } from './kit.data';

// Preferências do apresentador guardadas no navegador (sem login).
const SYNTAX_KEY = 'kit-sintaxe';
const MODE_KEY = 'kit-roteiro';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage bloqueado (modo privado etc.): a escolha vale só para esta sessão
  }
}

export function isSyntax(value: unknown): value is Syntax {
  return SYNTAXES.includes(value as Syntax);
}

export function isMode(value: unknown): value is Mode {
  return MODES.includes(value as Mode);
}

/** Prioridade: query, depois a preferência salva, depois a primeira sintaxe da aula. */
export function resolveSyntax(query: unknown, stored: unknown, allowed: readonly Syntax[]): Syntax {
  if (isSyntax(query) && allowed.includes(query)) return query;
  if (isSyntax(stored) && allowed.includes(stored)) return stored;
  return allowed[0];
}

/** Prioridade: query, depois a preferência salva, depois `completo`. */
export function resolveMode(query: unknown, stored: unknown): Mode {
  if (isMode(query)) return query;
  if (isMode(stored)) return stored;
  return 'completo';
}

export const prefs = {
  syntax: () => read(SYNTAX_KEY),
  mode: () => read(MODE_KEY),
  saveSyntax: (s: Syntax) => write(SYNTAX_KEY, s),
  saveMode: (m: Mode) => write(MODE_KEY, m),
};
