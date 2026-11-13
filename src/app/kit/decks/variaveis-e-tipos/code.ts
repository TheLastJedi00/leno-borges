import type { CodeMarkup, Syntax } from '../../kit.data';

// Trechos de código da aula por sintaxe. Marcação: {k:palavra-chave} {t:tipo} {n:nome} {v:valor}
// {f:função} {c:comentário}; o resto é pontuação. Cada trecho tem as três sintaxes (teste de paridade).
type Snippet = Record<Syntax, CodeMarkup>;

export const code = {
  /** Slide 7: do baú para o código. */
  declare: {
    js: '{k:let} {n:idade} = {v:25};',
    ts: '{k:let} {n:idade}: {t:number} = {v:25};',
    java: '{t:int} {n:idade} = {v:25};',
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
} satisfies Record<string, Snippet>;
