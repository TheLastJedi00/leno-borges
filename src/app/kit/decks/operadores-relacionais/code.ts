import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. Trechos de `code` têm as três
// sintaxes (teste de paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
// Largura: até ~35 caracteres por linha em slides com baús ou balança, ~45 sem.
type Snippet = Record<Syntax, CodeMarkup>;

export const code = {
  /** Slide 5: a resposta vai para um baú. */
  store: {
    js: `{k:let} {n:idade} = {v:20};
{k:let} {n:maior} = {n:idade} >= {v:18};
{n:idade} = {v:15};
{n:maior} = {n:idade} >= {v:18};`,
    ts: `{k:let} {n:idade}: {t:number} = {v:20};
{k:let} {n:maior}: {t:boolean} = {n:idade} >= {v:18};
{n:idade} = {v:15};
{n:maior} = {n:idade} >= {v:18};`,
    java: `{t:int} {n:idade} = {v:20};
{t:boolean} {n:maior} = {n:idade} >= {v:18};
{n:idade} = {v:15};
{n:maior} = {n:idade} >= {v:18};`,
  },
  /** Slide 10: comparar textos. */
  texts: {
    js: `{k:let} {n:nome} = {v:"Ana"};
{f:console.log}({n:nome} === {v:"Ana"});
{f:console.log}({n:nome} === {v:"ana"});`,
    ts: `{k:let} {n:nome}: {t:string} = {v:"Ana"};
{f:console.log}({n:nome} === {v:"Ana"});
{f:console.log}({n:nome} === {v:"ana"});`,
    java: `{t:String} {n:nome} = {v:"Ana"};
{f:System.out.println}({n:nome}.{f:equals}({v:"Ana"}));
{f:System.out.println}({n:nome}.{f:equals}({v:"ana"}));`,
  },
  /** Slide 12: ordem alfabética. Java compara com compareTo (`<` não vale para String). */
  order: {
    js: `{f:console.log}({v:"banana"} < {v:"maçã"});
{f:console.log}({v:"Zebra"} < {v:"abelha"});
{f:console.log}({v:"10"} < {v:"9"});`,
    ts: `{f:console.log}({v:"banana"} < {v:"maçã"});
{f:console.log}({v:"Zebra"} < {v:"abelha"});
{f:console.log}({v:"10"} < {v:"9"});`,
    java: `{t:String} {n:a} = {v:"Zebra"};
{t:String} {n:b} = {v:"abelha"};
{f:System.out.println}({n:a}.{f:compareTo}({n:b}));
{f:System.out.println}({n:a}.{f:compareTo}({n:b}) < {v:0});`,
  },
  /** Slide 14: qual baú guarda false? */
  predictFalse: {
    js: `{k:let} {n:a} = {v:4};
{k:let} {n:b} = {n:a} * {v:2} > {v:7};
{k:let} {n:c} = {n:a} % {v:2} === {v:1};
{k:let} {n:d} = {n:a} + {v:1} >= {v:5};`,
    ts: `{k:let} {n:a}: {t:number} = {v:4};
{k:let} {n:b}: {t:boolean} = {n:a} * {v:2} > {v:7};
{k:let} {n:c}: {t:boolean} = {n:a} % {v:2} === {v:1};
{k:let} {n:d}: {t:boolean} = {n:a} + {v:1} >= {v:5};`,
    java: `{t:int} {n:a} = {v:4};
{t:boolean} {n:b} = {n:a} * {v:2} > {v:7};
{t:boolean} {n:c} = {n:a} % {v:2} == {v:1};
{t:boolean} {n:d} = {n:a} + {v:1} >= {v:5};`,
  },
  /** Slide 15: 0.1 + 0.2 == 0.3. TS infere `perto` para a linha caber. */
  float: {
    js: `{k:let} {n:soma} = {v:0.1} + {v:0.2};
{f:console.log}({n:soma} === {v:0.3});
{k:let} {n:perto} = {f:Math.abs}({n:soma} - {v:0.3}) < {v:1e-9};
{f:console.log}({n:perto});`,
    ts: `{k:let} {n:soma}: {t:number} = {v:0.1} + {v:0.2};
{f:console.log}({n:soma} === {v:0.3});
{k:let} {n:perto} = {f:Math.abs}({n:soma} - {v:0.3}) < {v:1e-9};
{f:console.log}({n:perto});`,
    java: `{t:double} {n:soma} = {v:0.1} + {v:0.2};
{f:System.out.println}({n:soma} == {v:0.3});
{t:boolean} {n:perto} = {f:Math.abs}({n:soma} - {v:0.3}) < {v:1e-9};
{f:System.out.println}({n:perto});`,
  },
  /** Slide 16: NaN não é igual a nada. */
  nan: {
    js: `{f:console.log}({v:NaN} === {v:NaN});
{f:console.log}({t:Number}.{f:isNaN}({v:0} / {v:0}));`,
    ts: `{f:console.log}({v:NaN} === {v:NaN});
{f:console.log}({t:Number}.{f:isNaN}({v:0} / {v:0}));`,
    java: `{f:System.out.println}({t:Double}.{v:NaN} == {t:Double}.{v:NaN});
{f:System.out.println}({t:Double}.{f:isNaN}({v:0.0} / {v:0}));`,
  },
  /** Slide 17: 3 > 2 > 1. */
  chain: {
    js: `{f:console.log}({v:1} < {v:2} < {v:3});
{f:console.log}({v:3} > {v:2} > {v:1});`,
    ts: `{f:console.log}({v:1} < {v:2} < {v:3});
{f:console.log}({v:3} > {v:2} > {v:1});`,
    java: `{f:System.out.println}({v:1} < {v:2} < {v:3});
{f:System.out.println}({v:3} > {v:2} > {v:1});`,
  },
  /** Slide 18: par como verdadeiro ou falso. */
  even: {
    js: `{k:let} {n:num} = {v:7};
{k:let} {n:par} = {n:num} % {v:2} === {v:0};
{n:num} = {v:10};
{n:par} = {n:num} % {v:2} === {v:0};`,
    ts: `{k:let} {n:num}: {t:number} = {v:7};
{k:let} {n:par}: {t:boolean} = {n:num} % {v:2} === {v:0};
{n:num} = {v:10};
{n:par} = {n:num} % {v:2} === {v:0};`,
    java: `{t:int} {n:num} = {v:7};
{t:boolean} {n:par} = {n:num} % {v:2} == {v:0};
{n:num} = {v:10};
{n:par} = {n:num} % {v:2} == {v:0};`,
  },
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 9 (JS/TS): == ou ===. */
  looseEquals: `{f:console.log}({v:"5"} == {v:5});
{f:console.log}({v:"5"} === {v:5});`,
  /** Slide 11 (Java): == em texto compara se é o mesmo objeto. */
  javaStringEquals: `{t:String} {n:a} = {v:"Ana"};
{t:String} {n:b} = {k:new} {t:String}({v:"Ana"});
{f:System.out.println}({n:a} == {n:b});
{f:System.out.println}({n:a}.{f:equals}({n:b}));`,
};
