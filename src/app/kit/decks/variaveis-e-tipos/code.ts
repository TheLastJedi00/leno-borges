import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação. Trechos `all` têm as três sintaxes (teste de
// paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
type Snippet = Record<Syntax, CodeMarkup>;

export const code = {
  /** Slide 7: do baú para o código. */
  declare: {
    js: '{k:let} {n:idade} = {v:25};',
    ts: '{k:let} {n:idade}: {t:number} = {v:25};',
    java: '{t:int} {n:idade} = {v:25};',
  },
  /** Slide 8: ler o valor pela etiqueta. */
  read: {
    js: `{k:let} {n:idade} = {v:25};
{f:console.log}({n:idade});`,
    ts: `{k:let} {n:idade}: {t:number} = {v:25};
{f:console.log}({n:idade});`,
    java: `{t:int} {n:idade} = {v:25};
{f:System.out.println}({n:idade});`,
  },
  /** Slide 9: trocar o conteúdo do baú. */
  reassign: {
    js: `{k:let} {n:idade} = {v:25};
{n:idade} = {v:26};`,
    ts: `{k:let} {n:idade}: {t:number} = {v:25};
{n:idade} = {v:26};`,
    java: `{t:int} {n:idade} = {v:25};
{n:idade} = {v:26};`,
  },
  /** Slide 10: usar o próprio valor para mudar. */
  update: {
    js: `{k:let} {n:pontos} = {v:0};
{n:pontos} = {n:pontos} + {v:10};
{n:pontos} += {v:10};
{n:pontos}++;`,
    ts: `{k:let} {n:pontos}: {t:number} = {v:0};
{n:pontos} = {n:pontos} + {v:10};
{n:pontos} += {v:10};
{n:pontos}++;`,
    java: `{t:int} {n:pontos} = {v:0};
{n:pontos} = {n:pontos} + {v:10};
{n:pontos} += {v:10};
{n:pontos}++;`,
  },
  /** Slide 11: baú trancado. */
  constant: {
    js: `{k:const} {n:PI} = {v:3.14};
{n:PI} = {v:3};`,
    ts: `{k:const} {n:PI}: {t:number} = {v:3.14};
{n:PI} = {v:3};`,
    java: `{k:final} {t:double} {n:PI} = {v:3.14};
{n:PI} = {v:3};`,
  },
  /** Slide 12: baú sem nada dentro. */
  empty: {
    js: `{k:let} {n:nome};
{f:console.log}({n:nome});`,
    ts: `{k:let} {n:nome}: {t:string};
{f:console.log}({n:nome});`,
    java: `{t:String} {n:nome};
{f:System.out.println}({n:nome});`,
  },
  /** Slide 16: item errado no baú errado. */
  mismatch: {
    js: `{k:let} {n:idade} = {v:25};
{n:idade} = {v:"vinte"};
{f:console.log}({k:typeof} {n:idade});`,
    ts: `{k:let} {n:idade}: {t:number} = {v:25};
{n:idade} = {v:"vinte"};`,
    java: `{t:int} {n:idade} = {v:25};
{n:idade} = {v:"vinte"};`,
  },
  /** Slide 17: "5" não é 5. */
  quotes: {
    js: `{f:console.log}({v:"5"} + {v:5});
{f:console.log}({v:5} + {v:5});`,
    ts: `{f:console.log}({v:"5"} + {v:5});
{f:console.log}({v:5} + {v:5});`,
    java: `{f:System.out.println}({v:"5"} + {v:5});
{f:System.out.println}({v:5} + {v:5});`,
  },
  /** Slide 18: 0.1 + 0.2. */
  float: {
    js: '{f:console.log}({v:0.1} + {v:0.2});',
    ts: '{f:console.log}({v:0.1} + {v:0.2});',
    java: '{f:System.out.println}({v:0.1} + {v:0.2});',
  },
  /** Slide 19: o baú tem tamanho. */
  size: {
    js: `{f:console.log}({t:Number}.MAX_SAFE_INTEGER);
{f:console.log}({v:9007199254740992} + {v:1});
{f:console.log}({v:9007199254740992n} + {v:1n});`,
    ts: `{f:console.log}({t:Number}.MAX_SAFE_INTEGER);
{f:console.log}({v:9007199254740992} + {v:1});
{f:console.log}({v:9007199254740992n} + {v:1n});`,
    java: `{t:int} {n:maximo} = {v:2147483647};
{n:maximo} = {n:maximo} + {v:1};
{f:System.out.println}({n:maximo});`,
  },
  /** Slide 24: qual o valor final? */
  predict: {
    js: `{k:let} {n:a} = {v:5};
{k:let} {n:b} = {n:a};
{n:a} = {v:10};
{n:b} = {n:b} + {n:a};`,
    ts: `{k:let} {n:a}: {t:number} = {v:5};
{k:let} {n:b}: {t:number} = {n:a};
{n:a} = {v:10};
{n:b} = {n:b} + {n:a};`,
    java: `{t:int} {n:a} = {v:5};
{t:int} {n:b} = {n:a};
{n:a} = {v:10};
{n:b} = {n:b} + {n:a};`,
  },
  /** Slide 25: trocar os itens de dois baús. */
  swap: {
    js: `{k:let} {n:a} = {v:"maçã"};
{k:let} {n:b} = {v:"uva"};
{k:let} {n:aux} = {n:a};
{n:a} = {n:b};
{n:b} = {n:aux};`,
    ts: `{k:let} {n:a}: {t:string} = {v:"maçã"};
{k:let} {n:b}: {t:string} = {v:"uva"};
{k:let} {n:aux}: {t:string} = {n:a};
{n:a} = {n:b};
{n:b} = {n:aux};`,
    java: `{t:String} {n:a} = {v:"maçã"};
{t:String} {n:b} = {v:"uva"};
{t:String} {n:aux} = {n:a};
{n:a} = {n:b};
{n:b} = {n:aux};`,
  },
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 20 (JS/TS): typeof null. */
  typeofNull: `{f:console.log}({k:typeof} {v:25});
{f:console.log}({k:typeof} {v:"Ana"});
{f:console.log}({k:typeof} {v:null});`,
  /** Slide 21 (Java): char e String. */
  charString: `{t:char} {n:letra} = {v:'A'};
{t:String} {n:nome} = {v:"Ana"};
{t:char} {n:erro} = {v:"A"};`,
};
