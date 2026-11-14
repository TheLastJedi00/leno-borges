import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. `@@` é o valor trocado em cada
// etapa da cena (ou escolhido no exercício). Trechos de `code` têm as três sintaxes (teste de
// paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
// Largura: até ~35 caracteres por linha em slides com ilustração, ~45 sem.
type Snippet = Record<Syntax, CodeMarkup>;

/** Uma linha de `console.log` / `System.out.println` com texto, indentada. */
const print = (s: Syntax, text: string, indent = '  ') =>
  s === 'java' ? `${indent}{f:System.out.println}({v:"${text}"});` : `${indent}{f:console.log}({v:"${text}"});`;

/** Declaração de número com o valor `@@`. */
const num = (s: Syntax, name: string, javaType = 'int') =>
  s === 'java'
    ? `{t:${javaType}} {n:${name}} = {v:@@};`
    : s === 'ts'
      ? `{k:let} {n:${name}}: {t:number} = {v:@@};`
      : `{k:let} {n:${name}} = {v:@@};`;

const eq = (s: Syntax) => (s === 'java' ? '==' : '===');

const bySyntax = (build: (s: Syntax) => string): Snippet => ({
  js: build('js'),
  ts: build('ts'),
  java: build('java'),
});

/** Conceito pela nota, nesta ordem de condições. */
const grades = (order: [string, string][]) =>
  bySyntax((s) =>
    [
      num(s, 'nota', 'double'),
      ...order.map(
        ([min, text], i) =>
          `${i ? '} {k:else} {k:if}' : '{k:if}'} ({n:nota} >= {v:${min}}) {\n${print(s, text)}`,
      ),
      `} {k:else} {\n${print(s, 'Reprovado')}\n}`,
    ].join('\n'),
  );

export const code = {
  /** Slide 3: if sem else, e o programa segue depois do bloco. */
  ifOnly: bySyntax((s) =>
    [num(s, 'idade'), `{k:if} ({n:idade} >= {v:18}) {`, print(s, 'Entra'), '}', print(s, 'Fim', '')].join('\n'),
  ),
  /** Slide 4: if / else. */
  ifElse: bySyntax((s) =>
    [num(s, 'idade'), `{k:if} ({n:idade} >= {v:18}) {`, print(s, 'Entra'), '} {k:else} {', print(s, 'Não entra'), '}'].join(
      '\n',
    ),
  ),
  /** Slide 6: o bloco pulado não mexe no saldo. */
  predictBalance: {
    js: `{k:let} {n:saldo} = {v:50};
{k:let} {n:preco} = {v:80};
{k:if} ({n:saldo} >= {n:preco}) {
  {n:saldo} = {n:saldo} - {n:preco};
}
{f:console.log}({n:saldo});`,
    ts: `{k:let} {n:saldo}: {t:number} = {v:50};
{k:let} {n:preco}: {t:number} = {v:80};
{k:if} ({n:saldo} >= {n:preco}) {
  {n:saldo} = {n:saldo} - {n:preco};
}
{f:console.log}({n:saldo});`,
    java: `{t:int} {n:saldo} = {v:50};
{t:int} {n:preco} = {v:80};
{k:if} ({n:saldo} >= {n:preco}) {
  {n:saldo} = {n:saldo} - {n:preco};
}
{f:System.out.println}({n:saldo});`,
  },
  /** Slides 7 e 10: else if, da condição mais exigente para a menos. */
  grades: grades([
    ['9', 'A'],
    ['7', 'B'],
    ['5', 'C'],
  ]),
  /** Slide 8: as mesmas perguntas na ordem errada. */
  gradesWrongOrder: grades([
    ['5', 'C'],
    ['7', 'B'],
    ['9', 'A'],
  ]),
  /** Slide 12: sem chaves, só a primeira linha pertence ao if. */
  noBraces: bySyntax((s) =>
    [
      s === 'java' ? '{t:int} {n:saldo} = {v:0};' : s === 'ts' ? '{k:let} {n:saldo}: {t:number} = {v:0};' : '{k:let} {n:saldo} = {v:0};',
      '{k:if} ({n:saldo} > {v:0})',
      print(s, 'Pode sacar'),
      print(s, 'Saque feito'),
    ].join('\n'),
  ),
  /** Slide 13: = dentro do if. */
  assignInIf: bySyntax((s) =>
    [
      s === 'java' ? '{t:int} {n:x} = {v:3};' : s === 'ts' ? '{k:let} {n:x}: {t:number} = {v:3};' : '{k:let} {n:x} = {v:3};',
      '{k:if} ({n:x} = {v:5}) {',
      print(s, 'Entrou'),
      '}',
      s === 'java' ? '{f:System.out.println}({n:x});' : '{f:console.log}({n:x});',
    ].join('\n'),
  ),
  /** Slide 16: if dentro de if, uma mensagem para cada falta. */
  nested: {
    js: `{k:let} {n:idade} = {v:20};
{k:let} {n:ingresso} = {v:false};
{k:if} ({n:idade} >= {v:18}) {
  {k:if} ({n:ingresso}) {
    {f:console.log}({v:"Entra"});
  } {k:else} {
    {f:console.log}({v:"Compre o ingresso"});
  }
}`,
    ts: `{k:let} {n:idade}: {t:number} = {v:20};
{k:let} {n:ingresso}: {t:boolean} = {v:false};
{k:if} ({n:idade} >= {v:18}) {
  {k:if} ({n:ingresso}) {
    {f:console.log}({v:"Entra"});
  } {k:else} {
    {f:console.log}({v:"Compre o ingresso"});
  }
}`,
    java: `{t:int} {n:idade} = {v:20};
{t:boolean} {n:ingresso} = {v:false};
{k:if} ({n:idade} >= {v:18}) {
  {k:if} ({n:ingresso}) {
    {f:System.out.println}({v:"Entra"});
  } {k:else} {
    {f:System.out.println}({v:"Compre o ingresso"});
  }
}`,
  },
  /** Slide 18: par ou ímpar, prometido na aula 2. */
  evenOdd: bySyntax((s) =>
    [
      num(s, 'numero'),
      `{k:if} ({n:numero} % {v:2} ${eq(s)} {v:0}) {`,
      print(s, 'Par'),
      '} {k:else} {',
      print(s, 'Ímpar'),
      '}',
    ].join('\n'),
  ),
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 14 (JS/TS): texto vazio conta como falso. */
  truthy: {
    js: `{k:let} {n:nome} = {v:""};
{k:if} ({n:nome}) {
  {f:console.log}({v:"Olá, "} + {n:nome});
} {k:else} {
  {f:console.log}({v:"Digite seu nome"});
}`,
    ts: `{k:let} {n:nome}: {t:string} = {v:""};
{k:if} ({n:nome}) {
  {f:console.log}({v:"Olá, "} + {n:nome});
} {k:else} {
  {f:console.log}({v:"Digite seu nome"});
}`,
  },
  /** Slide 15 (Java): a condição precisa ser boolean. */
  javaBoolean: `{t:int} {n:x} = {v:1};
{k:if} ({n:x}) {
  {f:System.out.println}({v:"Entrou"});
}`,
};
