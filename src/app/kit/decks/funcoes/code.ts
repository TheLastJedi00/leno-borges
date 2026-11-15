import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. `@@` é o valor escolhido no
// exercício. Trechos de `code` têm as três sintaxes (teste de paridade); os de `only` existem só
// para os slides exclusivos de uma sintaxe.
// No Java, as funções vêm primeiro e a linha `// no main` separa o que fica dentro do `main`
// (o `check:java` monta a classe com essa divisão). Por isso, as linhas depois das funções ficam
// uma linha abaixo no Java.
type Snippet = Record<Syntax, CodeMarkup>;

const log = (s: Syntax) => (s === 'java' ? '{f:System.out.println}' : '{f:console.log}');
/** `console.log(x);` ou `System.out.println(x);`. */
const print = (s: Syntax, what: string) => `${log(s)}(${what});`;
/** Linha que separa as funções do que roda dentro do `main` (só no Java). */
const noMain = (s: Syntax): string[] => (s === 'java' ? ['{c:// no main}'] : []);

type Param = [name: string, ts: string, java: string];
const NUM: [string, string] = ['number', 'int'];
const TEXT: [string, string] = ['string', 'String'];
const p = (name: string, [ts, java]: [string, string]): Param => [name, ts, java];

/**
 * Cabeçalho da função: `function dobro(n) {`, `function dobro(n: number): number {` ou
 * `static int dobro(int n) {`. `result` é o tipo devolvido no TS e no Java (`void` sem resposta).
 */
const fn = (s: Syntax, name: string, params: Param[], [ts, java]: [string, string]) => {
  if (s === 'java') {
    const list = params.map(([n, , t]) => `${typed(t)} {n:${n}}`).join(', ');
    return `{k:static} ${typed(java)} {f:${name}}(${list}) {`;
  }
  if (s === 'ts') {
    const list = params.map(([n, t]) => `{n:${n}}: ${typed(t)}`).join(', ');
    return `{k:function} {f:${name}}(${list}): ${typed(ts)} {`;
  }
  return `{k:function} {f:${name}}(${params.map(([n]) => `{n:${n}}`).join(', ')}) {`;
};
/** `void` é palavra-chave; os outros tipos, tipo (`List<Integer>` com os sinais fora). */
const typed = (t: string) =>
  t === 'void' ? '{k:void}' : t.replace(/[A-Za-z]+(\[\])?/g, (m) => `{t:${m.replace('[]', '')}}${m.endsWith('[]') ? '[]' : ''}`);
const VOID: [string, string] = ['void', 'void'];

/** `let r = x;` / `int r = x;` (o TS deduz o tipo). */
const local = (s: Syntax, name: string, java: string, value: string) =>
  s === 'java' ? `${typed(java)} {n:${name}} = ${value};` : `{k:let} {n:${name}} = ${value};`;

const bySyntax = (build: (s: Syntax) => string[]): Snippet => ({
  js: build('js').join('\n'),
  ts: build('ts').join('\n'),
  java: build('java').join('\n'),
});

const HELLO = '{v:"Olá!"}';
const WELCOME = '{v:"Bem-vindo à aula"}';

