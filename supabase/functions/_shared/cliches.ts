/**
 * Expressoes que denunciam texto escrito por IA, nos tres idiomas. Ampliavel: cada item e um
 * regex (sem diferenciar maiuscula) e o nome mostrado nas violacoes e nas novas tentativas.
 */
export interface Cliche {
  name: string;
  pattern: RegExp;
}

const c = (name: string, pattern: RegExp): Cliche => ({ name, pattern });

export const CLICHES: Cliche[] = [
  // PT
  c('o jogo virou', /\b(o\s+jogo\s+virou|virar\s+o\s+jogo|virou\s+o\s+jogo)\b/i),
  c('mudar o jogo', /\bmudar\s+o\s+jogo\b/i),
  c('próximo nível', /\bpr[óo]ximo\s+n[íi]vel\b/i),
  c('no mundo de hoje', /\bno\s+mundo\s+de\s+hoje\b/i),
  c('em um mundo cada vez mais', /\bem\s+um\s+mundo\s+cada\s+vez\s+mais\b/i),
  c('não é sobre X, é sobre Y', /\bn[ãa]o\s+[ée]\s+sobre\b[^.!?\n]{1,80},\s*[ée]\s+sobre\b/i),
  c('spoiler', /\bspoiler\s*:/i),
  c('bora', /\bbora\b/i),
  c('vamos juntos', /\bvamos\s+juntos\b/i),
  c('jornada', /\bjornada\b/i),
  c('mergulhe', /\bmergulh(e|ar|emos)\b/i),
  c('desbloqueie', /\bdesbloquei(e|a|ar)\b/i),
  c('revolucionar', /\brevolucion(ar|e|a|ou|ário|ária)\b/i),
  c('transformador', /\btransformador(a|es|as)?\b/i),
  c('sem mais delongas', /\bsem\s+mais\s+delongas\b/i),
  c('a verdade é que', /\ba\s+verdade\s+[ée]\s+que\b/i),
  c('e o melhor:', /\be\s+o\s+melhor\s*:/i),
  // EN
  c('game changer', /\bgame[\s-]?chang(er|ing)\b/i),
  c('next level', /\bnext[\s-]level\b/i),
  c("in today's fast-paced world", /\bin\s+today['’]s\s+(fast[\s-]paced\s+)?(world|landscape)\b/i),
  c("it's not about X, it's about Y", /\bit['’]?s\s+not\s+about\b[^.!?\n]{1,80},\s*it['’]?s\s+about\b/i),
  c("let's dive in", /\b(let['’]s\s+)?dive\s+(in|into|deep)\b/i),
  c('delve', /\bdelv(e|es|ing)\b/i),
  c('unlock', /\bunlock(ing|s)?\b/i),
  c('revolutionize', /\brevolutioni[sz](e|es|ed|ing)\b/i),
  c('think outside the box', /\bthink\s+outside\s+the\s+box\b/i),
  c('the truth is', /\bthe\s+truth\s+is\b/i),
  c('journey', /\b(learning|career|coding)?\s*journey\b/i),
  // FR
  c("à l'ère du numérique", /(?<![\p{L}])[àa]\s+l['’]\s*[èe]re\s+(du\s+num[ée]rique|de\s+l['’]\s*ia)\b/iu),
  c("ce n'est pas X, c'est Y", /\bce\s+n['’]est\s+pas\s+(une?\s+question\s+)?de\b[^.!?\n]{1,80},\s*c['’]est\b/i),
  c('plongez', /\bplong(ez|eons|er)\s+(dans|au\s+c[œo]ur)\b/i),
  c('changer la donne', /\bchang(er|e|ez)\s+la\s+donne\b/i),
  c('à un autre niveau', /(?<![\p{L}])[àa]\s+un\s+autre\s+niveau\b/iu),
  c('révolutionner', /\br[ée]volutionn(er|e|ez)\b/i),
];

/** Regras de copy do projeto (CLAUDE.md): nada de FinOps nem de promessa de custo zero. */
export const PROJECT_RULES: Cliche[] = [
  c('FinOps', /\bfinops\b/i),
  c('promessa de custo zero', /\b(zero|near[\s-]?zero|quase\s+zero|z[ée]ro)[\s-]+(cost|custo|co[ûu]t)\b|\b(custo|co[ûu]t)\s+(zero|z[ée]ro)\b/i),
];
