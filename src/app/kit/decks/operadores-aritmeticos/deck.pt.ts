import type { ChestState, Deck } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 2 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/007 - Operadores Aritmeticos/context.md
// Metáfora da aula 1: baú = variável, etiqueta = nome, item = valor. O operador abre os baús,
// faz a conta com os itens e guarda o resultado em um baú.

/** Baú de inteiro aberto, com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });

/** Erro do TypeScript (TS2362) ao usar texto em conta de vezes. */
const TS_ARITHMETIC_ERROR =
  "error: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.";

/** Funções de Math em JS/TS (Java devolve double em floor, ceil e sqrt). */
const MATH_ROWS_JS = [
  ['Arredondar para baixo', '{f:Math.floor}({v:7.8})', '{v:7}'],
  ['Arredondar para cima', '{f:Math.ceil}({v:7.2})', '{v:8}'],
  ['Arredondar', '{f:Math.round}({v:7.5})', '{v:8}'],
  ['Tirar o sinal', '{f:Math.abs}({v:-3})', '{v:3}'],
  ['Raiz quadrada', '{f:Math.sqrt}({v:16})', '{v:4}'],
];

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

    // 3 · A
    {
      id: 'vocabulario',
      kind: 'cards',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Operando, operador, expressão',
      lead: 'Os nomes de cada parte de uma conta.',
      columns: 4,
      cards: [
        { title: 'Operando', value: '{v:7}', text: 'O valor que entra na conta.' },
        { title: 'Operador', value: '{k:+}', text: 'O símbolo que diz qual conta fazer.' },
        { title: 'Expressão', value: '{v:7} + {v:2}', text: 'Operandos e operadores juntos.' },
        { title: 'Resultado', value: '{v:9}', text: 'O valor que a expressão produz.' },
      ],
      notes: [
        'Esses nomes aparecem em mensagens de erro e na documentação',
        'Operadores aritméticos são binários: trabalham com dois operandos',
        'Toda expressão vira um valor, que pode ser guardado num baú',
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

    // 7 · A (só Java)
    {
      id: 'media-java',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'Média que perde a vírgula',
      description:
        'A média de 7 e 8 guardada em um int fica 7. Dividindo por 2.0 e guardando em um double, fica 7.5.',
      code: only.average,
      steps: [
        {
          caption: 'A média de 7 e 8 deveria ser 7.5…',
          lines: 1,
          activeLine: 1,
          chests: [int('media', '7', { focus: 'item', error: true })],
        },
        {
          caption: 'Com 2.0 a conta vira decimal, e o baú double guarda 7.5.',
          lines: 2,
          activeLine: 2,
          chests: [
            int('media', '7', { error: true }),
            chest('certa', 'decimal', { open: true, label: 'certa', item: '7.5', focus: 'item' }),
          ],
        },
      ],
      notes: [
        '15 / 2 é inteiro com inteiro: dá 7 antes mesmo de chegar ao baú',
        'Trocar só o baú não basta: double m = (7 + 8) / 2 guarda 7.0',
        'Outra saída: converter um operando, (double) soma / 2 (conversão de tipo, aula futura)',
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

    // 9 · A
    {
      id: 'usos-do-resto',
      kind: 'cards',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Para que serve o resto?',
      lead: 'O % aparece muito mais do que parece.',
      columns: 2,
      cards: [
        { title: 'Par ou ímpar', value: '{n:numero} % {v:2}', text: 'Resto 0 é par, resto 1 é ímpar.' },
        { title: 'Último algarismo', value: '{v:1234} % {v:10}', text: 'Dá 4: o que sobra ao dividir por 10.' },
        { title: 'Relógio', value: '{v:135} % {v:60}', text: '135 minutos: 2 horas e sobram 15.' },
        {
          title: 'A cada 3 vezes',
          value: '{n:vez} % {v:3}',
          text: 'Volta a 0 a cada três: bom para repetir algo de tempos em tempos.',
        },
      ],
      notes: [
        'Par ou ímpar vai aparecer de novo na aula de condicionais',
        'Relógio: depois de 59 vem 0, o resto "dá a volta"',
        'Pedir outro exemplo da turma: dias da semana (dia % 7)',
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

    // 12 · A
    {
      id: 'esquerda-direita',
      kind: 'expr',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Empate: da esquerda para a direita',
      description:
        'A conta 20 / 2 * 5 é resolvida da esquerda para a direita e dá 50. Depois, 10 - 4 - 3 dá 3.',
      steps: [
        { expr: '{v:20} / {v:2} * {v:5}', caption: '/ e * têm a mesma prioridade. Quem vai primeiro?' },
        {
          expr: '[[{v:20} / {v:2}]] * {v:5}',
          replace: true,
          caption: 'No empate, a conta anda da esquerda para a direita.',
        },
        { expr: '[[{v:10} * {v:5}]]' },
        { expr: '{v:50}', result: true, caption: 'Dá 50, e não 2.' },
        { expr: '[[{v:10} - {v:4}]] - {v:3}', reset: true, caption: 'Vale também para + e -.' },
        { expr: '[[{v:6} - {v:3}]]' },
        { expr: '{v:3}', result: true, caption: 'Dá 3, e não 9.' },
      ],
      notes: [
        'Quem respondeu 2 fez 2 * 5 primeiro',
        'Para mudar a ordem: 20 / (2 * 5)',
        'Exceção na curiosidade de potência: ** vai da direita para a esquerda',
      ],
    },

    // 13 · A
    {
      id: 'exercicio-prioridade',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Quanto vale r?',
      question: 'Depois das três linhas, quanto vale r?',
      code: code.predictPrecedence,
      options: ['25', '55', '50', '65'],
      answer: 1,
      explanation: '* e / primeiro: 20 * 3 = 60 e 10 / 2 = 5. Depois, 60 - 5 = 55.',
      trace: [
        { activeLine: 1, chests: [int('a', '20', { focus: 'item' })] },
        { activeLine: 2, chests: [int('a', '20'), int('b', '3', { focus: 'item' })] },
        {
          activeLine: 3,
          chests: [int('a', '20'), int('b', '3'), int('r', '55', { focus: 'item' })],
        },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        '25 é de quem fez da esquerda para a direita: (60 - 10) / 2',
        'Revelar linha a linha com a seta',
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

    // 15 · A
    {
      id: 'incremento',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: '++ antes ou depois?',
      description:
        'O baú a começa com 5. b recebe a++ e guarda 5 enquanto a vira 6. c recebe ++a e guarda 7, igual ao a.',
      code: code.increment,
      steps: [
        {
          caption: 'O baú a começa com 5.',
          lines: 1,
          activeLine: 1,
          chests: [int('a', '5')],
        },
        {
          caption: 'a++ entrega o valor antigo e só depois soma: b recebe 5.',
          lines: 2,
          activeLine: 2,
          chests: [int('a', '6', { focus: 'item' }), int('b', '5', { focus: 'item' })],
        },
        {
          caption: '++a soma primeiro e entrega o valor novo: c recebe 7.',
          lines: 3,
          activeLine: 3,
          chests: [int('a', '7', { focus: 'item' }), int('b', '5'), int('c', '7', { focus: 'item' })],
        },
      ],
      notes: [
        'Sozinho na linha (a++;), tanto faz a posição',
        'Dentro de outra expressão, faz diferença',
        'Muitas equipes evitam ++ no meio de expressões para não confundir',
        '-- funciona do mesmo jeito, subtraindo 1',
      ],
    },

    // 16 · A
    {
      id: 'exercicio-atalhos',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual o valor de x?',
      question: 'Depois das quatro linhas, quanto vale x?',
      code: code.predictShortcuts,
      options: ['50', '10', '2', '0'],
      answer: 1,
      explanation: 'x vira 10 (7 + 3), depois 2 (resto de 10 por 4) e por fim 10 (2 * 5).',
      trace: [
        { activeLine: 1, chests: [int('x', '7', { focus: 'item' })] },
        { activeLine: 2, chests: [int('x', '10', { focus: 'item' })] },
        { activeLine: 3, chests: [int('x', '2', { focus: 'item' })] },
        { activeLine: 4, chests: [int('x', '10', { focus: 'item' })] },
      ],
      notes: [
        'Pedir para a turma anotar o valor de x a cada linha',
        '50 é de quem esqueceu o %=',
        'Revelar linha a linha com a seta',
      ],
    },

    // 17 · A
    {
      id: 'concatenar',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'O + também junta textos',
      code: code.concat,
      steps: [
        {
          caption: 'Com texto de um lado, o + junta em vez de somar.',
          lines: 1,
          activeLine: 1,
          output: 'Nota: 7',
        },
        {
          caption: 'Da esquerda para a direita: "1" + 2 vira "12", e "12" + 3 vira "123".',
          lines: 2,
          activeLine: 2,
          output: 'Nota: 7\n123',
        },
        {
          caption: 'Aqui 1 + 2 é conta, e só depois o 3 é juntado como texto.',
          lines: 3,
          activeLine: 3,
          output: 'Nota: 7\n123\n33',
        },
      ],
      notes: [
        'Juntar textos tem nome: concatenar',
        'Mesma regra de esquerda para a direita do slide de prioridade',
        'Parênteses resolvem: "Total: " + (1 + 2) mostra Total: 3',
        '-, * e / não juntam textos',
      ],
    },

    // 18 · A (só JS/TS)
    {
      id: 'texto-em-conta',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'Texto no meio da conta',
      code: only.textMath,
      steps: [
        {
          caption: {
            js: 'Com *, o JavaScript tenta transformar o texto em número.',
            ts: 'TypeScript recusa antes de rodar: texto não entra em conta de vezes.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: '12', ts: TS_ARITHMETIC_ERROR },
          outputTone: { js: 'ok', ts: 'error' },
        },
        {
          caption: {
            js: 'Com +, o texto ganha: junta em vez de somar.',
            ts: 'Juntar textos com + continua permitido.',
          },
          lines: 2,
          activeLine: 2,
          output: { js: '12\n62', ts: '62' },
          outputTone: 'ok',
        },
        {
          caption: {
            js: 'Texto que não é número vira NaN: "não é um número".',
            ts: 'E "abc" * 2 também é recusado, antes de alguém usar o programa.',
          },
          lines: 3,
          activeLine: 3,
          output: { js: '12\n62\nNaN', ts: TS_ARITHMETIC_ERROR },
          outputTone: { js: 'ok', ts: 'error' },
        },
      ],
      notes: [
        'Coerção de tipo: o JavaScript converte sozinho, nem sempre como esperado',
        'NaN é do tipo number: typeof NaN responde "number"',
        'Para converter de propósito: Number("6")',
        'Bug clássico: valor de formulário chega como texto ("6" + 2 = "62")',
      ],
    },

    // 19 · A
    {
      id: 'dividir-por-zero',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'Dividir por zero',
      code: code.divideByZero,
      steps: [
        {
          caption: {
            js: 'Dividir por zero não trava o programa: dá Infinity.',
            ts: 'Dividir por zero não trava o programa: dá Infinity.',
            java: 'Com decimais, dividir por zero dá Infinity.',
          },
          lines: 1,
          activeLine: 1,
          output: 'Infinity',
        },
        {
          caption: 'Zero dividido por zero não tem resposta: NaN.',
          lines: 2,
          activeLine: 2,
          output: 'Infinity\nNaN',
        },
        {
          caption: {
            js: 'O resto da divisão por zero também é NaN.',
            ts: 'O resto da divisão por zero também é NaN.',
            java: 'Com inteiros, o Java para o programa com um erro.',
          },
          lines: 3,
          activeLine: 3,
          output: {
            js: 'Infinity\nNaN\nNaN',
            ts: 'Infinity\nNaN\nNaN',
            java: 'Infinity\nNaN\nException in thread "main" java.lang.ArithmeticException: / by zero',
          },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'NaN = Not a Number, "não é um número"',
        'Java: é erro com o programa rodando, o compilador não avisa',
        'Antes de dividir, conferir se o divisor é zero (aula de condicionais)',
      ],
    },

    // 20 · A
    {
      id: 'potencia',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'Potência',
      code: code.power,
      steps: [
        {
          caption: {
            js: '** eleva à potência: 2 elevado a 10.',
            ts: '** eleva à potência: 2 elevado a 10.',
            java: 'Java não tem operador de potência: usa Math.pow.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: '1024', ts: '1024', java: '1024.0' },
        },
        {
          caption: {
            js: 'Ao quadrado: 3 ** 2 é 3 * 3.',
            ts: 'Ao quadrado: 3 ** 2 é 3 * 3.',
            java: 'Math.pow sempre devolve double, por isso o .0.',
          },
          lines: 2,
          activeLine: 2,
          output: { js: '1024\n9', ts: '1024\n9', java: '1024.0\n9.0' },
        },
      ],
      notes: [
        '^ não é potência em nenhuma das três: 2 ^ 10 dá 8 (é outra operação, o XOR)',
        'JS/TS: ** vem antes de * e / e vai da direita para a esquerda: 2 ** 3 ** 2 = 2 ** 9',
        'JS/TS: -2 ** 2 é erro de sintaxe; escreva (-2) ** 2',
        'JS/TS: Math.pow também existe e funciona igual',
      ],
    },

    // 21 · A
    {
      id: 'math',
      kind: 'table',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Arredondar com Math',
      head: ['Para', 'Exemplo', 'Resultado'],
      rows: {
        js: MATH_ROWS_JS,
        ts: MATH_ROWS_JS,
        java: [
          ['Arredondar para baixo', '{f:Math.floor}({v:7.8})', '{v:7.0}'],
          ['Arredondar para cima', '{f:Math.ceil}({v:7.2})', '{v:8.0}'],
          ['Arredondar', '{f:Math.round}({v:7.5})', '{v:8}'],
          ['Tirar o sinal', '{f:Math.abs}({v:-3})', '{v:3}'],
          ['Raiz quadrada', '{f:Math.sqrt}({v:16})', '{v:4.0}'],
        ],
      },
      footnote: {
        js: 'Math já vem pronto na linguagem, sem instalar nada.',
        ts: 'Math já vem pronto na linguagem, sem instalar nada.',
        java: 'floor, ceil e sqrt devolvem double; round devolve um inteiro (long).',
      },
      notes: [
        'round arredonda o .5 para cima: Math.round(-2.5) dá -2 nas três linguagens',
        'Dinheiro: guardar o valor exato e arredondar só na hora de mostrar',
        'Casas decimais: toFixed(2) em JS/TS, String.format("%.2f", x) em Java',
      ],
    },

    // 22 · A
    {
      id: 'desafio-segundos',
      kind: 'scene',
      depth: 'extra',
      tag: 'Desafio',
      title: 'Segundos em minutos',
      description:
        'O baú total guarda 125. A divisão por 60 guarda 2 no baú min e o resto da divisão guarda 5 no baú seg.',
      code: code.seconds,
      steps: [
        {
          caption: 'Um vídeo tem 125 segundos. Quantos minutos e segundos?',
          lines: 1,
          activeLine: 1,
          chests: [int('total', '125')],
        },
        {
          caption: {
            js: 'Minutos: divide por 60 e descarta a parte decimal com Math.floor.',
            ts: 'Minutos: divide por 60 e descarta a parte decimal com Math.floor.',
            java: 'Minutos: inteiro dividido por inteiro já descarta a parte decimal.',
          },
          lines: 2,
          activeLine: 2,
          chests: [int('total', '125'), int('min', '2', { focus: 'item' })],
        },
        {
          caption: 'Segundos: o que sobra da divisão por 60.',
          lines: 3,
          activeLine: 3,
          chests: [int('total', '125'), int('min', '2'), int('seg', '5', { focus: 'item' })],
        },
        {
          caption: '125 segundos são 2 min e 5 s.',
          activeLine: null,
          chests: [
            int('total', '125'),
            int('min', '2', { focus: 'item' }),
            int('seg', '5', { focus: 'item' }),
          ],
        },
      ],
      notes: [
        'Pedir a solução para a turma antes da etapa 2',
        'A dupla / e % aparece sempre que se quebra uma quantidade em partes',
        'Extensão: 3725 segundos em horas, minutos e segundos (1 h 2 min 5 s)',
        'TS: min e seg não precisam do tipo escrito, ele vem da conta (inferência)',
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
        'Próxima aula: operadores relacionais, comparar valores e receber verdadeiro ou falso',
        'Abrir para perguntas',
      ],
    },
  ],
};