export const code = {
  /** Slide 2: o mesmo cumprimento copiado três vezes. */
  repeated: bySyntax((s) => [1, 2, 3].flatMap(() => [print(s, HELLO), print(s, WELCOME)])),
  /** Slide 3: declarar e chamar. */
  greet: bySyntax((s) => [
    fn(s, 'saudar', [], VOID),
    `  ${print(s, HELLO)}`,
    `  ${print(s, WELCOME)}`,
    '}',
    ...noMain(s),
    '{f:saudar}();',
    '{f:saudar}();',
  ]),
  /** Slide 4: o arquivo inteiro (no Java, a classe com o `main`). */
  wholeFile: {
    js: [fn('js', 'saudar', [], VOID), `  ${print('js', HELLO)}`, '}', '{f:saudar}();'].join('\n'),
    ts: [fn('ts', 'saudar', [], VOID), `  ${print('ts', HELLO)}`, '}', '{f:saudar}();'].join('\n'),
    java: [
      '{k:public} {k:class} {t:Aula} {',
      `  ${fn('java', 'saudar', [], VOID)}`,
      `    ${print('java', HELLO)}`,
      '  }',
      '',
      '  {k:public} {k:static} {k:void} {f:main}({t:String}[] {n:args}) {',
      '    {f:saudar}();',
      '  }',
      '}',
    ].join('\n'),
  },
  /** Slide 5: parâmetro. */
  params: bySyntax((s) => [
    fn(s, 'saudar', [p('nome', TEXT)], VOID),
    `  ${print(s, '{v:"Olá, "} + {n:nome} + {v:"!"}')}`,
    '}',
    ...noMain(s),
    '{f:saudar}({v:"Ana"});',
    '{f:saudar}({v:"Bia"});',
  ]),
  /** Slide 6: argumentos fora de ordem. */
  order: bySyntax((s) => [
    fn(s, 'apresentar', [p('nome', TEXT), p('idade', NUM)], VOID),
    `  ${print(s, '{n:nome} + {v:" tem "} + {n:idade} + {v:" anos"}')}`,
    '}',
    ...noMain(s),
    '{f:apresentar}({v:16}, {v:"Ana"});',
  ]),
  /** Slide 7: return. */
  double: bySyntax((s) => [
    fn(s, 'dobro', [p('n', NUM)], NUM),
    '  {k:return} {n:n} * {v:2};',
    '}',
    ...noMain(s),
    local(s, 'resultado', 'int', '{f:dobro}({v:4})'),
    print(s, '{n:resultado}'),
  ]),
  /** Slide 8: a chamada de dentro responde primeiro (exercício de prever). */
  doubleTwice: bySyntax((s) => [
    fn(s, 'dobro', [p('n', NUM)], NUM),
    '  {k:return} {n:n} * {v:2};',
    '}',
    ...noMain(s),
    print(s, '{f:dobro}({f:dobro}({v:3}))'),
  ]),
  /** Slide 9: uma função chama outra. */
  callsOther: bySyntax((s) => [
    fn(s, 'somar', [p('a', NUM), p('b', NUM)], NUM),
    '  {k:return} {n:a} + {n:b};',
    '}',
    fn(s, 'media', [p('a', NUM), p('b', NUM)], NUM),
    `  ${local(s, 'soma', 'int', '{f:somar}({n:a}, {n:b})')}`,
    '  {k:return} {n:soma} / {v:2};',
    '}',
    ...noMain(s),
    print(s, '{f:media}({v:7}, {v:9})'),
  ]),
  /** Slide 10: a linha depois do return. */
  afterReturn: bySyntax((s) => [
    fn(s, 'dobro', [p('n', NUM)], NUM),
    '  {k:return} {n:n} * {v:2};',
    `  ${print(s, '{v:"depois do return"}')}`,
    '}',
    ...noMain(s),
    print(s, '{f:dobro}({v:4})'),
  ]),
  /** Slide 11: imprimir o resultado de uma função sem return. */
  noAnswer: bySyntax((s) => [
    fn(s, 'saudar', [], VOID),
    `  ${print(s, HELLO)}`,
    '}',
    ...noMain(s),
    print(s, '{f:saudar}()'),
  ]),
  /** Slide 12: a variável de dentro não existe fora. */
  scope: bySyntax((s) => [
    fn(s, 'media', [p('a', NUM), p('b', NUM)], NUM),
    `  ${local(s, 'total', 'int', '{n:a} + {n:b}')}`,
    '  {k:return} {n:total} / {v:2};',
    '}',
    ...noMain(s),
    print(s, '{f:media}({v:7}, {v:9})'),
    print(s, '{n:total}'),
  ]),
  /** Slide 13: o mesmo nome em salas diferentes. */
  ownChests: bySyntax((s) => [
    fn(s, 'dobrar', [p('n', NUM)], NUM),
    '  {n:n} = {n:n} * {v:2};',
    '  {k:return} {n:n};',
    '}',
    ...noMain(s),
    local(s, 'n', 'int', '{v:5}'),
    local(s, 'r', 'int', '{f:dobrar}({n:n})'),
    print(s, '{n:n} + {v:" e "} + {n:r}'),
  ]),
  /** Slide 14: função que responde true ou false. */
  canVote: bySyntax((s) => [
    fn(s, 'podeVotar', [p('idade', NUM)], ['boolean', 'boolean']),
    '  {k:return} {n:idade} >= {v:16};',
    '}',
    ...noMain(s),
    local(s, 'pode', 'boolean', '{f:podeVotar}({v:17})'),
    '{k:if} ({n:pode}) {',
    `  ${print(s, '{v:"Pode votar"}')}`,
    '} {k:else} {',
    `  ${print(s, '{v:"Ainda não"}')}`,
    '}',
  ]),
  /** Slide 15: a lista como parâmetro, com o acumulador da aula 8. */
  average: bySyntax((s) => [
    fn(s, 'media', [p('notas', ['number[]', 'List<Integer>'])], NUM),
    `  ${local(s, 'soma', 'int', '{v:0}')}`,
    s === 'java' ? '  {k:for} ({t:int} {n:nota} : {n:notas}) {' : '  {k:for} ({k:const} {n:nota} {k:of} {n:notas}) {',
    '    {n:soma} += {n:nota};',
    '  }',
    `  {k:return} {n:soma} / ${s === 'java' ? '{n:notas}.{f:size}()' : '{n:notas}.{f:length}'};`,
    '}',
    ...noMain(s),
    print(s, s === 'java' ? '{f:media}({t:List}.{f:of}({v:7}, {v:9}, {v:8}))' : '{f:media}([{v:7}, {v:9}, {v:8}])'),
  ]),
  /** Slide 16: função dentro de função (JS/TS pode; Java não compila, com a classe inteira). */
  nested: {
    js: [
      fn('js', 'media', [p('a', NUM), p('b', NUM)], NUM),
      '  {k:function} {f:somar}() {',
      '    {k:return} {n:a} + {n:b};',
      '  }',
      '  {k:return} {f:somar}() / {v:2};',
      '}',
      print('js', '{f:media}({v:7}, {v:9})'),
    ].join('\n'),
    ts: [
      fn('ts', 'media', [p('a', NUM), p('b', NUM)], NUM),
      '  {k:function} {f:somar}(): {t:number} {',
      '    {k:return} {n:a} + {n:b};',
      '  }',
      '  {k:return} {f:somar}() / {v:2};',
      '}',
      print('ts', '{f:media}({v:7}, {v:9})'),
    ].join('\n'),
    java: [
      '{k:public} {k:class} {t:Aula} {',
      '  {k:public} {k:static} {k:void} {f:main}({t:String}[] {n:args}) {',
      `    ${fn('java', 'dobro', [p('n', NUM)], NUM)}`,
      '      {k:return} {n:n} * {v:2};',
      '    }',
      `    ${print('java', '{f:dobro}({v:4})')}`,
      '  }',
      '}',
    ].join('\n'),
  },
  /** Slide 19: exercício "escolha a nota". */
  classify: bySyntax((s) => [
    fn(s, 'classificar', [p('nota', NUM)], TEXT),
    '  {k:if} ({n:nota} >= {v:7}) {',
    '    {k:return} {v:"Aprovado"};',
    '  } {k:else} {k:if} ({n:nota} >= {v:5}) {',
    '    {k:return} {v:"Recuperação"};',
    '  }',
    '  {k:return} {v:"Reprovado"};',
    '}',
    ...noMain(s),
    print(s, '{f:classificar}({v:@@})'),
  ]),
  /** Slide 22: a tabuada da aula 8 vira função. */
  table: bySyntax((s) => [
    fn(s, 'tabuada', [p('n', NUM)], VOID),
    `  {k:for} (${s === 'java' ? '{t:int}' : '{k:let}'} {n:i} = {v:1}; {n:i} <= {v:3}; {n:i}++) {`,
    `    ${print(s, '{n:n} + {v:" x "} + {n:i} + {v:" = "} + {n:n} * {n:i}')}`,
    '  }',
    '}',
    ...noMain(s),
    '{f:tabuada}({v:7});',
    '{f:tabuada}({v:3});',
  ]),
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 17 (Java): sobrecarga. */
  overload: [
    fn('java', 'somar', [p('a', NUM), p('b', NUM)], NUM),
    '  {k:return} {n:a} + {n:b};',
    '}',
    fn('java', 'somar', [p('a', NUM), p('b', NUM), p('c', NUM)], NUM),
    '  {k:return} {n:a} + {n:b} + {n:c};',
    '}',
    '{c:// no main}',
    print('java', '{f:somar}({v:1}, {v:2})'),
    print('java', '{f:somar}({v:1}, {v:2}, {v:3})'),
  ].join('\n'),
  /** Slide 18 (JS/TS): arrow function. */
  arrow: {
    js: ['{k:const} {f:dobro} = ({n:n}) => {n:n} * {v:2};', print('js', '{f:dobro}({v:4})')].join('\n'),
    ts: ['{k:const} {f:dobro} = ({n:n}: {t:number}): {t:number} => {n:n} * {v:2};', print('ts', '{f:dobro}({v:4})')].join('\n'),
  },
};
