import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação e operadores. Trechos de `code` têm as três
// sintaxes (teste de paridade); os de `only` existem só para os slides exclusivos de uma sintaxe.
// Largura: até ~35 caracteres por linha em slides com ilustração, ~45 sem.
type Snippet = Record<Syntax, CodeMarkup>;

export const code = {
  /** Slide 9: faixa de valores. */
  range: {
    js: `{k:let} {n:nota} = {v:7.5};
{f:console.log}({n:nota} >= {v:0} && {n:nota} <= {v:10});
{n:nota} = {v:12};
{f:console.log}({n:nota} >= {v:0} && {n:nota} <= {v:10});`,
    ts: `{k:let} {n:nota}: {t:number} = {v:7.5};
{f:console.log}({n:nota} >= {v:0} && {n:nota} <= {v:10});
{n:nota} = {v:12};
{f:console.log}({n:nota} >= {v:0} && {n:nota} <= {v:10});`,
    java: `{t:double} {n:nota} = {v:7.5};
{f:System.out.println}({n:nota} >= {v:0} && {n:nota} <= {v:10});
{n:nota} = {v:12};
{f:System.out.println}({n:nota} >= {v:0} && {n:nota} <= {v:10});`,
  },
  /** Slide 11: qual baú guarda true? */
  predictTrue: {
    js: `{k:let} {n:n} = {v:7};
{k:let} {n:a} = {n:n} > {v:5} && {n:n} < {v:10};
{k:let} {n:b} = {n:n} < {v:5} || {n:n} > {v:8};
{k:let} {n:c} = !({n:n} === {v:7});`,
    ts: `{k:let} {n:n}: {t:number} = {v:7};
{k:let} {n:a}: {t:boolean} = {n:n} > {v:5} && {n:n} < {v:10};
{k:let} {n:b}: {t:boolean} = {n:n} < {v:5} || {n:n} > {v:8};
{k:let} {n:c}: {t:boolean} = !({n:n} === {v:7});`,
    java: `{t:int} {n:n} = {v:7};
{t:boolean} {n:a} = {n:n} > {v:5} && {n:n} < {v:10};
{t:boolean} {n:b} = {n:n} < {v:5} || {n:n} > {v:8};
{t:boolean} {n:c} = !({n:n} == {v:7});`,
  },
  /** Slide 12: curto-circuito. */
  shortCircuit: {
    js: `{k:let} {n:x} = {v:0};
{f:console.log}({n:x} !== {v:0} && {v:10} / {n:x} > {v:2});
{f:console.log}({n:x} === {v:0} || {v:10} / {n:x} > {v:2});`,
    ts: `{k:let} {n:x}: {t:number} = {v:0};
{f:console.log}({n:x} !== {v:0} && {v:10} / {n:x} > {v:2});
{f:console.log}({n:x} === {v:0} || {v:10} / {n:x} > {v:2});`,
    java: `{t:int} {n:x} = {v:0};
{f:System.out.println}({n:x} != {v:0} && {v:10} / {n:x} > {v:2});
{f:System.out.println}({n:x} == {v:0} || {v:10} / {n:x} > {v:2});`,
  },
  /** Slide 17: ano bissexto. TS infere `bissexto` para a linha caber. */
  leapYear: {
    js: `{k:let} {n:ano} = {v:2024};
{k:let} {n:d4} = {n:ano} % {v:4} === {v:0};
{k:let} {n:d100} = {n:ano} % {v:100} === {v:0};
{k:let} {n:d400} = {n:ano} % {v:400} === {v:0};
{k:let} {n:bissexto} = ({n:d4} && !{n:d100}) || {n:d400};
{f:console.log}({n:bissexto});`,
    ts: `{k:let} {n:ano}: {t:number} = {v:2024};
{k:let} {n:d4}: {t:boolean} = {n:ano} % {v:4} === {v:0};
{k:let} {n:d100}: {t:boolean} = {n:ano} % {v:100} === {v:0};
{k:let} {n:d400}: {t:boolean} = {n:ano} % {v:400} === {v:0};
{k:let} {n:bissexto} = ({n:d4} && !{n:d100}) || {n:d400};
{f:console.log}({n:bissexto});`,
    java: `{t:int} {n:ano} = {v:2024};
{t:boolean} {n:d4} = {n:ano} % {v:4} == {v:0};
{t:boolean} {n:d100} = {n:ano} % {v:100} == {v:0};
{t:boolean} {n:d400} = {n:ano} % {v:400} == {v:0};
{t:boolean} {n:bissexto} = ({n:d4} && !{n:d100}) || {n:d400};
{f:System.out.println}({n:bissexto});`,
  },
} satisfies Record<string, Snippet>;

/** Trechos de slides exclusivos de uma sintaxe (`syntaxes` no slide). */
export const only = {
  /** Slide 13 (Java): & e | sem curto-circuito. */
  javaNoShortCircuit: `{t:int} {n:x} = {v:0};
{f:System.out.println}({n:x} != {v:0} && {v:10} / {n:x} > {v:2});
{f:System.out.println}({n:x} != {v:0} & {v:10} / {n:x} > {v:2});`,
  /** Slide 14 (JS/TS): || e ?? devolvem um valor. */
  fallback: {
    js: `{k:let} {n:nome} = {v:""};
{f:console.log}({n:nome} || {v:"Visitante"});
{k:let} {n:qtd} = {v:0};
{f:console.log}({n:qtd} || {v:10});
{f:console.log}({n:qtd} ?? {v:10});`,
    ts: `{k:let} {n:nome}: {t:string} = {v:""};
{f:console.log}({n:nome} || {v:"Visitante"});
{k:let} {n:qtd}: {t:number} = {v:0};
{f:console.log}({n:qtd} || {v:10});
{f:console.log}({n:qtd} ?? {v:10});`,
  },
};
