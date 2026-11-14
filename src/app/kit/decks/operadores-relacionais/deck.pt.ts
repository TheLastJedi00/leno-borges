import type { ChestState, Deck } from '../../kit.data';
import { chest } from '../chests';
import { code } from './code';

// Aula 3 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md
// Metáfora: a balança compara os itens de dois baús e responde true ou false, um item que cabe
// num baú de verdadeiro/falso.

/** Baú aberto com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });
const bool = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'bool', { open: true, label: id, item, ...extra });

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

    // 2 · E
    {
      id: 'perguntas',
      kind: 'cards',
      depth: 'core',
      title: 'Perguntas de sim ou não',
      lead: 'Programas comparam valores o tempo todo, e a resposta é sempre sim ou não.',
      cards: [
        { title: 'Tem 18 anos ou mais?', value: '{n:idade} >= {v:18}', text: 'Libera o cadastro.' },
        { title: 'O saldo cobre a compra?', value: '{n:saldo} >= {v:50}', text: 'Aprova o pagamento.' },
        {
          title: 'O PIN confere?',
          value: { js: '{n:pin} === {v:1234}', ts: '{n:pin} === {v:1234}', java: '{n:pin} == {v:1234}' },
          text: 'Desbloqueia o celular.',
        },
      ],
      notes: [
        'Pedir exemplos da turma: login, idade mínima, estoque, nota de aprovação',
        'A resposta não é um número nem um texto: é verdadeiro ou falso',
        'Lembrar da aula 1: o baú de formato verdadeiro/falso (boolean)',
      ],
    },

    // 3 · E
    {
      id: 'balanca',
      kind: 'scene',
      depth: 'core',
      title: 'A balança',
      description:
        'Uma balança recebe o item 20, do baú idade, e o valor 18. Com o operador maior ou igual no centro, ela pende para o 20 e responde true. Com 15, responde false.',
      steps: [
        {
          caption: 'A balança põe um item em cada prato e faz a pergunta do centro.',
          compare: { left: '20', leftLabel: 'idade', op: '>=', right: '18' },
        },
        {
          caption: '20 é maior ou igual a 18? A balança responde: true.',
          compare: { left: '20', leftLabel: 'idade', op: '>=', right: '18', result: true },
        },
        {
          caption: 'Com 15 no prato, a resposta muda: false.',
          compare: { left: '15', leftLabel: 'idade', op: '>=', right: '18', result: false },
        },
      ],
      notes: [
        'O operador relacional é a pergunta; a balança é quem responde',
        'A resposta é só true ou false, nunca "mais ou menos"',
        'Os itens não mudam: comparar não altera os baús',
      ],
    },

    // 4 · E
    {
      id: 'seis-operadores',
      kind: 'cards',
      depth: 'core',
      title: 'Os seis operadores',
      lead: 'Cada um faz uma pergunta diferente sobre dois valores.',
      columns: 3,
      cards: [
        { title: 'Maior que', value: '{v:7} > {v:2}', text: 'true' },
        { title: 'Menor que', value: '{v:7} < {v:2}', text: 'false' },
        { title: 'Maior ou igual', value: '{v:7} >= {v:7}', text: 'true' },
        { title: 'Menor ou igual', value: '{v:8} <= {v:7}', text: 'false' },
        {
          title: 'Igual',
          value: { js: '{v:7} === {v:7}', ts: '{v:7} === {v:7}', java: '{v:7} == {v:7}' },
          text: 'true',
        },
        {
          title: 'Diferente',
          value: { js: '{v:7} !== {v:2}', ts: '{v:7} !== {v:2}', java: '{v:7} != {v:2}' },
          text: 'true',
        },
      ],
      notes: [
        'Ler em voz alta: "sete é maior que dois? Verdadeiro"',
        '>= e <= se escrevem sempre com o sinal de igual depois (=> é outra coisa)',
        'JS/TS: igual tem três sinais (===); Java usa dois (==). Slide próprio daqui a pouco',
      ],
    },

    // 5 · E
    {
      id: 'resposta-no-bau',
      kind: 'scene',
      depth: 'core',
      title: 'A resposta vai para um baú',
      description:
        'O baú maior guarda true quando idade é 20. Quando idade passa a 15, a mesma comparação guarda false.',
      code: code.store,
      steps: [
        {
          caption: 'O baú idade guarda 20.',
          lines: 1,
          activeLine: 1,
          chests: [int('idade', '20')],
        },
        {
          caption: 'A comparação responde true, e a resposta vai para o baú maior.',
          lines: 2,
          activeLine: 2,
          chests: [int('idade', '20'), bool('maior', 'true', { focus: 'item' })],
        },
        {
          caption: 'Muda a idade…',
          lines: 3,
          activeLine: 3,
          chests: [int('idade', '15', { focus: 'item' }), bool('maior', 'true')],
        },
        {
          caption: '…e a mesma pergunta agora responde false.',
          lines: 4,
          activeLine: 4,
          chests: [int('idade', '15'), bool('maior', 'false', { focus: 'item' })],
        },
      ],
      notes: [
        'Primeiro compara, depois guarda (direita para a esquerda, como nas contas)',
        'O baú maior não acompanha a idade sozinho: só muda quando a linha roda de novo',
        'Nome de baú booleano soa como pergunta: maior, aprovado, temSaldo',
      ],
    },

    // 6 · E
    {
      id: 'borda',
      kind: 'expr',
      depth: 'core',
      title: 'A borda: > ou >=?',
      description: 'A conta 18 > 18 dá false. Já 18 >= 18 dá true.',
      steps: [
        { expr: '{v:18} > {v:18}', caption: 'Quem tem exatamente 18 anos passa no > 18?' },
        { expr: '{v:false}', result: true, caption: 'Não: 18 não é maior que 18.' },
        { expr: '{v:18} >= {v:18}', reset: true, caption: 'Com >=, o igual também conta.' },
        { expr: '{v:true}', result: true, caption: 'Na dúvida, teste o valor da borda.' },
      ],
      notes: [
        '"A partir de 18" é >= 18; "mais de 18" é > 18',
        'Erro de borda é um dos bugs mais comuns em programação',
        'Testar sempre três valores: um antes, o da borda e um depois',
      ],
    },

    // 8 · E
    {
      id: 'guarda-compara',
      kind: 'cards',
      depth: 'core',
      title: 'Um sinal guarda, dois comparam',
      lead: 'O = sozinho não pergunta nada: ele guarda.',
      columns: 3,
      cards: [
        { title: 'Guardar', value: '{n:idade} = {v:18}', text: 'Coloca 18 no baú idade.', tone: 'good' },
        {
          title: 'Comparar',
          value: { js: '{n:idade} === {v:18}', ts: '{n:idade} === {v:18}', java: '{n:idade} == {v:18}' },
          text: 'Pergunta se idade é 18. Responde true ou false.',
          tone: 'good',
        },
        {
          title: 'Diferente',
          value: { js: '{n:idade} !== {v:18}', ts: '{n:idade} !== {v:18}', java: '{n:idade} != {v:18}' },
          text: 'Pergunta se idade não é 18.',
          tone: 'good',
        },
      ],
      notes: [
        'Erro clássico: escrever = querendo comparar',
        'JS: o = troca o valor do baú sem avisar; TS e Java costumam recusar',
        'Ler = como "recebe" e ===/== como "é igual a?"',
      ],
    },

    // 10 · E
    {
      id: 'textos',
      kind: 'scene',
      depth: 'core',
      title: 'Comparar textos',
      code: code.texts,
      steps: [
        {
          caption: {
            js: 'Textos se comparam com ===, como números.',
            ts: 'Textos se comparam com ===, como números.',
            java: 'Em Java, texto se compara com equals.',
          },
          lines: 2,
          activeLine: 2,
          output: 'true',
        },
        {
          caption: 'Maiúscula e minúscula contam: "Ana" e "ana" são textos diferentes.',
          lines: 3,
          activeLine: 3,
          output: 'true\nfalse',
        },
      ],
      notes: [
        'A comparação é letra por letra, incluindo maiúsculas, espaços e acentos',
        'JS/TS: para ignorar maiúsculas, comparar nome.toLowerCase() === "ana"',
        'Java: equalsIgnoreCase ignora maiúsculas; == em texto tem um slide de aprofundamento',
      ],
    },

    // 13 · E
    {
      id: 'contas-antes',
      kind: 'expr',
      depth: 'core',
      title: 'Contas antes da comparação',
      description: 'A conta 10 * 3 > 25 faz a multiplicação primeiro e depois compara 30 com 25: true.',
      steps: [
        { expr: '{v:10} * {v:3} > {v:25}', caption: 'Conta e comparação na mesma linha: quem vem primeiro?' },
        {
          expr: '[[{v:10} * {v:3}]] > {v:25}',
          replace: true,
          caption: 'As contas vêm antes da comparação.',
        },
        { expr: '[[{v:30} > {v:25}]]', caption: 'Depois, a balança compara.' },
        { expr: '{v:true}', result: true, caption: 'Exemplo real: preco * qtd > saldo.' },
      ],
      notes: [
        'Prioridade: contas (* / % + -), depois comparações',
        'Parênteses ajudam quem lê: (preco * qtd) > saldo',
        'Na próxima aula entram && e ||, que vêm depois das comparações',
      ],
    },

    // 19 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'Comparar', value: '{k:> < >= <=}', text: 'Maior, menor e com o igual.' },
        {
          title: 'Igual, diferente',
          value: { js: '{k:=== !==}', ts: '{k:=== !==}', java: '{k:== !=}' },
          text: { js: 'Três sinais em JS/TS.', ts: 'Três sinais em JS/TS.', java: 'Dois sinais em Java.' },
        },
        { title: 'Resposta', value: '{v:true}', text: 'Ou false: um booleano, que cabe num baú.' },
        {
          title: 'Textos',
          value: { js: '{k:===}', ts: '{k:===}', java: '{f:equals}' },
          text: {
            js: 'Mesma comparação dos números.',
            ts: 'Mesma comparação dos números.',
            java: 'Texto se compara com equals.',
          },
        },
      ],
      notes: [
        'Pedir para a turma criar uma pergunta de sim ou não com os seis operadores',
        'Lembrar do = (guarda) contra === / == (compara)',
        'Próxima aula: operadores lógicos, para juntar várias perguntas (&&, ||, !)',
        'Abrir para perguntas',
      ],
    },
  ],
};
