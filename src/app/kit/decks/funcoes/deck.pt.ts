import type { BySyntax, Deck, StackFrame, StackState } from '../../kit.data';
import { code, only } from './code';

// Aula 9 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/012 - Funcoes/context.md
// Metáfora: cada chamada abre uma sala em cima da sala de quem chamou, com os próprios baús. O
// return entrega o valor para a sala de baixo e a sala de cima fecha. No Java, a sala de baixo é
// o main; no JS/TS, o próprio arquivo.

/** Linha `n` do JS/TS depois das funções; no Java, o `// no main` empurra uma linha para baixo. */
const M = (n: number): BySyntax<number> => ({ js: n, ts: n, java: n + 1 });

type Vars = [name: string, value: string][];
const vars = (list: Vars) => list.map(([name, value]) => ({ name, value }));

/**
 * Pilha: a sala de baixo (arquivo no JS/TS, `main` no Java) com os baús dela, as salas das
 * chamadas por cima e, opcionalmente, o valor que o `return` da sala do topo está entregando.
 */
const stack = (base: Vars, calls: [name: string, vars: Vars][] = [], returning?: string): BySyntax<StackState> => {
  const make = (bottom: StackFrame): StackState => ({
    frames: [bottom, ...calls.map(([name, v]) => ({ name, vars: vars(v) }))],
    ...(returning ? { returning } : {}),
  });
  return { js: make({ vars: vars(base) }), ts: make({ vars: vars(base) }), java: make({ name: 'main', vars: vars(base) }) };
};

