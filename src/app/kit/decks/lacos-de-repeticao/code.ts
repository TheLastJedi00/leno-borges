import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. `@@` é o valor escolhido no
// exercício. Trechos de `code` têm as três sintaxes (teste de paridade); os de `only` existem só
// para os slides exclusivos de uma sintaxe.
// Como na aula 7, a lista com valores ocupa duas linhas no Java (`new ArrayList<>(` e
// `List.of(...)`): as linhas do Java vêm uma depois das do JS/TS nos trechos com lista.
type Snippet = Record<Syntax, CodeMarkup>;

const log = (s: Syntax) => (s === 'java' ? '{f:System.out.println}' : '{f:console.log}');
/** `console.log(x);` ou `System.out.println(x);`. */
const print = (s: Syntax, what: string) => `${log(s)}(${what});`;
const eq = (s: Syntax) => (s === 'java' ? '==' : '===');

/** `let i = 1;` / `int i = 1;` (o TS deduz o tipo do número). */
const int = (s: Syntax, name: string, value: string) =>
  s === 'java' ? `{t:int} {n:${name}} = {v:${value}};` : `{k:let} {n:${name}} = {v:${value}};`;

/** Lista com valores: uma linha em JS/TS, duas em Java. */
const create = (s: Syntax, name: string, items: string, kind: 'text' | 'int' = 'text'): string[] => {
  const ts = kind === 'text' ? '{t:string}[]' : '{t:number}[]';
  const java = kind === 'text' ? '{t:String}' : '{t:Integer}';
  if (s === 'java') return [`{t:List}<${java}> {n:${name}} = {k:new} {t:ArrayList}<>(`, `    {t:List}.{f:of}(${items}));`];
  if (s === 'ts') return [`{k:let} {n:${name}}: ${ts} = [${items}];`];
  return [`{k:let} {n:${name}} = [${items}];`];
};
const FRUITS = '{v:"maçã"}, {v:"uva"}, {v:"pera"}';
const fruits = (s: Syntax) => create(s, 'frutas', FRUITS);

/** Cabeçalho do `for` que conta: `for (let i = 1; i <= 3; i++) {`. */
const forCount = (s: Syntax, from: string, cond: string, step: string) =>
  `{k:for} (${s === 'java' ? '{t:int}' : '{k:let}'} {n:i} = {v:${from}}; ${cond}; ${step}) {`;
/** Cabeçalho do laço de itens: `for (const fruta of frutas) {` / `for (String fruta : frutas) {`. */
const forEach = (s: Syntax, item: string, list: string, type: 'String' | 'int') =>
  s === 'java'
    ? `{k:for} ({t:${type}} {n:${item}} : {n:${list}}) {`
    : `{k:for} ({k:const} {n:${item}} {k:of} {n:${list}}) {`;
const size = (s: Syntax, name: string) => (s === 'java' ? `{n:${name}}.{f:size}()` : `{n:${name}}.{f:length}`);
const at = (s: Syntax, name: string, index: string) =>
  s === 'java' ? `{n:${name}}.{f:get}(${index})` : `{n:${name}}[${index}]`;

const bySyntax = (build: (s: Syntax) => string[]): Snippet => ({
  js: build('js').join('\n'),
  ts: build('ts').join('\n'),
  java: build('java').join('\n'),
});

