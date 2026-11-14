import type { Deck } from '../../kit.data';

// Aula 4 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Operadores Lógicos',
      subtitle: 'Como juntar e inverter perguntas de verdadeiro ou falso',
      notes: [
        'Retomar a aula 3: comparações respondem true ou false',
        'Pergunta de abertura: o que precisa ser verdade para você entrar num show?',
        'Hoje as respostas viram interruptores, e a lâmpada é o resultado',
      ],
    },
  ],
};
