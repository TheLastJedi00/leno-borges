import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. `@@` é o valor trocado em cada
// etapa da cena (ou escolhido no exercício). Trechos de `code` têm as três sintaxes (teste de
// paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
// Os `case` curtos ficam numa linha (`case 1: ...; break;`); a fonte encolhe para a linha caber.
type Snippet = Record<Syntax, CodeMarkup>;

const log = (s: Syntax) => (s === 'java' ? '{f:System.out.println}' : '{f:console.log}');
/** `console.log("texto");` ou `System.out.println("texto");`. */
const say = (s: Syntax, text: string) => `${log(s)}({v:"${text}"});`;

/** Declaração com o valor `@@` (ou outro) e o tipo de cada sintaxe. */
const decl = (s: Syntax, name: string, kind: 'int' | 'string', value = '@@') => {
  const type = kind === 'int' ? { ts: 'number', java: 'int' } : { ts: 'string', java: 'String' };
  if (s === 'java') return `{t:${type.java}} {n:${name}} = {v:${value}};`;
  if (s === 'ts') return `{k:let} {n:${name}}: {t:${type.ts}} = {v:${value}};`;
  return `{k:let} {n:${name}} = {v:${value}};`;
};

/** `  case 1: console.log("Dom"); break;` (sem break quando `brk` é false; sem saída se vazia). */
const kase = (s: Syntax, label: string, text = '', brk = true) =>
  `  {k:case} {v:${label}}:` + (text ? ` ${say(s, text)}` : '') + (brk ? ' {k:break};' : '');
const otherwise = (s: Syntax, text: string) => `  {k:default}: ${say(s, text)}`;

const bySyntax = (build: (s: Syntax) => string[]): Snippet => ({
  js: build('js').join('\n'),
  ts: build('ts').join('\n'),
  java: build('java').join('\n'),
});

const eq = (s: Syntax) => (s === 'java' ? '==' : '===');

export const code = {
  /** Slide 2: else if repetindo `dia ===` em toda pergunta. */
  elseIfDays: bySyntax((s) => [
    decl(s, 'dia', 'int', '2'),
    `{k:if} ({n:dia} ${eq(s)} {v:1}) {`,
    `  ${say(s, 'Dom')}`,
    `} {k:else} {k:if} ({n:dia} ${eq(s)} {v:2}) {`,
    `  ${say(s, 'Seg')}`,
    `} {k:else} {k:if} ({n:dia} ${eq(s)} {v:3}) {`,
    `  ${say(s, 'Ter')}`,
    '}',
  ]),
  /** Slide 3: o valor procura a etiqueta. */
  days: bySyntax((s) => [
    decl(s, 'dia', 'int'),
    '{k:switch} ({n:dia}) {',
    kase(s, '1', 'Dom'),
    kase(s, '2', 'Seg'),
    kase(s, '3', 'Ter'),
    '}',
  ]),
  /** Slide 4: default. */
  daysDefault: bySyntax((s) => [
    decl(s, 'dia', 'int'),
    '{k:switch} ({n:dia}) {',
    kase(s, '1', 'Dom'),
    kase(s, '2', 'Seg'),
    otherwise(s, 'Inválido'),
    '}',
  ]),
  /** Slides 5 e 15: sem break, a execução cai nos de baixo até um break. */
  fallThrough: bySyntax((s) => [
    decl(s, 'dia', 'int'),
    '{k:switch} ({n:dia}) {',
    kase(s, '1', 'Dom', false),
    kase(s, '2', 'Seg', false),
    kase(s, '3', 'Ter'),
    otherwise(s, 'Inválido'),
    '}',
  ]),
  /** Slide 6: um break esquecido no menu. */
  predictMenu: bySyntax((s) => [
    decl(s, 'op', 'int', '2'),
    '{k:switch} ({n:op}) {',
    kase(s, '1', 'Abrir'),
    kase(s, '2', 'Salvar', false),
    kase(s, '3', 'Sair'),
    '}',
  ]),
  /** Slide 7: dois case juntos de propósito (1 = domingo, 7 = sábado). */
  dayOff: bySyntax((s) => [
    decl(s, 'dia', 'int'),
    '{k:switch} ({n:dia}) {',
    kase(s, '1', '', false),
    kase(s, '7', 'Folga'),
    otherwise(s, 'Trabalho'),
    '}',
  ]),
  /** Slide 8: switch com texto. */
  traffic: bySyntax((s) => [
    decl(s, 'cor', 'string', '"amarelo"'),
    '{k:switch} ({n:cor}) {',
    kase(s, '"verde"', 'Siga'),
    kase(s, '"amarelo"', 'Atenção'),
    kase(s, '"vermelho"', 'Pare'),
    '}',
  ]),
  /** Slide 17: calculadora, com o if da aula 5 protegendo a divisão. */
  calculator: bySyntax((s) => [
    decl(s, 'op', 'string', '"/"'),
    s === 'java'
      ? '{t:int} {n:a} = {v:10}, {n:b} = {v:@@};'
      : s === 'ts'
        ? '{k:let} {n:a}: {t:number} = {v:10}, {n:b}: {t:number} = {v:@@};'
        : '{k:let} {n:a} = {v:10}, {n:b} = {v:@@};',
    '{k:switch} ({n:op}) {',
    `  {k:case} {v:"+"}: ${log(s)}({n:a} + {n:b}); {k:break};`,
    `  {k:case} {v:"/"}:`,
    `    {k:if} ({n:b} ${s === 'java' ? '!=' : '!=='} {v:0}) { ${log(s)}({n:a} / {n:b}); }`,
    '    {k:break};',
    '}',
  ]),
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 9 (JS/TS): o switch compara com ===. */
  strict: {
    js: [decl('js', 'entrada', 'string', '"5"'), '{k:switch} ({n:entrada}) {', kase('js', '5', 'cinco'), otherwise('js', 'outro'), '}'].join('\n'),
    ts: [decl('ts', 'entrada', 'string', '"5"'), '{k:switch} ({n:entrada}) {', kase('ts', '5', 'cinco'), otherwise('ts', 'outro'), '}'].join('\n'),
  },
  /** Slide 10 (Java): case repetido não compila. */
  javaDuplicate: [decl('java', 'dia', 'int', '1'), '{k:switch} ({n:dia}) {', kase('java', '1', 'Dom'), kase('java', '1', 'Seg'), '}'].join('\n'),
  /** Slide 11 (Java): case com seta e switch que devolve valor. */
  javaArrow: `{t:int} {n:dia} = {v:7};
{t:String} {n:tipo} = {k:switch} ({n:dia}) {
  {k:case} {v:1}, {v:7} -> {v:"Folga"};
  {k:default} -> {v:"Trabalho"};
};
{f:System.out.println}({n:tipo});`,
  /** Slide 12 (JS/TS): switch (true) com faixas. */
  switchTrue: {
    js: [decl('js', 'nota', 'int', '8'), '{k:switch} ({v:true}) {', `  {k:case} {n:nota} >= {v:9}: ${say('js', 'A')} {k:break};`, `  {k:case} {n:nota} >= {v:7}: ${say('js', 'B')} {k:break};`, otherwise('js', 'C'), '}'].join('\n'),
    ts: [decl('ts', 'nota', 'int', '8'), '{k:switch} ({v:true}) {', `  {k:case} {n:nota} >= {v:9}: ${say('ts', 'A')} {k:break};`, `  {k:case} {n:nota} >= {v:7}: ${say('ts', 'B')} {k:break};`, otherwise('ts', 'C'), '}'].join('\n'),
  },
};
