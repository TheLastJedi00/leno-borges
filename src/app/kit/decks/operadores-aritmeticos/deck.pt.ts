import type { ChestState, Deck } from '../../kit.data';
import { chest } from '../chests';
import { code } from './code';

// Aula 2 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/007 - Operadores Aritmeticos/context.md
// Metáfora da aula 1: baú = variável, etiqueta = nome, item = valor. O operador abre os baús,
// faz a conta com os itens e guarda o resultado em um baú.

/** Baú de inteiro aberto, com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });

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

    // 2 · E
    {
      id: 'por-que-contas',
      kind: 'cards',
      depth: 'core',
      title: 'Fazer contas com os itens',
      lead: 'Guardar valores é só o começo: o programa precisa calcular com eles.',
      cards: [
        { title: 'Total do carrinho', value: '{n:preco} * {n:qtd}', text: 'Preço vezes quantidade.' },
        { title: 'Média das notas', value: '({n:n1} + {n:n2}) / {v:2}', text: 'Soma e divide.' },
        { title: 'Troco', value: '{n:pago} - {n:total}', text: 'O que sobra do pagamento.' },
      ],
      notes: [
        'Pedir exemplos da turma: frete, desconto, nota média, tempo restante',
        'Toda conta usa itens que estão guardados em baús',
        'Gancho: os símbolos que fazem essas contas são os operadores',
      ],
    },

    // 4 · E
    {
      id: 'cinco-operadores',
      kind: 'table',
      depth: 'core',
      title: 'Os cinco operadores',
      head: ['Operação', 'Operador', 'Exemplo', 'Resultado'],
      rows: {
        js: [
          ['Soma', '{k:+}', '{v:7} + {v:2}', '{v:9}'],
          ['Subtração', '{k:-}', '{v:7} - {v:2}', '{v:5}'],
          ['Multiplicação', '{k:*}', '{v:7} * {v:2}', '{v:14}'],
          ['Divisão', '{k:/}', '{v:7} / {v:2}', '{v:3.5}'],
          ['Resto', '{k:%}', '{v:7} % {v:2}', '{v:1}'],
        ],
        ts: [
          ['Soma', '{k:+}', '{v:7} + {v:2}', '{v:9}'],
          ['Subtração', '{k:-}', '{v:7} - {v:2}', '{v:5}'],
          ['Multiplicação', '{k:*}', '{v:7} * {v:2}', '{v:14}'],
          ['Divisão', '{k:/}', '{v:7} / {v:2}', '{v:3.5}'],
          ['Resto', '{k:%}', '{v:7} % {v:2}', '{v:1}'],
        ],
        java: [
          ['Soma', '{k:+}', '{v:7} + {v:2}', '{v:9}'],
          ['Subtração', '{k:-}', '{v:7} - {v:2}', '{v:5}'],
          ['Multiplicação', '{k:*}', '{v:7} * {v:2}', '{v:14}'],
          ['Divisão', '{k:/}', '{v:7} / {v:2}', '{v:3}'],
          ['Resto', '{k:%}', '{v:7} % {v:2}', '{v:1}'],
        ],
      },
      footnote: {
        js: 'No teclado não tem × nem ÷: multiplicação é * e divisão é /.',
        ts: 'No teclado não tem × nem ÷: multiplicação é * e divisão é /.',
        java: 'Em Java, 7 / 2 dá 3: inteiro dividido por inteiro dá inteiro.',
      },
      notes: [
        'Ler cada linha em voz alta: "sete mais dois dá nove"',
        '% não é porcentagem: é o resto da divisão (slide próprio daqui a pouco)',
        'Java: a divisão inteira é a pegadinha da aula, tem slide só para ela',
      ],
    },

    // 5 · E
    {
      id: 'abre-baus',
      kind: 'scene',
      depth: 'core',
      title: 'O operador abre os baús',
      description:
        'Os baús preco, com 10, e qtd, com 3, são abertos; o operador multiplica os itens e guarda 30 no novo baú total.',
      code: code.multiply,
      steps: [
        {
          caption: 'Dois baús com itens guardados.',
          lines: 2,
          activeLine: null,
          chests: [int('preco', '10'), int('qtd', '3')],
        },
        {
          caption: 'O * abre os dois baús e multiplica os itens.',
          lines: 3,
          activeLine: 3,
          chests: [int('preco', '10', { focus: 'item' }), int('qtd', '3', { focus: 'item' })],
        },
        {
          caption: 'O resultado vai para um baú novo: total.',
          chests: [int('preco', '10'), int('qtd', '3'), int('total', '30', { focus: 'item' })],
        },
        {
          caption: 'Os baús de origem continuam com os mesmos itens.',
          activeLine: null,
          chests: [int('preco', '10', { focus: 'item' }), int('qtd', '3', { focus: 'item' }), int('total', '30')],
        },
      ],
      notes: [
        'Ler a linha 3 da direita para a esquerda: primeiro calcula, depois guarda',
        'A conta usa uma cópia dos itens: preco e qtd não mudam',
        'Operandos podem ser baús (preco) ou valores escritos direto (10)',
      ],
    },

    // 6 · E
    {
      id: 'divisao',
      kind: 'scene',
      depth: 'core',
      title: 'Divisão: inteira ou decimal?',
      code: code.divide,
      steps: [
        {
          caption: {
            js: 'Sete dividido por dois dá 3.5, como na calculadora.',
            ts: 'Sete dividido por dois dá 3.5, como na calculadora.',
            java: 'Em Java, inteiro dividido por inteiro dá inteiro: a parte decimal é descartada.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: '3.5', ts: '3.5', java: '3' },
        },
        {
          caption: {
            js: 'Com 7.0 dá o mesmo: em JavaScript todo número é number.',
            ts: 'Com 7.0 dá o mesmo: em TypeScript todo número é number.',
            java: 'Basta um decimal na conta para o resultado ser decimal.',
          },
          lines: 2,
          activeLine: 2,
          output: { js: '3.5\n3.5', ts: '3.5\n3.5', java: '3\n3.5' },
        },
      ],
      notes: [
        'Java descarta a parte decimal, não arredonda: 9 / 10 dá 0',
        'Erro clássico em média e porcentagem',
        'JS/TS: para ficar só com a parte inteira, Math.floor (aprofundamento mais adiante)',
      ],
    },

    // 8 · E
    {
      id: 'resto',
      kind: 'expr',
      depth: 'core',
      title: 'O resto da divisão: %',
      description: 'A conta 17 % 5 é resolvida passo a passo até o resto 2. Depois, 10 % 2 dá 0.',
      steps: [
        { expr: '{v:17} % {v:5}', caption: 'O % divide e devolve o que sobra.' },
        { expr: '{v:17} - [[{v:5} * {v:3}]]', caption: 'O 5 cabe 3 vezes no 17.' },
        { expr: '[[{v:17} - {v:15}]]', caption: 'Tira o que coube…' },
        { expr: '{v:2}', result: true, caption: '…e sobra 2: esse é o resto.' },
        { expr: '{v:10} % {v:2}', reset: true, caption: 'E quando a divisão é exata?' },
        { expr: '{v:0}', result: true, caption: 'Resto 0: 10 é divisível por 2. Por isso 10 é par.' },
      ],
      notes: [
        'Conta de divisão do caderno: o % devolve o número que sobra embaixo',
        'Resto 0 = divisão exata; é o teste de par ou ímpar',
        'O resto é sempre menor que o divisor',
      ],
    },

    // 10 · E
    {
      id: 'precedencia',
      kind: 'expr',
      depth: 'core',
      title: 'Quem vem primeiro?',
      description: 'A conta 2 + 3 * 4 é resolvida com a multiplicação primeiro e dá 14.',
      steps: [
        { expr: '{v:2} + {v:3} * {v:4}', caption: 'Quanto dá: 20 ou 14?' },
        {
          expr: '{v:2} + [[{v:3} * {v:4}]]',
          replace: true,
          caption: 'Multiplicação vem antes da soma, como na matemática.',
        },
        { expr: '[[{v:2} + {v:12}]]', caption: 'Depois, a soma.' },
        { expr: '{v:14}', result: true, caption: 'Primeiro *, / e %; depois + e -.' },
      ],
      notes: [
        'Votação rápida: quem acha 20, quem acha 14?',
        'Quem respondeu 20 fez a conta da esquerda para a direita, sem prioridade',
        'É a mesma ordem da matemática da escola',
      ],
    },

    // 11 · E
    {
      id: 'parenteses',
      kind: 'expr',
      depth: 'core',
      title: 'Parênteses mandam',
      description: 'A conta (2 + 3) * 4 é resolvida com os parênteses primeiro e dá 20.',
      steps: [
        { expr: '({v:2} + {v:3}) * {v:4}', caption: 'E se a soma precisar vir primeiro?' },
        {
          expr: '[[({v:2} + {v:3})]] * {v:4}',
          replace: true,
          caption: 'O que está entre parênteses é calculado antes de tudo.',
        },
        { expr: '[[{v:5} * {v:4}]]', caption: 'Depois, o resto da conta.' },
        { expr: '{v:20}', result: true, caption: 'Na dúvida, use parênteses: deixam a intenção clara.' },
      ],
      notes: [
        'Exemplo real: média = (n1 + n2) / 2; sem parênteses, só n2 seria dividido',
        'Parênteses a mais não atrapalham e ajudam quem lê',
        'Parênteses dentro de parênteses: resolve de dentro para fora',
      ],
    },

    // 14 · E
    {
      id: 'atalhos',
      kind: 'scene',
      depth: 'core',
      title: 'Atalhos de atribuição',
      description: 'O baú saldo começa com 100, perde 30, dobra e é dividido por 4, terminando com 35.',
      code: code.shortcuts,
      steps: [
        {
          caption: 'O saldo começa em 100.',
          lines: 1,
          activeLine: 1,
          chests: [int('saldo', '100')],
        },
        {
          caption: 'saldo -= 30 é o mesmo que saldo = saldo - 30.',
          lines: 2,
          activeLine: 2,
          chests: [int('saldo', '70', { focus: 'item' })],
        },
        {
          caption: '*= multiplica e guarda no mesmo baú.',
          lines: 3,
          activeLine: 3,
          chests: [int('saldo', '140', { focus: 'item' })],
        },
        {
          caption: '/= divide e guarda. Também existe o %=.',
          lines: 4,
          activeLine: 4,
          chests: [int('saldo', '35', { focus: 'item' })],
        },
      ],
      notes: [
        'O atalho lê o baú, faz a conta e guarda de volta no mesmo baú',
        'Na aula anterior apareceram += e ++; todos os operadores têm atalho',
        'Pegadinha: x =- 3 não é atalho, guarda -3 em x',
      ],
    },

    // 23 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'Operadores', value: '{k:+ - * / %}', text: 'Somar, subtrair, multiplicar, dividir e resto.' },
        { title: 'Prioridade', value: '{k:* / %}', text: 'Vêm antes de + e -. Empate: da esquerda para a direita.' },
        { title: 'Parênteses', value: '{k:( )}', text: 'Calculados antes de tudo.' },
        { title: 'Atalhos', value: '{k:+= -= ++}', text: 'Fazem a conta e guardam no mesmo baú.' },
      ],
      notes: [
        'Pedir para a turma resolver de cabeça: (8 - 2) * 3 % 4',
        'Java: lembrar da divisão inteira',
        'Próxima aula: comparar valores e tomar decisões (condicionais)',
        'Abrir para perguntas',
      ],
    },
  ],
};