export const code = {
  /** Slides 2 e 3: while que conta de 1 a 3. */
  whileCount: bySyntax((s) => [
    int(s, 'i', '1'),
    '{k:while} ({n:i} <= {v:3}) {',
    `  ${print(s, '{n:i}')}`,
    '  {n:i}++;',
    '}',
    print(s, '{v:"Fim"}'),
  ]),
  /** Slide 4: sem o i++ (não roda: noRun). */
  infinite: bySyntax((s) => [int(s, 'i', '1'), '{k:while} ({n:i} <= {v:3}) {', `  ${print(s, '{n:i}')}`, '}']),
  /** Slide 5: o mesmo laço com for. */
  forCount: bySyntax((s) => [forCount(s, '1', '{n:i} <= {v:3}', '{n:i}++'), `  ${print(s, '{n:i}')}`, '}']),
  /** Slide 6: de 2 em 2 (exercício de prever). */
  stepTwo: bySyntax((s) => [forCount(s, '0', '{n:i} < {v:10}', '{n:i} += {v:2}'), `  ${print(s, '{n:i}')}`, '}']),
  /** Slide 7: percorrer a lista pelo índice. */
  walkIndex: bySyntax((s) => [
    ...fruits(s),
    forCount(s, '0', `{n:i} < ${size(s, 'frutas')}`, '{n:i}++'),
    `  ${print(s, at(s, 'frutas', '{n:i}'))}`,
    '}',
  ]),
  /** Slide 8: uma volta a mais (<=). */
  offByOne: bySyntax((s) => [
    ...fruits(s),
    forCount(s, '0', `{n:i} <= ${size(s, 'frutas')}`, '{n:i}++'),
    `  ${print(s, at(s, 'frutas', '{n:i}'))}`,
    '}',
  ]),
  /** Slide 9: cada item, sem índice. */
  forOf: bySyntax((s) => [...fruits(s), forEach(s, 'fruta', 'frutas', 'String'), `  ${print(s, '{n:fruta}')}`, '}']),
  /** Slides 10 e 11: acumulador. */
  sum: bySyntax((s) => [
    ...create(s, 'notas', '{v:7}, {v:9}, {v:8}', 'int'),
    int(s, 'soma', '0'),
    forEach(s, 'nota', 'notas', 'int'),
    '  {n:soma} += {n:nota};',
    '}',
    print(s, '{n:soma}'),
    print(s, `{n:soma} / ${size(s, 'notas')}`),
  ]),
  /** Slide 12: o maior valor. */
  max: bySyntax((s) => [
    ...create(s, 'notas', '{v:7}, {v:9}, {v:8}', 'int'),
    s === 'java' ? `{t:int} {n:maior} = ${at(s, 'notas', '{v:0}')};` : `{k:let} {n:maior} = ${at(s, 'notas', '{v:0}')};`,
    forEach(s, 'nota', 'notas', 'int'),
    '  {k:if} ({n:nota} > {n:maior}) {',
    '    {n:maior} = {n:nota};',
    '  }',
    '}',
    print(s, '{n:maior}'),
  ]),
  /** Slide 13: break no primeiro reprovado. */
  breakFind: bySyntax((s) => [
    ...create(s, 'notas', '{v:8}, {v:4}, {v:9}', 'int'),
    forEach(s, 'nota', 'notas', 'int'),
    '  {k:if} ({n:nota} < {v:5}) {',
    `    ${print(s, '{v:"Reprovado: "} + {n:nota}')}`,
    '    {k:break};',
    '  }',
    `  ${print(s, '{v:"Ok: "} + {n:nota}')}`,
    '}',
  ]),
  /** Slide 14: continue pula os pares. */
  continueOdd: bySyntax((s) => [
    forCount(s, '1', '{n:i} <= {v:6}', '{n:i}++'),
    `  {k:if} ({n:i} % {v:2} ${eq(s)} {v:0}) {`,
    '    {k:continue};',
    '  }',
    `  ${print(s, '{n:i}')}`,
    '}',
  ]),
  /** Slide 15: while e do...while com a condição já false. */
  doWhile: bySyntax((s) => [
    int(s, 'i', '5'),
    '{k:while} ({n:i} <= {v:3}) {',
    `  ${print(s, '{v:"while: "} + {n:i}')}`,
    '  {n:i}++;',
    '}',
    '{k:do} {',
    `  ${print(s, '{v:"do: "} + {n:i}')}`,
    '  {n:i}++;',
    '} {k:while} ({n:i} <= {v:3});',
  ]),
  /** Slide 18: contagem regressiva (exercício escolha o valor). */
  countdown: bySyntax((s) => [forCount(s, '@@', '{n:i} >= {v:1}', '{n:i}--'), `  ${print(s, '{n:i}')}`, '}']),
  /** Slide 21: tabuada. */
  table: bySyntax((s) => [
    int(s, 'n', '7'),
    forCount(s, '1', '{n:i} <= {v:5}', '{n:i}++'),
    `  ${print(s, '{n:n} + {v:" x "} + {n:i} + {v:" = "} + {n:n} * {n:i}')}`,
    '}',
  ]),
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 16 (JS/TS): for...in dá os índices como texto. */
  forIn: {
    js: [...fruits('js'), '{k:for} ({k:const} {n:i} {k:in} {n:frutas}) {', '  {f:console.log}({n:i} + {v:1});', '}'].join('\n'),
    ts: [...fruits('ts'), '{k:for} ({k:const} {n:i} {k:in} {n:frutas}) {', '  {f:console.log}({n:i} + {v:1});', '}'].join('\n'),
  },
  /** Slide 17 (Java): remover durante o for-each. */
  removeInForEach: [
    ...fruits('java'),
    '{k:for} ({t:String} {n:fruta} : {n:frutas}) {',
    '  {k:if} ({n:fruta}.{f:equals}({v:"maçã"})) {',
    '    {n:frutas}.{f:remove}({n:fruta});',
    '  }',
    '}',
  ].join('\n'),
};
