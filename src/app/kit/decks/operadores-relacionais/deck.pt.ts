import type { Deck } from '../../kit.data';

// Aula 3 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Operadores Relacionais',
      subtitle: 'Como comparar valores e receber verdadeiro ou falso',
      notes: [
        'Retomar: tipos (aula 1) e contas (aula 2)',
        'Pergunta de abertura: que perguntas de sim ou não um app faz o tempo todo?',
        'Hoje a resposta das comparações vira um item true ou false',
      ],
    },
  ],
};
