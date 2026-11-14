import type { ChestState, Deck } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 3 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md
// Metáfora: a balança compara os itens de dois baús e responde true ou false, um item que cabe
// num baú de verdadeiro/falso.

/** Baú aberto com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });
const bool = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'bool', { open: true, label: id, item, ...extra });
const text = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'text', { open: true, label: id, item, ...extra });

/** Erros conferidos no `tsc` 5.9 (TS2367, TS2365 e TS2845). */
const TS_ALWAYS_FALSE = "error: This condition will always return 'false'.";
const TS_NO_OVERLAP =
  "error: This comparison appears to be unintentional because the types 'string' and 'number' have no overlap.";
const TS_BOOL_NUMBER = (op: string) =>
  `error: Operator '${op}' cannot be applied to types 'boolean' and 'number'.`;
/** Erro do `javac` (JDK 9 ou mais novo) ao comparar boolean com int. */
const JAVA_BAD_OPERANDS = (op: string) => `error: bad operand types for binary operator '${op}'`;

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

    // 7 · A
    {
      id: 'exercicio-vf',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Verdadeiro ou falso?',
      lead: 'Em qual baú cai a resposta de cada comparação?',
      bins: [
        { id: 'true', shape: 'bool', label: 'true' },
        { id: 'false', shape: 'bool', label: 'false' },
      ],
      items: [
        { value: '7 > 3', bin: 'true' },
        { value: '2 >= 2', bin: 'true' },
        { value: '5 < 5', bin: 'false' },
        { value: '9 <= 4', bin: 'false' },
        { value: '3 * 2 > 5', bin: 'true' },
        { value: '10 / 2 < 5', bin: 'false' },
        { value: '0 >= -1', bin: 'true' },
        { value: '1 + 1 <= 2', bin: 'true' },
      ],
      notes: [
        'Deixar a turma decidir cada item em voz alta antes de soltar',
        'Pegadinhas de borda: 2 >= 2 é true, 5 < 5 é false',
        'Com conta: primeiro calcula (3 * 2 = 6), depois compara',
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

    // 9 · A (só JS/TS)
    {
      id: 'igual-solto',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['js', 'ts'],
      title: '== ou ===?',
      code: only.looseEquals,
      steps: [
        {
          caption: {
            js: '== converte antes de comparar: o texto "5" vira o número 5.',
            ts: 'TypeScript recusa antes de rodar: texto e número nunca são iguais.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: 'true', ts: TS_NO_OVERLAP },
          outputTone: { js: 'ok', ts: 'error' },
        },
        {
          caption: {
            js: '=== compara também o tipo: texto não é número. Use sempre ===.',
            ts: 'Com === também. Em TS e JS, a regra é usar sempre ===.',
          },
          lines: 2,
          activeLine: 2,
          output: { js: 'true\nfalse', ts: TS_NO_OVERLAP },
          outputTone: { js: 'ok', ts: 'error' },
        },
      ],
      notes: [
        '== é a "igualdade frouxa": converte os tipos com regras difíceis de lembrar',
        'Exemplos estranhos do ==: 0 == "" é true, null == undefined é true',
        'Linters (ESLint) avisam quando alguém usa ==',
        '!= e !== seguem a mesma regra',
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

    // 11 · A (só Java)
    {
      id: 'java-string-igual',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: '== em texto no Java',
      description: 'Os baús a e b guardam o texto "Ana". a == b responde false; a.equals(b) responde true.',
      code: only.javaStringEquals,
      steps: [
        {
          caption: 'Dois baús, o mesmo texto dentro.',
          lines: 2,
          activeLine: null,
          chests: [text('a', '"Ana"'), text('b', '"Ana"')],
        },
        {
          caption: '== pergunta se é o mesmo baú, não se o conteúdo é igual.',
          lines: 3,
          activeLine: 3,
          chests: [text('a', '"Ana"', { focus: 'chest' }), text('b', '"Ana"', { focus: 'chest' })],
          output: 'false',
        },
        {
          caption: 'equals compara o conteúdo, letra por letra.',
          lines: 4,
          activeLine: 4,
          chests: [text('a', '"Ana"', { focus: 'item' }), text('b', '"Ana"', { focus: 'item' })],
          output: 'false\ntrue',
        },
      ],
      notes: [
        'String é um objeto: == compara o endereço na memória (aula 1), não o texto',
        'Pegadinha: "Ana" == "Ana" escrito direto pode dar true (o Java reaproveita textos iguais), e isso engana',
        'Regra: texto em Java sempre com equals',
      ],
    },

    // 12 · A
    {
      id: 'ordem-alfabetica',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'Ordem alfabética',
      code: code.order,
      steps: [
        {
          caption: {
            js: 'Com texto, < e > comparam a ordem alfabética: banana vem antes de maçã.',
            ts: 'Com texto, < e > comparam a ordem alfabética: banana vem antes de maçã.',
            java: 'Em Java, < não vale para texto: compareTo responde com um número.',
          },
          activeLine: { js: 1, ts: 1, java: 3 },
          output: { js: 'true', ts: 'true', java: '-7' },
        },
        {
          caption: {
            js: 'Maiúsculas vêm antes das minúsculas: Zebra vem antes de abelha.',
            ts: 'Maiúsculas vêm antes das minúsculas: Zebra vem antes de abelha.',
            java: 'Negativo quer dizer "vem antes": maiúsculas vêm antes das minúsculas.',
          },
          activeLine: { js: 2, ts: 2, java: 4 },
          output: { js: 'true\ntrue', ts: 'true\ntrue', java: '-7\ntrue' },
        },
        {
          caption: {
            js: 'E "10" < "9": compara o primeiro caractere, 1 contra 9.',
            ts: 'E "10" < "9": compara o primeiro caractere, 1 contra 9.',
            java: 'Cada letra é um número por baixo: Z é 90 e a é 97.',
          },
          activeLine: { js: 3, ts: 3, java: null },
          output: { js: 'true\ntrue\ntrue', ts: 'true\ntrue\ntrue', java: '-7\ntrue' },
        },
      ],
      notes: [
        'Por baixo, cada caractere é um número (código Unicode): Z é 90, a é 97',
        'Número guardado como texto se ordena errado: "10" vem antes de "9"',
        'Para ordenar nomes de verdade: localeCompare (JS/TS) e Collator (Java)',
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

    // 14 · A
    {
      id: 'exercicio-qual-false',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual baú guarda false?',
      question: 'Depois das quatro linhas, qual baú guarda false?',
      code: code.predictFalse,
      options: ['b', 'c', 'd', 'Nenhum'],
      answer: 1,
      explanation: 'b: 8 > 7 é true. c: 4 % 2 dá 0, e 0 não é 1, então false. d: 5 >= 5 é true.',
      trace: [
        { activeLine: 1, chests: [int('a', '4', { focus: 'item' })] },
        { activeLine: 2, chests: [int('a', '4'), bool('b', 'true', { focus: 'item' })] },
        {
          activeLine: 3,
          chests: [int('a', '4'), bool('b', 'true'), bool('c', 'false', { focus: 'item' })],
        },
        {
          activeLine: 4,
          chests: [
            int('a', '4'),
            bool('b', 'true'),
            bool('c', 'false'),
            bool('d', 'true', { focus: 'item' }),
          ],
        },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou d esqueceu o igual do >=',
        'Revelar linha a linha com a seta',
      ],
    },

    // 15 · A
    {
      id: 'ponto-flutuante',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: '0.1 + 0.2 é igual a 0.3?',
      code: code.float,
      steps: [
        {
          caption: 'A soma guarda 0.30000000000000004, então não é igual a 0.3.',
          lines: 2,
          activeLine: 2,
          output: 'false',
        },
        {
          caption: 'Com decimais, pergunte se estão perto o bastante.',
          lines: 4,
          activeLine: 4,
          output: 'false\ntrue',
        },
      ],
      notes: [
        'Retoma a curiosidade da aula 1: decimal em binário não é exato',
        '1e-9 é 0,000000001: a tolerância aceitável depende do problema',
        'Dinheiro: guardar em centavos inteiros evita o problema',
      ],
    },

    // 16 · A
    {
      id: 'nan',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'NaN não é igual a nada',
      code: code.nan,
      steps: [
        {
          caption: {
            js: 'NaN não é igual a nada, nem a ele mesmo.',
            ts: 'NaN não é igual a nada, nem a ele mesmo. O TypeScript avisa antes de rodar.',
            java: 'NaN não é igual a nada, nem a ele mesmo.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: 'false', ts: TS_ALWAYS_FALSE, java: 'false' },
          outputTone: { js: 'ok', ts: 'error', java: 'ok' },
        },
        {
          caption: {
            js: 'Para saber se é NaN, use Number.isNaN.',
            ts: 'Para saber se é NaN, use Number.isNaN.',
            java: 'Para saber se é NaN, use Double.isNaN.',
          },
          lines: 2,
          activeLine: 2,
          output: { js: 'false\ntrue', ts: 'true', java: 'false\ntrue' },
          outputTone: 'ok',
        },
      ],
      notes: [
        'NaN veio da aula 2: 0 / 0 e texto em conta (JS)',
        'TS recusa comparar com NaN porque a resposta seria sempre false',
        'A regra vem do padrão de números decimais (IEEE 754), igual nas três linguagens',
        'Curiosidade: NaN é o único valor diferente dele mesmo',
      ],
    },

    // 17 · A
    {
      id: 'encadear',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: '3 > 2 > 1',
      code: code.chain,
      steps: [
        {
          caption: {
            js: 'Parece funcionar…',
            ts: 'TypeScript recusa: depois da primeira comparação sobra um boolean.',
            java: 'Java recusa: depois da primeira comparação sobra um boolean.',
          },
          lines: 1,
          activeLine: 1,
          output: { js: 'true', ts: TS_BOOL_NUMBER('<'), java: JAVA_BAD_OPERANDS('<') },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
        {
          caption: {
            js: '3 > 2 vira true, e true > 1 vira 1 > 1: false.',
            ts: 'E boolean não se compara com número. O jeito certo usa &&, na próxima aula.',
            java: 'E boolean não se compara com número. O jeito certo usa &&, na próxima aula.',
          },
          lines: 2,
          activeLine: 2,
          output: {
            js: 'true\nfalse',
            ts: TS_BOOL_NUMBER('>'),
            java: JAVA_BAD_OPERANDS('>'),
          },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
      ],
      notes: [
        'A comparação vai da esquerda para a direita e responde um boolean',
        'JS converte true em 1 e false em 0 para continuar a conta',
        'Na matemática 3 > 2 > 1 faz sentido; no código, é 3 > 2 && 2 > 1 (aula 4)',
      ],
    },

    // 18 · A
    {
      id: 'desafio-par',
      kind: 'scene',
      depth: 'extra',
      tag: 'Desafio',
      title: 'Par como verdadeiro ou falso',
      description:
        'O baú num guarda 7 e o baú par guarda false. Depois num passa a 10 e par passa a guardar true.',
      code: code.even,
      steps: [
        {
          caption: 'Como guardar se um número é par? Use o % da aula 2.',
          lines: 1,
          activeLine: 1,
          chests: [int('num', '7')],
        },
        {
          caption: '7 % 2 dá 1, e 1 não é 0: par guarda false.',
          lines: 2,
          activeLine: 2,
          chests: [int('num', '7'), bool('par', 'false', { focus: 'item' })],
        },
        {
          caption: 'Com 10…',
          lines: 3,
          activeLine: 3,
          chests: [int('num', '10', { focus: 'item' }), bool('par', 'false')],
        },
        {
          caption: '…10 % 2 dá 0: par guarda true.',
          lines: 4,
          activeLine: 4,
          chests: [int('num', '10'), bool('par', 'true', { focus: 'item' })],
        },
      ],
      notes: [
        'Pedir a solução para a turma antes da etapa 2',
        'Primeiro a conta (%), depois a comparação (===/==), por fim guarda',
        'Extensão: múltiplo de 3? num % 3 === 0',
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
