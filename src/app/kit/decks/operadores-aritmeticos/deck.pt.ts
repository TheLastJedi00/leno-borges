import type { Deck } from '../../kit.data';

// Aula 2 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/007 - Operadores Aritmeticos/context.md
// Metáfora da aula 1: baú = variável, etiqueta = nome, item = valor. O operador abre os baús,
// faz a conta com os itens e guarda o resultado em um baú.

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Operadores Aritméticos',
      subtitle: 'Como fazer contas com os itens guardados nos baús',
      notes: [
        'Retomar a aula anterior: baú, etiqueta, item e formato',
        'Pergunta de abertura: que contas um app faz por você sem você perceber?',
        'Hoje os itens saem dos baús para virar contas',
      ],
    },
  ],
};
