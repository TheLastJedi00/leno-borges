import type { BySyntax, ChestShape, ChestState } from '../kit.data';

// Baús usados nos decks: o formato define o tipo escrito no baú, por sintaxe.

/** Nome do tipo escrito no baú, por sintaxe (em JS é o que `typeof` responde). */
export const TYPE: Record<Exclude<ChestShape, 'any'>, BySyntax> = {
  text: { js: 'string', ts: 'string', java: 'String' },
  int: { js: 'number', ts: 'number', java: 'int' },
  decimal: { js: 'number', ts: 'number', java: 'double' },
  bool: { js: 'boolean', ts: 'boolean', java: 'boolean' },
};

export function chest(
  id: string,
  shape: Exclude<ChestShape, 'any'>,
  extra: Partial<ChestState> = {},
): ChestState {
  return { id, shape, typeName: TYPE[shape], ...extra };
}
