import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. `@@` é o valor escolhido no
// exercício. Trechos de `code` têm as três sintaxes (teste de paridade); os de `only` existem só
// para os slides exclusivos de uma sintaxe.
// Java usa `List` / `ArrayList`. A lista com valores ocupa duas linhas no Java
// (`new ArrayList<>(` e `List.of(...)`), por isso as linhas do Java vêm uma depois das do JS/TS.
// Os `import` do `java.util` aparecem só no slide 3; o `check:java` importa nos demais.
type Snippet = Record<Syntax, CodeMarkup>;

const log = (s: Syntax) => (s === 'java' ? '{f:System.out.println}' : '{f:console.log}');
/** `console.log(x);` ou `System.out.println(x);`. */
const print = (s: Syntax, what: string) => `${log(s)}(${what});`;

const FRUITS = '{v:"maçã"}, {v:"uva"}, {v:"pera"}';

/** Lista com valores: uma linha em JS/TS, duas em Java. */
const create = (s: Syntax, name: string, items: string, kind: 'text' | 'int' = 'text'): string[] => {
  const ts = kind === 'text' ? '{t:string}[]' : '{t:number}[]';
  const java = kind === 'text' ? '{t:String}' : '{t:Integer}';
  if (s === 'java') return [`{t:List}<${java}> {n:${name}} = {k:new} {t:ArrayList}<>(`, `    {t:List}.{f:of}(${items}));`];
  if (s === 'ts') return [`{k:let} {n:${name}}: ${ts} = [${items}];`];
  return [`{k:let} {n:${name}} = [${items}];`];
};
const fruits = (s: Syntax) => create(s, 'frutas', FRUITS);

/** `frutas[0]` ou `frutas.get(0)`. */
const at = (s: Syntax, name: string, index: string) =>
  s === 'java' ? `{n:${name}}.{f:get}(${index})` : `{n:${name}}[${index}]`;
/** `frutas.length` ou `frutas.size()`. */
const size = (s: Syntax, name: string) => (s === 'java' ? `{n:${name}}.{f:size}()` : `{n:${name}}.{f:length}`);
/** Adicionar no fim. */
const push = (s: Syntax, name: string, item: string) =>
  s === 'java' ? `{n:${name}}.{f:add}(${item});` : `{n:${name}}.{f:push}(${item});`;
/** Remover pelo índice. */
const removeAt = (s: Syntax, name: string, index: string) =>
  s === 'java' ? `{n:${name}}.{f:remove}(${index});` : `{n:${name}}.{f:splice}(${index}, {v:1});`;

const bySyntax = (build: (s: Syntax) => string[]): Snippet => ({
  js: build('js').join('\n'),
  ts: build('ts').join('\n'),
  java: build('java').join('\n'),
});

