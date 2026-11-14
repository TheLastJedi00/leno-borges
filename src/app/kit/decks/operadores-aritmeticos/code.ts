import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. Trechos de `code` têm as três
// sintaxes (teste de paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
// Largura: até ~35 caracteres por linha em slides com baús, ~45 sem baús.
type Snippet = Record<Syntax, CodeMarkup>;

export const code = {
  /** Slide 5: o operador abre os baús. */
  multiply: {
    js: `{k:let} {n:preco} = {v:10};
{k:let} {n:qtd} = {v:3};
{k:let} {n:total} = {n:preco} * {n:qtd};`,
    ts: `{k:let} {n:preco}: {t:number} = {v:10};
{k:let} {n:qtd}: {t:number} = {v:3};
{k:let} {n:total}: {t:number} = {n:preco} * {n:qtd};`,
    java: `{t:int} {n:preco} = {v:10};
{t:int} {n:qtd} = {v:3};
{t:int} {n:total} = {n:preco} * {n:qtd};`,
  },
  /** Slide 6: divisão inteira ou decimal. */
  divide: {
    js: `{f:console.log}({v:7} / {v:2});
{f:console.log}({v:7.0} / {v:2});`,
    ts: `{f:console.log}({v:7} / {v:2});
{f:console.log}({v:7.0} / {v:2});`,
    java: `{f:System.out.println}({v:7} / {v:2});
{f:System.out.println}({v:7.0} / {v:2});`,
  },
  /** Slide 13: exercício de prioridade. */
  predictPrecedence: {
    js: `{k:let} {n:a} = {v:20};
{k:let} {n:b} = {v:3};
{k:let} {n:r} = {n:a} * {n:b} - {v:10} / {v:2};`,
    ts: `{k:let} {n:a}: {t:number} = {v:20};
{k:let} {n:b}: {t:number} = {v:3};
{k:let} {n:r}: {t:number} = {n:a} * {n:b} - {v:10} / {v:2};`,
    java: `{t:int} {n:a} = {v:20};
{t:int} {n:b} = {v:3};
{t:int} {n:r} = {n:a} * {n:b} - {v:10} / {v:2};`,
  },
  /** Slide 14: atalhos de atribuição. */
  shortcuts: {
    js: `{k:let} {n:saldo} = {v:100};
{n:saldo} -= {v:30};
{n:saldo} *= {v:2};
{n:saldo} /= {v:4};`,
    ts: `{k:let} {n:saldo}: {t:number} = {v:100};
{n:saldo} -= {v:30};
{n:saldo} *= {v:2};
{n:saldo} /= {v:4};`,
    java: `{t:int} {n:saldo} = {v:100};
{n:saldo} -= {v:30};
{n:saldo} *= {v:2};
{n:saldo} /= {v:4};`,
  },
  /** Slide 15: ++ antes ou depois. */
  increment: {
    js: `{k:let} {n:a} = {v:5};
{k:let} {n:b} = {n:a}++;
{k:let} {n:c} = ++{n:a};`,
    ts: `{k:let} {n:a}: {t:number} = {v:5};
{k:let} {n:b}: {t:number} = {n:a}++;
{k:let} {n:c}: {t:number} = ++{n:a};`,
    java: `{t:int} {n:a} = {v:5};
{t:int} {n:b} = {n:a}++;
{t:int} {n:c} = ++{n:a};`,
  },
  /** Slide 16: exercício com atalhos. */
  predictShortcuts: {
    js: `{k:let} {n:x} = {v:7};
{n:x} += {v:3};
{n:x} %= {v:4};
{n:x} *= {v:5};`,
    ts: `{k:let} {n:x}: {t:number} = {v:7};
{n:x} += {v:3};
{n:x} %= {v:4};
{n:x} *= {v:5};`,
    java: `{t:int} {n:x} = {v:7};
{n:x} += {v:3};
{n:x} %= {v:4};
{n:x} *= {v:5};`,
  },
  /** Slide 17: o + também junta textos. */
  concat: {
    js: `{f:console.log}({v:"Nota: "} + {v:7});
{f:console.log}({v:"1"} + {v:2} + {v:3});
{f:console.log}({v:1} + {v:2} + {v:"3"});`,
    ts: `{f:console.log}({v:"Nota: "} + {v:7});
{f:console.log}({v:"1"} + {v:2} + {v:3});
{f:console.log}({v:1} + {v:2} + {v:"3"});`,
    java: `{f:System.out.println}({v:"Nota: "} + {v:7});
{f:System.out.println}({v:"1"} + {v:2} + {v:3});
{f:System.out.println}({v:1} + {v:2} + {v:"3"});`,
  },
  /** Slide 19: dividir por zero. */
  divideByZero: {
    js: `{f:console.log}({v:10} / {v:0});
{f:console.log}({v:0} / {v:0});
{f:console.log}({v:10} % {v:0});`,
    ts: `{f:console.log}({v:10} / {v:0});
{f:console.log}({v:0} / {v:0});
{f:console.log}({v:10} % {v:0});`,
    java: `{f:System.out.println}({v:10.0} / {v:0});
{f:System.out.println}({v:0.0} / {v:0});
{f:System.out.println}({v:10} / {v:0});`,
  },
  /** Slide 20: potência. */
  power: {
    js: `{f:console.log}({v:2} ** {v:10});
{f:console.log}({v:3} ** {v:2});`,
    ts: `{f:console.log}({v:2} ** {v:10});
{f:console.log}({v:3} ** {v:2});`,
    java: `{f:System.out.println}({f:Math.pow}({v:2}, {v:10}));
{f:System.out.println}({f:Math.pow}({v:3}, {v:2}));`,
  },
  /** Slide 22: segundos em minutos. TS infere `number` nas contas para caber ao lado dos baús. */
  seconds: {
    js: `{k:let} {n:total} = {v:125};
{k:let} {n:min} = {f:Math.floor}({n:total} / {v:60});
{k:let} {n:seg} = {n:total} % {v:60};`,
    ts: `{k:let} {n:total}: {t:number} = {v:125};
{k:let} {n:min} = {f:Math.floor}({n:total} / {v:60});
{k:let} {n:seg} = {n:total} % {v:60};`,
    java: `{t:int} {n:total} = {v:125};
{t:int} {n:min} = {n:total} / {v:60};
{t:int} {n:seg} = {n:total} % {v:60};`,
  },
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 7 (Java): média que perde a vírgula. */
  average: `{t:int} {n:media} = ({v:7} + {v:8}) / {v:2};
{t:double} {n:certa} = ({v:7} + {v:8}) / {v:2.0};`,
  /** Slide 18 (JS/TS): texto em conta. */
  textMath: {
    js: `{f:console.log}({v:"6"} * {v:2});
{f:console.log}({v:"6"} + {v:2});
{f:console.log}({v:"abc"} * {v:2});`,
    ts: `{f:console.log}({v:"6"} * {v:2});
{f:console.log}({v:"6"} + {v:2});
{f:console.log}({v:"abc"} * {v:2});`,
  },
};