const HELLO_TWICE = 'Olá!\nBem-vindo à aula\nOlá!\nBem-vindo à aula';
const TS_ORDER = "error: Argument of type 'number' is not assignable to parameter of type 'string'.";
const JAVA_ORDER = 'error: incompatible types: int cannot be converted to String';

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Funções',
      subtitle: 'Como dar nome a um trecho de código e usar de novo',
      notes: [
        'Retomar a tabuada e a média das aulas 7 e 8: e se precisar delas em dez lugares do programa?',
        'Pergunta de abertura: que tarefas você faz "no automático", sem pensar nos passos? Fazer café, amarrar o tênis',
        'Hoje: a função, um trecho com nome que roda quando é chamado',
      ],
    },

    // 2 · E
    {
      id: 'problema',
      kind: 'scene',
      depth: 'core',
      title: 'O mesmo trecho em vários lugares',
      code: code.repeated,
      steps: [
        {
          caption: 'Cumprimentar a turma três vezes, copiando as mesmas duas linhas.',
          activeLine: 2,
          output: 'Olá!\nBem-vindo à aula',
        },
        {
          caption: 'Funciona, mas trocar a mensagem é trocar em três lugares. E se esquecer um?',
          activeLine: 6,
          output: `${HELLO_TWICE}\nOlá!\nBem-vindo à aula`,
        },
      ],
      notes: [
        'Copiar e colar código é o sinal de que falta uma função',
        'Num programa de verdade, o mesmo trecho aparece em dezenas de lugares',
        'Princípio DRY (Don\'t Repeat Yourself): não se repita',
      ],
    },

    // 3 · E
    {
      id: 'declarar-e-chamar',
      kind: 'scene',
      depth: 'core',
      title: 'Declarar e chamar',
      description:
        'A pilha de chamadas: cada saudar() abre uma sala em cima da sala de baixo, roda as duas linhas e fecha.',
      code: code.greet,
      steps: [
        {
          caption: {
            js: 'function dá um nome ao trecho. Declarar não roda nada: o trecho fica guardado.',
            ts: 'function dá um nome ao trecho. Declarar não roda nada: o trecho fica guardado.',
            java: 'Em Java, a função se chama método. Declarar não roda nada: o trecho fica guardado.',
          },
          activeLine: 1,
          stack: stack([]),
        },
        {
          caption: 'saudar() chama a função: abre uma sala em cima e roda o que está dentro.',
          activeLine: M(5),
          stack: stack([], [['saudar', []]]),
        },
        {
          caption: 'Roda as duas linhas da função…',
          activeLine: 3,
          output: 'Olá!\nBem-vindo à aula',
        },
        {
          caption: '…fecha a sala e volta para a linha seguinte. A segunda chamada faz tudo de novo.',
          activeLine: M(6),
          stack: stack([]),
          output: HELLO_TWICE,
        },
      ],
      notes: [
        'Os parênteses depois do nome são a chamada: saudar sem () não roda nada',
        'Trocar a mensagem agora é trocar em um lugar só',
        'O nome da função é um verbo: saudar, calcular, mostrar',
        'Java: static void saudar(); o void e o static aparecem no próximo slide',
      ],
    },

    // 4 · E
    {
      id: 'onde-mora',
      kind: 'scene',
      depth: 'core',
      title: 'Onde a função mora',
      code: code.wholeFile,
      steps: [
        {
          caption: {
            js: 'O arquivo inteiro: o JavaScript roda de cima para baixo, a partir da primeira linha.',
            ts: 'O arquivo inteiro: o TypeScript roda de cima para baixo, a partir da primeira linha.',
            java: 'O arquivo inteiro. O programa começa no main, uma função que a JVM chama sozinha.',
          },
          activeLine: { js: 1, ts: 1, java: 6 },
          stack: stack([]),
        },
        {
          caption: {
            js: 'A declaração é pulada: a função só roda quando a linha da chamada chega.',
            ts: 'A declaração é pulada: a função só roda quando a linha da chamada chega.',
            java: 'Surpresa: todo o código das aulas 1 a 8 morava aqui, dentro do main.',
          },
          activeLine: { js: 4, ts: 4, java: 7 },
          skip: { js: [2], ts: [2], java: [] },
        },
        {
          caption: {
            js: 'Não existe main: as chamadas ficam soltas no arquivo.',
            ts: 'Não existe main: as chamadas ficam soltas no arquivo.',
            java: 'As nossas funções ficam ao lado do main, dentro da class Aula, e levam static como ele.',
          },
          activeLine: { js: 2, ts: 2, java: 3 },
          skip: [],
          stack: stack([], [['saudar', []]]),
          output: 'Olá!',
        },
        {
          caption: {
            js: 'Nos próximos slides, o arquivo aparece igual: funções em cima, chamadas embaixo.',
            ts: 'Nos próximos slides, o arquivo aparece igual: funções em cima, chamadas embaixo.',
            java: 'Daqui em diante: as funções em cima e, depois de // no main, o que fica dentro do main.',
          },
          activeLine: null,
          stack: stack([]),
        },
      ],
      notes: [
        'Java: todo programa tem uma class (com o nome do arquivo: Aula.java, class Aula) e um main; até a aula 8 os slides mostravam só o miolo do main',
        'public static void main(String[] args): a JVM procura exatamente esse nome para começar',
        'static: por enquanto, toda função nossa leva static, como o main; o porquê fica para a aula de objetos',
        'String[] args é o parâmetro do main (o array da curiosidade da aula 7): o que se digita depois do nome do programa no terminal',
        'JS/TS: não tem main; o arquivo roda de cima para baixo e a função só roda quando é chamada',
      ],
    },

    // 5 · E
    {
      id: 'parametros',
      kind: 'scene',
      depth: 'core',
      title: 'Parâmetros: o que a função recebe',
      description: 'Cada chamada abre a sala de saudar com o baú nome valendo o que foi passado: Ana, depois Bia.',
      code: code.params,
      steps: [
        {
          caption: {
            js: 'nome é um parâmetro: um baú que recebe um valor a cada chamada.',
            ts: 'nome é um parâmetro, com o tipo: nome: string. Recebe um valor a cada chamada.',
            java: 'nome é um parâmetro, com o tipo antes: String nome. Recebe um valor a cada chamada.',
          },
          activeLine: 1,
          stack: stack([]),
        },
        {
          caption: 'saudar("Ana"): a sala abre com o baú nome valendo "Ana".',
          activeLine: 2,
          stack: stack([], [['saudar', [['nome', '"Ana"']]]]),
          output: 'Olá, Ana!',
        },
        {
          caption: 'Na segunda chamada, a sala é nova e o baú vale "Bia". Uma função, várias mensagens.',
          activeLine: 2,
          stack: stack([], [['saudar', [['nome', '"Bia"']]]]),
          output: 'Olá, Ana!\nOlá, Bia!',
        },
      ],
      notes: [
        'Parâmetro: o nome na declaração (nome). Argumento: o valor na chamada ("Ana")',
        'O parâmetro é uma variável que já nasce com o valor da chamada',
        'TS e Java pedem o tipo do parâmetro, como nas variáveis da aula 1',
      ],
    },

    // 6 · A
    {
      id: 'ordem-dos-argumentos',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'A ordem dos argumentos',
      code: code.order,
      steps: [
        {
          caption: 'Os argumentos entram na ordem dos parâmetros: o primeiro vai para nome, o segundo para idade.',
          activeLine: M(4),
        },
        {
          caption: {
            js: 'Trocados, o JavaScript aceita e imprime a frase errada, sem avisar.',
            ts: 'Trocados, o TypeScript recusa antes de rodar: 16 não é texto.',
            java: 'Trocados, o Java nem compila: um int não vira String.',
          },
          activeLine: M(4),
          output: { js: '16 tem Ana anos', ts: TS_ORDER, java: JAVA_ORDER },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
      ],
      notes: [
        'A ordem é tudo: o nome do parâmetro não ajuda na chamada',
        'Os tipos (TS e Java) pegam o erro antes de o programa rodar',
        'Com o mesmo tipo (dois textos), nem o TS nem o Java percebem a troca: cuidado',
      ],
    },

    // 7 · E
    {
      id: 'return',
      kind: 'scene',
      depth: 'core',
      title: 'return: a resposta da função',
      description: 'A sala de dobro abre com n = 4, devolve 8 e fecha; o 8 cai no baú resultado da sala de baixo.',
      code: code.double,
      steps: [
        {
          caption: {
            js: 'return devolve um valor para quem chamou.',
            ts: 'return devolve um valor; o : number depois dos parênteses é o tipo da resposta.',
            java: 'return devolve um valor; o int antes do nome é o tipo da resposta.',
          },
          activeLine: 1,
          stack: stack([]),
        },
        {
          caption: 'dobro(4) abre a sala com n valendo 4. return n * 2 entrega 8…',
          activeLine: 2,
          stack: stack([], [['dobro', [['n', '4']]]], '8'),
        },
        {
          caption: '…a sala fecha e o 8 fica no lugar da chamada: resultado recebe 8.',
          activeLine: M(5),
          stack: stack([['resultado', '8']]),
          output: '8',
        },
      ],
      notes: [
        'A chamada vira o valor devolvido: let resultado = dobro(4) é o mesmo que let resultado = 8',
        'Imprimir dentro da função não é devolver: o return permite usar o valor em outra conta',
        'Comparar com a calculadora: você digita, ela devolve o resultado, e você decide o que fazer com ele',
      ],
    },

    // 8 · A
    {
      id: 'exercicio-quanto-da',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Quanto dá?',
      question: 'O que aparece na tela?',
      code: code.doubleTwice,
      options: ['6', '9', '12', '3'],
      answer: 2,
      explanation: 'A chamada de dentro responde primeiro: dobro(3) dá 6, e dobro(6) dá 12.',
      trace: [
        { activeLine: 2, stack: stack([], [['dobro', [['n', '3']]]], '6') },
        { activeLine: 2, stack: stack([], [['dobro', [['n', '6']]]], '12') },
        { activeLine: M(4), stack: stack([]), output: '12' },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Como nas contas da aula 2: os parênteses de dentro primeiro',
        'Quem marcou 6 parou na primeira chamada',
      ],
    },

    // 9 · A
    {
      id: 'chama-outra',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Uma função chama outra',
      description: 'A pilha chega a três salas: arquivo ou main, media e somar. somar devolve 16 para media, que devolve 8.',
      code: code.callsOther,
      steps: [
        {
          caption: 'media(7, 9) abre uma sala em cima da de baixo.',
          activeLine: M(8),
          stack: stack([], [['media', [['a', '7'], ['b', '9']]]]),
        },
        {
          caption: 'Dentro dela, somar(a, b) abre outra sala por cima. A pilha cresce.',
          activeLine: 2,
          stack: stack([], [['media', [['a', '7'], ['b', '9']]], ['somar', [['a', '7'], ['b', '9']]]], '16'),
        },
        {
          caption: 'somar devolve 16 e fecha. media continua de onde parou, com soma valendo 16.',
          activeLine: 6,
          stack: stack([], [['media', [['a', '7'], ['b', '9'], ['soma', '16']]]], '8'),
        },
        {
          caption: 'media devolve 8 e fecha. A pilha desce até a sala de baixo.',
          activeLine: M(8),
          stack: stack([]),
          output: '8',
        },
      ],
      notes: [
        'A pilha de chamadas: sempre volta para quem chamou, na ordem inversa',
        'a e b de media e a e b de somar são baús diferentes, em salas diferentes',
        'O nome técnico é call stack; aparece nas mensagens de erro (o "stack trace" do Java)',
        'Curiosidade: uma função pode chamar a si mesma (recursão), e a pilha cresce a cada chamada',
      ],
    },

    // 10 · A
    {
      id: 'return-encerra',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'return encerra a função',
      code: code.afterReturn,
      steps: [
        {
          caption: 'O return devolve o valor e sai da função na hora.',
          activeLine: 2,
        },
        {
          caption: {
            js: 'A linha depois do return nunca roda. O JavaScript não reclama: só imprime 8.',
            ts: 'A linha depois do return nunca roda. O tsc não reclama: o editor só deixa a linha apagada.',
            java: 'A linha depois do return nunca roda, e o Java não aceita código que nunca roda.',
          },
          activeLine: 3,
          skip: { js: [3], ts: [3], java: [] },
          output: { js: '8', ts: '8', java: 'error: unreachable statement' },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'Depois do return, a função acabou: o que vem embaixo é código morto',
        'É útil para sair cedo: if (nota < 0) return "inválida"; (slide 19)',
        'TS: o aviso "Unreachable code detected" (7027) vira erro com a opção allowUnreachableCode: false',
      ],
    },

    // 11 · A
    {
      id: 'sem-resposta',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Função sem resposta',
      code: code.noAnswer,
      steps: [
        {
          caption: {
            js: 'saudar não tem return. O que aparece ao imprimir o resultado dela?',
            ts: 'saudar não tem return: o tipo da resposta é void (vazio). E ao imprimir o resultado?',
            java: 'saudar não tem return: o tipo da resposta é void (vazio). E ao imprimir o resultado?',
          },
          activeLine: M(4),
        },
        {
          caption: {
            js: 'Imprime o Olá! e depois undefined: sem return, a função devolve undefined.',
            ts: 'Imprime o Olá! e depois undefined: void devolve undefined.',
            java: 'O Java não deixa: void não é um valor que dá para imprimir.',
          },
          activeLine: M(4),
          output: { js: 'Olá!\nundefined', ts: 'Olá!\nundefined', java: "error: 'void' type not allowed here" },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'Funções que só fazem algo (imprimir, salvar) não precisam devolver nada',
        'undefined é o "nada" do JavaScript (apareceu na aula 7, ao ler fora da lista)',
        'Java: void obriga a decidir na declaração se a função responde ou não',
      ],
    },

    // 12 · E
    {
      id: 'escopo',
      kind: 'scene',
      depth: 'core',
      title: 'O que nasce na função fica na função',
      description: 'A sala de media tem o baú total. Quando a sala fecha, o baú vai junto, e fora dela total não existe.',
      code: code.scope,
      steps: [
        {
          caption: 'total nasce dentro de media, na sala dela.',
          activeLine: 2,
          stack: stack([], [['media', [['a', '7'], ['b', '9'], ['total', '16']]]]),
        },
        {
          caption: 'A função devolve 8 e a sala fecha, levando o baú total.',
          activeLine: M(5),
          stack: stack([]),
          output: { js: '8', ts: '', java: '' },
        },
        {
          caption: {
            js: 'Fora da função, total não existe: o programa para com um erro.',
            ts: 'Fora da função, total não existe. O TypeScript avisa antes de rodar.',
            java: 'Fora da função, total não existe. O Java nem compila.',
          },
          activeLine: M(6),
          output: {
            js: '8\nReferenceError: total is not defined',
            ts: "error: Cannot find name 'total'.",
            java: 'error: cannot find symbol',
          },
          outputTone: 'error',
        },
      ],
      notes: [
        'Escopo: o pedaço do código onde um nome existe',
        'Variáveis de dentro da função são locais: nascem na chamada e somem no fim',
        'Para levar o valor para fora, só pelo return',
        'Vantagem: dá para usar o nome total em outras funções sem uma atrapalhar a outra',
      ],
    },

    // 13 · A
    {
      id: 'cada-chamada',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Cada chamada tem os próprios baús',
      description: 'Dois baús chamados n, um em cada sala: o de dentro vira 10, o de fora continua 5.',
      code: code.ownChests,
      steps: [
        {
          caption: 'Um n na sala de baixo, valendo 5.',
          activeLine: M(5),
          stack: stack([['n', '5']]),
        },
        {
          caption: 'dobrar(n) abre outra sala com outro n, que recebe uma cópia do 5.',
          activeLine: 1,
          stack: stack([['n', '5']], [['dobrar', [['n', '5']]]]),
        },
        {
          caption: 'Mudar o n de dentro não mexe no de fora.',
          activeLine: 3,
          stack: stack([['n', '5']], [['dobrar', [['n', '10']]]], '10'),
        },
        {
          caption: 'A sala fecha: o n de fora continua 5, e r recebe 10.',
          activeLine: M(7),
          stack: stack([['n', '5'], ['r', '10']]),
          output: '5 e 10',
        },
      ],
      notes: [
        'O parâmetro recebe uma cópia do valor (números, textos, booleanos)',
        'Mesmo nome não é mesmo baú: cada sala tem os seus',
        'Listas são diferentes: a função recebe a mesma lista, e mudar a lista lá dentro muda a de fora (slide 15)',
      ],
    },

    // 14 · E
    {
      id: 'sim-ou-nao',
      kind: 'scene',
      depth: 'core',
      title: 'Função que responde sim ou não',
      description: 'podeVotar recebe idade 17 e devolve true; o if da sala de baixo usa a resposta.',
      code: code.canVote,
      steps: [
        {
          caption: {
            js: 'A resposta pode ser true ou false: return idade >= 16 (aula 4).',
            ts: 'A resposta pode ser true ou false: o tipo é boolean (aula 4).',
            java: 'A resposta pode ser true ou false: o tipo é boolean (aula 4).',
          },
          activeLine: 2,
          stack: stack([], [['podeVotar', [['idade', '17']]]], 'true'),
        },
        {
          caption: 'pode recebe true, e o if (aula 5) decide o caminho.',
          activeLine: M(6),
          skip: { js: [8], ts: [8], java: [9] },
          stack: stack([['pode', 'true']]),
          output: 'Pode votar',
        },
      ],
      notes: [
        'Nome de função que responde sim ou não costuma começar com pode, é, tem: podeVotar, ehPar, temSaldo',
        'Dá para usar direto: if (podeVotar(17))',
        'A regra fica num lugar só: se a idade mínima mudar, muda só a função',
      ],
    },

    // 15 · A
    {
      id: 'lista-e-laco',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Função com lista e laço',
      description: 'O gaveteiro notas entra na sala de media; o laço soma 24 e a função devolve 8.',
      code: code.average,
      steps: [
        {
          caption: {
            js: 'A lista inteira entra como um parâmetro só.',
            ts: 'A lista inteira entra como um parâmetro só: notas: number[].',
            java: 'A lista inteira entra como um parâmetro só: List<Integer> notas.',
          },
          activeLine: 1,
          list: { name: 'notas', items: [{ id: '7', value: '7' }, { id: '9', value: '9' }, { id: '8', value: '8' }] },
          stack: stack([], [['media', [['soma', '0']]]]),
        },
        {
          caption: 'Lá dentro, o acumulador da aula 8 soma as notas.',
          activeLine: 4,
          list: { name: 'notas', items: [{ id: '7', value: '7' }, { id: '9', value: '9' }, { id: '8', value: '8' }], focus: 2 },
          stack: stack([], [['media', [['soma', '24']]]], '8'),
        },
        {
          caption: 'media devolve 24 / 3 = 8. A mesma função serve para qualquer lista de notas.',
          activeLine: M(8),
          list: null,
          stack: stack([]),
          output: '8',
        },
      ],
      notes: [
        'Juntou as aulas 7 (lista), 8 (laço e acumulador) e 9 (função)',
        'Java: int / int dá int; 24 / 3 é exato, mas 25 / 3 daria 8 (aula 2)',
        'Cuidado: a lista não é copiada. Se a função fizer notas.push(10), a lista de fora muda',
        'Agora que a turma sabe passar valores para funções: map, filter e forEach recebem uma função como argumento',
      ],
    },

    // 16 · A
    {
      id: 'funcao-dentro',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Função dentro de função',
      code: code.nested,
      steps: [
        {
          caption: {
            js: 'Uma função pode morar dentro de outra: somar só existe dentro de media.',
            ts: 'Uma função pode morar dentro de outra: somar só existe dentro de media.',
            java: 'E se a função for declarada dentro do main?',
          },
          activeLine: { js: 2, ts: 2, java: 3 },
        },
        {
          caption: {
            js: 'A de dentro enxerga a e b da função de fora.',
            ts: 'A de dentro enxerga a e b da função de fora.',
            java: 'Não compila: em Java, método mora na classe, nunca dentro de outro método.',
          },
          activeLine: { js: 5, ts: 5, java: 3 },
          output: { js: '8', ts: '8', java: 'error: illegal start of expression' },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'JS/TS: útil para um ajudante que só faz sentido lá dentro',
        'Java: por isso as funções ficam ao lado do main (slide 4)',
        'Java tem lambdas, que podem ficar dentro de um método: assunto para depois',
      ],
    },

    // 17 · A (só Java)
    {
      id: 'sobrecarga',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['java'],
      title: 'Mesmo nome, parâmetros diferentes',
      code: only.overload,
      steps: [
        {
          caption: 'Dois métodos somar: um com 2 parâmetros, outro com 3.',
          activeLine: 4,
        },
        {
          caption: 'O Java escolhe pela quantidade e pelo tipo dos argumentos. Isso é sobrecarga.',
          activeLine: 9,
          output: '3\n6',
        },
      ],
      notes: [
        'O System.out.println é sobrecarregado: uma versão para int, outra para String, outra para boolean...',
        'Em JavaScript, a segunda declaração apaga a primeira; somar(1, 2) daria NaN (c fica undefined)',
        'No TypeScript, as duas declarações dão erro: Duplicate function implementation (TS2393)',
      ],
    },

    // 18 · A (só JS/TS)
    {
      id: 'arrow',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'Função numa variável',
      code: only.arrow,
      steps: [
        {
          caption: 'A arrow function (função seta) é um jeito curto de escrever a função dobro do slide 7.',
          activeLine: 1,
        },
        {
          caption: 'Com uma linha só, o return fica subentendido. A chamada é igual.',
          activeLine: 2,
          stack: stack([], [['dobro', [['n', '4']]]], '8'),
        },
        {
          caption: 'Resultado: 8, como antes.',
          stack: stack([]),
          output: '8',
        },
      ],
      notes: [
        'Muito usada em JS/TS para funções curtas',
        'É o formato que aparece no map e no filter: notas.filter((n) => n >= 7)',
        'Como fica numa variável const, só pode ser chamada depois da linha em que foi criada',
      ],
    },

    // 19 · A
    {
      id: 'exercicio-classificar',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Escolha a nota',
      lead: 'Troque a nota passada para a função e veja o que ela devolve.',
      variable: 'nota',
      code: code.classify,
      stack: {
        js: { frames: [{}, { name: 'classificar', vars: [{ name: 'nota', value: '' }] }] },
        ts: { frames: [{}, { name: 'classificar', vars: [{ name: 'nota', value: '' }] }] },
        java: { frames: [{ name: 'main' }, { name: 'classificar', vars: [{ name: 'nota', value: '' }] }] },
      },
      choices: [
        { value: '9', output: 'Aprovado', returns: '"Aprovado"' },
        { value: '7', output: 'Aprovado', returns: '"Aprovado"' },
        { value: '6', output: 'Recuperação', returns: '"Recuperação"' },
        { value: '3', output: 'Reprovado', returns: '"Reprovado"' },
      ],
      goals: ['Recuperação', 'Reprovado', 'Aprovado'],
      notes: [
        'Cada return sai da função na hora: com 9, as linhas de baixo nem rodam',
        'O último return não precisa de else: só chega lá quem não saiu antes',
        'Pergunta: e com 7? Aprovado, porque 7 >= 7 é true (aula 3)',
      ],
    },

    // 20 · A
    {
      id: 'exercicio-devolve',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Devolve ou só faz?',
      lead: 'Esta função precisa devolver um valor ou só faz alguma coisa?',
      bins: [
        { id: 'devolve', shape: 'text', label: 'Devolve (return)' },
        { id: 'faz', shape: 'text', label: { js: 'Só faz (sem return)', ts: 'Só faz (void)', java: 'Só faz (void)' } },
      ],
      items: [
        { value: 'Calcular o frete', bin: 'devolve' },
        { value: 'Dizer se é maior de idade', bin: 'devolve' },
        { value: 'Converter °C em °F', bin: 'devolve' },
        { value: 'Mostrar o menu', bin: 'faz' },
        { value: 'Imprimir o recibo', bin: 'faz' },
        { value: 'Tocar um alarme', bin: 'faz' },
      ],
      notes: [
        'Pergunta-chave: quem chamou vai usar a resposta numa conta, num if ou numa variável?',
        'Calcular e decidir costumam devolver; mostrar e avisar costumam só fazer',
        'Discussão: "imprimir o recibo" poderia devolver true se deu certo?',
      ],
    },

    // 21 · A
    {
      id: 'ariane-5',
      kind: 'cards',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'O foguete que reaproveitou uma função',
      lead: 'Em 4 de junho de 1996, o primeiro Ariane 5, da Agência Espacial Europeia, se destruiu cerca de 40 segundos depois da decolagem.',
      cards: [
        { title: 'A função', value: '{v:64} bits → {v:16} bits', text: 'Vinha do Ariane 4 e convertia a velocidade horizontal num inteiro de 16 bits.' },
        { title: 'O problema', value: '{t:Ariane} {v:5}', text: 'O foguete novo era mais rápido: o valor não cabia, e o sistema de navegação parou.' },
        { title: 'A lição', value: '{f:reaproveitar}()', text: 'Reaproveitar função é ótimo, desde que ela sirva para os valores novos.' },
      ],
      notes: [
        'Voo 501: o computador de navegação recebeu o erro da conversão como se fosse dado de voo e virou o foguete',
        'A função nem era necessária depois da decolagem no Ariane 5; ficou porque funcionava no Ariane 4',
        'O relatório da comissão de investigação é público (relatório Lions, julho de 1996)',
        'Moral: teste a função com os valores do caso novo, inclusive os extremos',
      ],
    },

    // 22 · E
    {
      id: 'tabuada',
      kind: 'scene',
      depth: 'core',
      title: 'Desafio: a tabuada vira função',
      description: 'A sala de tabuada abre com n = 7 e depois com n = 3; o mesmo laço imprime as duas tabuadas.',
      code: code.table,
      steps: [
        {
          caption: 'O laço da aula 8 dentro de uma função: o n vem de fora.',
          activeLine: M(6),
          stack: stack([], [['tabuada', [['n', '7']]]]),
          output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21',
        },
        {
          caption: 'Outra tabuada, uma linha só. Desafio: escrever areaRetangulo(base, altura).',
          activeLine: M(7),
          stack: stack([], [['tabuada', [['n', '3']]]]),
          output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9',
        },
      ],
      notes: [
        'Junta tudo: variável, operadores, condição, laço e função',
        'Desafio: areaRetangulo(base, altura) devolve base * altura; testar com 3 e 4 (12)',
        'Desafio extra: tabuada(n, ate), com o fim do laço como segundo parâmetro',
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
        { title: 'Declarar e chamar', value: '{f:saudar}();', text: 'Declarar guarda o trecho; chamar roda.' },
        { title: 'Parâmetros', value: '{f:saudar}({v:"Ana"})', text: 'O que a função recebe, na ordem.' },
        { title: 'return', value: '{k:return} {n:n} * {v:2};', text: 'A resposta, que volta para quem chamou.' },
        {
          title: 'Escopo',
          value: { js: '{k:let} {n:total}', ts: '{k:let} {n:total}', java: '{t:int} {n:total}' },
          text: 'O que nasce na função fica na função.',
        },
      ],
      notes: [
        'Java: o main é uma função; as nossas ficam ao lado dele, com static',
        'Pedir para a turma transformar um exercício de uma aula anterior em função (par ou ímpar, maior valor)',
        'Próxima etapa da trilha: objetos, onde o static vai embora',
        'Abrir para perguntas',
      ],
    },
  ],
};