export const code = {
  /** Slide 2: três variáveis viram uma lista. */
  manyVars: bySyntax((s) => [
    ...['maçã', 'uva', 'pera'].map((f, i) =>
      s === 'java'
        ? `{t:String} {n:fruta${i + 1}} = {v:"${f}"};`
        : `{k:let} {n:fruta${i + 1}}${s === 'ts' ? ': {t:string}' : ''} = {v:"${f}"};`,
    ),
    ...fruits(s),
  ]),
  /** Slide 3: criar e mostrar, com os import do Java. */
  create: bySyntax((s) => [
    ...(s === 'java' ? ['{k:import} {t:java.util.ArrayList};', '{k:import} {t:java.util.List};', ''] : []),
    ...fruits(s),
    print(s, '{n:frutas}'),
  ]),
  /** Slide 4: o índice começa no 0. */
  index: bySyntax((s) => [...fruits(s), print(s, at(s, 'frutas', '{v:0}')), print(s, at(s, 'frutas', '{v:2}'))]),
  /** Slide 5: tamanho e último item. */
  last: bySyntax((s) => [
    ...fruits(s),
    print(s, size(s, 'frutas')),
    s === 'java'
      ? `{t:int} {n:ultimo} = ${size(s, 'frutas')} - {v:1};`
      : `{k:let} {n:ultimo}${s === 'ts' ? ': {t:number}' : ''} = ${size(s, 'frutas')} - {v:1};`,
    print(s, at(s, 'frutas', '{n:ultimo}')),
  ]),
  /** Slide 6: exercício, o índice escolhido pela turma. */
  pick: bySyntax((s) => [...fruits(s), print(s, at(s, 'frutas', '{v:@@}'))]),
  /** Slide 7: adicionar no fim. */
  push: bySyntax((s) => [...fruits(s), push(s, 'frutas', '{v:"kiwi"}'), print(s, '{n:frutas}'), print(s, size(s, 'frutas'))]),
  /** Slide 8: trocar um item. */
  set: bySyntax((s) => [
    ...fruits(s),
    s === 'java' ? '{n:frutas}.{f:set}({v:1}, {v:"kiwi"});' : '{n:frutas}[{v:1}] = {v:"kiwi"};',
    print(s, '{n:frutas}'),
  ]),
  /** Slide 9: remover do fim e pelo índice. */
  remove: bySyntax((s) => [
    ...fruits(s),
    s === 'java' ? `{n:frutas}.{f:remove}(${size(s, 'frutas')} - {v:1});` : '{n:frutas}.{f:pop}();',
    print(s, '{n:frutas}'),
    removeAt(s, 'frutas', '{v:0}'),
    print(s, '{n:frutas}'),
  ]),
  /** Slide 10: inserir no meio. */
  insert: bySyntax((s) => [
    ...fruits(s),
    s === 'java' ? '{n:frutas}.{f:add}({v:1}, {v:"kiwi"});' : '{n:frutas}.{f:splice}({v:1}, {v:0}, {v:"kiwi"});',
    print(s, '{n:frutas}'),
  ]),
  /** Slide 11: a fila do caixa (exercício de prever). */
  queue: bySyntax((s) => [
    ...create(s, 'fila', '{v:"Ana"}, {v:"Bia"}, {v:"Caio"}'),
    removeAt(s, 'fila', '{v:0}'),
    push(s, 'fila', '{v:"Davi"}'),
    print(s, `${at(s, 'fila', '{v:0}')} + {v:" "} + ${size(s, 'fila')}`),
  ]),
  /** Slide 12: procurar. */
  find: bySyntax((s) => {
    const has = s === 'java' ? 'contains' : 'includes';
    return [
      ...fruits(s),
      print(s, `{n:frutas}.{f:${has}}({v:"uva"})`),
      print(s, '{n:frutas}.{f:indexOf}({v:"uva"})'),
      print(s, '{n:frutas}.{f:indexOf}({v:"kiwi"})'),
    ];
  }),
  /** Slide 13: índice que não existe. */
  outside: bySyntax((s) => [...fruits(s), print(s, at(s, 'frutas', '{v:10}'))]),
  /** Slide 14: um item de outro tipo. */
  oneType: bySyntax((s) => [...fruits(s), push(s, 'frutas', '{v:5}'), print(s, '{n:frutas}')]),
  /** Slide 15: juntar em texto e ordenar. */
  joinSort: bySyntax((s) => [
    ...create(s, 'frutas', '{v:"uva"}, {v:"maçã"}, {v:"pera"}'),
    print(s, s === 'java' ? '{t:String}.{f:join}({v:", "}, {n:frutas})' : '{n:frutas}.{f:join}({v:", "})'),
    s === 'java' ? '{t:Collections}.{f:sort}({n:frutas});' : '{n:frutas}.{f:sort}();',
    print(s, '{n:frutas}'),
  ]),
  /** Slide 22: carrinho de compras, com o if da aula 5. */
  cart: bySyntax((s) => {
    const has = s === 'java' ? 'contains' : 'includes';
    return [
      s === 'java'
        ? '{t:List}<{t:String}> {n:carrinho} = {k:new} {t:ArrayList}<>();'
        : `{k:let} {n:carrinho}${s === 'ts' ? ': {t:string}[]' : ''} = [];`,
      push(s, 'carrinho', '{v:"pão"}'),
      push(s, 'carrinho', '{v:"café"}'),
      `{k:if} (!{n:carrinho}.{f:${has}}({v:"leite"})) {`,
      `  ${push(s, 'carrinho', '{v:"leite"}')}`,
      '}',
      removeAt(s, 'carrinho', '{v:0}'),
      print(s, '{n:carrinho}'),
      print(s, size(s, 'carrinho')),
    ];
  }),
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 16 (JS/TS): o sort compara como texto. */
  sortText: {
    js: ['{k:let} {n:numeros} = [{v:10}, {v:9}, {v:1}];', '{n:numeros}.{f:sort}();', '{f:console.log}({n:numeros});'].join('\n'),
    ts: ['{k:let} {n:numeros}: {t:number}[] = [{v:10}, {v:9}, {v:1}];', '{n:numeros}.{f:sort}();', '{f:console.log}({n:numeros});'].join('\n'),
  },
  /** Slide 17 (JS/TS): const não congela a lista. */
  constList: {
    js: ['{k:const} {n:frutas} = [{v:"maçã"}, {v:"uva"}];', '{n:frutas}.{f:push}({v:"pera"});', '{f:console.log}({n:frutas});', '{n:frutas} = [];'].join('\n'),
    ts: ['{k:const} {n:frutas}: {t:string}[] = [{v:"maçã"}, {v:"uva"}];', '{n:frutas}.{f:push}({v:"pera"});', '{f:console.log}({n:frutas});', '{n:frutas} = [];'].join('\n'),
  },
  /** Slide 18 (Java): o array, de tamanho fixo. */
  javaArray: [
    `{t:String}[] {n:frutas} = {${FRUITS}};`,
    '{f:System.out.println}({n:frutas}.{n:length});',
    '{f:System.out.println}({n:frutas});',
    '{f:System.out.println}({t:Arrays}.{f:toString}({n:frutas}));',
    '{n:frutas}.{f:add}({v:"kiwi"});',
  ].join('\n'),
  /** Slide 19 (Java): List<Integer> e o remove pelo índice. */
  javaInteger: [
    ...create('java', 'numeros', '{v:1}, {v:5}, {v:8}', 'int'),
    '{n:numeros}.{f:remove}({v:1});',
    '{f:System.out.println}({n:numeros});',
    '{n:numeros}.{f:remove}({t:Integer}.{f:valueOf}({v:1}));',
    '{f:System.out.println}({n:numeros});',
  ].join('\n'),
};
