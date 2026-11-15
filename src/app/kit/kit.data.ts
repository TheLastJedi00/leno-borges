// Tipos e catálogo do Kit de Ensino. Textos de catálogo (títulos, resumos) ficam nos dicionários
// (chave `kit`); o conteúdo de cada aula fica no deck, carregado sob demanda.
// Spec: .specs/006 - Kit de Ensino/context.md

export type Syntax = 'js' | 'ts' | 'java';
export const SYNTAXES: readonly Syntax[] = ['js', 'ts', 'java'];

/** Nomes das linguagens (marcas, neutros de idioma). `long` casa com o mapa do `tech-icon`. */
export const syntaxNames: Record<Syntax, { short: string; long: string }> = {
  js: { short: 'JS', long: 'JavaScript' },
  ts: { short: 'TS', long: 'TypeScript' },
  java: { short: 'Java', long: 'Java' },
};

/** Roteiro da apresentação: só os slides essenciais ou todos (essenciais + aprofundamentos). */
export type Mode = 'essencial' | 'completo';
export const MODES: readonly Mode[] = ['essencial', 'completo'];

export type TrackId = 'logica-de-programacao';
export type LessonId =
  | 'variaveis-e-tipos'
  | 'operadores-aritmeticos'
  | 'operadores-relacionais'
  | 'operadores-logicos'
  | 'condicionais'
  | 'switch-case'
  | 'listas'
  | 'lacos-de-repeticao';

export interface Lesson {
  slug: LessonId;
  syntaxes: Syntax[];
  /** Quantidade de slides por roteiro, mostrada no catálogo (um teste confere com o deck). */
  counts: { essencial: number; completo: number };
  /** Carrega o deck sob demanda (um chunk por aula). */
  load: () => Promise<Deck>;
}

export interface Track {
  slug: TrackId;
  lessons: Lesson[];
}

// ---------------------------------------------------------------------------
// Deck e slides

/** Texto que muda com a sintaxe ativa (ou igual para todas). */
export type BySyntax<T = string> = T | Partial<Record<Syntax, T>>;

export function pick<T>(value: BySyntax<T> | undefined, syntax: Syntax): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Partial<Record<Syntax, T>>;
    if (SYNTAXES.some((s) => s in record)) return record[syntax];
  }
  return value as T;
}

/**
 * Trecho de código com tokens marcados por papel: `{k:let} {n:idade} = {v:25};`.
 * Papéis: k palavra-chave, t tipo, n nome (etiqueta), v valor (item), f função, c comentário.
 * Texto fora de `{x:...}` é pontuação ou operador.
 */
export type CodeMarkup = string;
export type TokenRole = 'k' | 't' | 'n' | 'v' | 'f' | 'c';

/** Formato do baú (tipo do valor). `any` é o baú do JavaScript, que aceita qualquer coisa. */
export type ChestShape = 'text' | 'int' | 'decimal' | 'bool' | 'any';

export interface ChestState {
  /** Identidade estável do baú entre etapas (para animar em vez de recriar). */
  id: string;
  label?: string;
  item?: string;
  shape?: ChestShape;
  /** Nome do tipo escrito no baú, por sintaxe. */
  typeName?: BySyntax;
  open?: boolean;
  locked?: boolean;
  address?: string;
  /** Parte do baú em destaque. */
  focus?: 'label' | 'item' | 'type' | 'chest' | 'address';
  error?: boolean;
  dim?: boolean;
}

/** Comparação desenhada na balança: um item em cada prato, operador no centro e a resposta. */
export interface Compare {
  left: string;
  op: string;
  right: string;
  /** Etiqueta do baú de onde veio o item (opcional). */
  leftLabel?: string;
  rightLabel?: string;
  /** Sem valor, a balança ainda não respondeu (a turma palpita). */
  result?: boolean;
}

/** Ligação dos interruptores: em série (&&), em paralelo (||) ou com inversor (!). */
export type CircuitMode = 'and' | 'or' | 'not';

/** Circuito da aula de operadores lógicos: a lâmpada é calculada dos interruptores. */
export interface CircuitState {
  mode: CircuitMode;
  /** Interruptores ligados (true) ou desligados; `not` usa só o primeiro. */
  switches: boolean[];
  /** Etiqueta de cada interruptor (nome da condição). */
  labels?: string[];
}

/** A lâmpada acende? É o resultado da expressão lógica do circuito. */
export function lampOn(mode: CircuitMode, switches: readonly boolean[]): boolean {
  const [a = false, b = false] = switches;
  switch (mode) {
    case 'and':
      return a && b;
    case 'or':
      return a || b;
    case 'not':
      return !a;
  }
}

/** Expressão do circuito com as etiquetas: `a && b`, `a || b`, `!a`. */
export function circuitExpression(mode: CircuitMode, labels: readonly string[] = ['a', 'b']): string {
  const [a = 'a', b = 'b'] = labels;
  return mode === 'and' ? `${a} && ${b}` : mode === 'or' ? `${a} || ${b}` : `!${a}`;
}

/**
 * Fluxograma de `if` / `else` / `else if`: uma fila de losangos (condições) que desce. Cada
 * losango tem a saída `true` (para a direita, até o que roda) e a `false` (para baixo, até o
 * próximo losango). Com uma saída a mais que condições, a última é o `else`.
 */
export interface FlowState {
  /** Condição de cada losango, em ordem (`idade >= 18`). */
  conditions: string[];
  /** O que roda em cada caminho `true`, mais o `else` opcional no fim. */
  outcomes: string[];
  /** Respostas dos losangos já perguntados; o caminho é calculado a partir delas. */
  answers: boolean[];
}

/**
 * Caminho da execução: quantos losangos foram perguntados e qual saída roda (índice em
 * `outcomes`), `'none'` quando nada roda (`if` sem `else` com resposta false) ou `null` enquanto
 * a decisão não terminou. Para no primeiro `true`: as condições seguintes nem são perguntadas.
 */
export function flowRoute(state: FlowState): { asked: number; taken: number | 'none' | null } {
  const n = state.conditions.length;
  const firstTrue = state.answers.slice(0, n).indexOf(true);
  if (firstTrue >= 0) return { asked: firstTrue + 1, taken: firstTrue };
  const asked = Math.min(state.answers.length, n);
  if (asked < n) return { asked, taken: null };
  return { asked, taken: state.outcomes.length > n ? n : 'none' };
}

/** Um escaninho da triagem do `switch`: a etiqueta do `case` e o que roda dentro dele. */
export interface SorterCase {
  /** Valor do `case` como no código (`1`, `"verde"`); vários separados por vírgula (`6, 7`). */
  label: string;
  /** O que o bloco imprime (`"Domingo"`); vazio quando não imprime nada. */
  out?: string;
  /** Tem `break` no fim: a queda para aqui. */
  brk?: boolean;
}

/**
 * Triagem do `switch`: o valor é um item que desce e cai no escaninho com a etiqueta igual (ou no
 * `default`). Sem `break`, continua caindo nos de baixo.
 */
export interface SorterState {
  value: string;
  cases: SorterCase[];
  /** `default` no fim, com o que imprime; sem ele, um valor sem etiqueta não cai em nada. */
  fallback?: { out?: string };
  /** O item já caiu (sem valor: ainda está no alto, antes da comparação). */
  dropped?: boolean;
}

/**
 * Onde o item cai e quais escaninhos rodam: `landed` é o índice do escaninho (o `default` é o
 * índice `cases.length`) ou `null` quando não cai em nada; `ran` são os que rodam, do que caiu até
 * o primeiro `break` (ou o fim). A comparação é a do texto: `"5"` não é `5`, como no `===`.
 */
export function sorterRoute(state: SorterState): { landed: number | null; ran: number[] } {
  if (!state.dropped) return { landed: null, ran: [] };
  const n = state.cases.length;
  let landed: number | null = state.cases.findIndex((c) =>
    c.label.split(',').map((l) => l.trim()).includes(state.value),
  );
  if (landed < 0) landed = state.fallback ? n : null;
  if (landed === null) return { landed, ran: [] };
  const ran: number[] = [];
  for (let i = landed; i <= n; i++) {
    if (i === n && !state.fallback) break;
    ran.push(i);
    if (i < n && state.cases[i].brk) break;
  }
  return { landed, ran };
}

/** Uma gaveta do gaveteiro: `id` estável entre etapas (para animar) e o valor como no código. */
export interface ListItem {
  id: string;
  value: string;
}

/**
 * Gaveteiro da lista: um nome, gavetas lado a lado e o índice de cada uma (a partir do 0). O
 * índice não é guardado: é a posição da gaveta, e muda quando outra entra ou sai antes dela.
 */
export interface ListState {
  name: string;
  items: ListItem[];
  /** Índice da gaveta em destaque (lida, trocada, encontrada). */
  focus?: number | null;
  /** Índice pedido que não existe: mostra uma gaveta fantasma em vermelho. */
  outside?: number | null;
  /** Tamanho fixo (array do Java): gaveteiro parafusado, sem lugar para gaveta nova. */
  fixed?: boolean;
}

/**
 * Pista do laço: a condição no portão, o corpo e a seta que volta. `laps` são as voltas já
 * completadas; `answer` é a resposta da condição nesta etapa (`null` = ainda não perguntou).
 */
export interface LoopState {
  condition: string;
  body: string[];
  /** Começo do `for` (`let i = 1`), antes da pista. */
  init?: string;
  /** Passo do `for` (`i++`), no fim de cada volta. */
  update?: string;
  /** `do`: o corpo vem antes da condição (`do...while`). */
  kind?: 'while' | 'do';
  laps: number;
  answer: boolean | null;
}

/** Um baú em miniatura dentro de uma sala da pilha: o nome e o valor como no código. */
export interface StackVar {
  name: string;
  value: string;
}

/** Uma sala da pilha de chamadas. Sem `name`, é o próprio arquivo (JS/TS, que não tem `main`). */
export interface StackFrame {
  name?: string;
  vars?: StackVar[];
}

/**
 * Pilha de chamadas: `frames[0]` é a sala de baixo (`main` no Java, o arquivo no JS/TS) e a última
 * é a que está rodando. `returning` é o valor que o `return` está entregando: sai da sala do topo,
 * que fecha na etapa seguinte.
 */
export interface StackState {
  frames: StackFrame[];
  returning?: string | null;
}

/** Estado de uma etapa; cada etapa herda a anterior e sobrescreve só o que declara. */
export interface SceneStep {
  caption?: BySyntax;
  chests?: BySyntax<ChestState[]>;
  /** Quantas linhas do código estão visíveis. */
  lines?: number;
  /** Papel de token em destaque no código (as demais partes ficam apagadas). */
  highlight?: BySyntax<TokenRole | null>;
  /** Linha em destaque (base 1), usada para acompanhar a execução. */
  activeLine?: BySyntax<number | null>;
  /** Linhas (base 1) que não rodam nesta etapa: ficam apagadas, mostrando o caminho da execução. */
  skip?: BySyntax<number[]> | null;
  /** Valor que entra no lugar de `@@` no código do slide nesta etapa (a mesma cena com outro valor). */
  value?: string;
  output?: BySyntax | null;
  outputTone?: BySyntax<'ok' | 'error'>;
  /** Balança da comparação; `null` tira a balança da cena. */
  compare?: BySyntax<Compare> | null;
  /** Circuito de interruptores e lâmpada; `null` tira o circuito da cena. */
  circuit?: CircuitState | null;
  /** Fluxograma do if / else; `null` tira o fluxograma da cena. */
  flow?: BySyntax<FlowState> | null;
  /** Triagem do switch; `null` tira a triagem da cena. */
  sorter?: BySyntax<SorterState> | null;
  /** Gaveteiro da lista; `null` tira o gaveteiro da cena. */
  list?: BySyntax<ListState> | null;
  /** Pista do laço; `null` tira a pista da cena. */
  loop?: BySyntax<LoopState> | null;
  /** Pilha de chamadas; `null` tira a pilha da cena. */
  stack?: BySyntax<StackState> | null;
}

interface SlideBase {
  /** Identidade estável do slide (mapeia a posição ao trocar de roteiro ou sintaxe). */
  id: string;
  title: string;
  /** `core` aparece em todos os roteiros; `extra` só no Completo. */
  depth: 'core' | 'extra';
  /** Selo dos slides `extra` ("Aprofundamento", "Curiosidade"). */
  tag?: string;
  /** Sem valor, vale para todas as sintaxes da aula; com valor, só aparece nelas. */
  syntaxes?: Syntax[];
  /** Tópicos da fala do apresentador. */
  notes: string[];
  /** Descrição da ilustração para leitor de tela. */
  description?: string;
}

export interface CoverSlide extends SlideBase {
  kind: 'cover';
  eyebrow: string;
  subtitle: string;
}

export interface SceneSlide extends SlideBase {
  kind: 'scene';
  code?: BySyntax<CodeMarkup>;
  /** O código não deve rodar (laço infinito): as conferências de JS e Java pulam o slide. */
  noRun?: boolean;
  steps: SceneStep[];
}

export interface CardItem {
  title: string;
  value?: BySyntax;
  text?: BySyntax;
  tone?: 'good' | 'bad' | 'neutral';
}

export interface CardsSlide extends SlideBase {
  kind: 'cards';
  lead?: BySyntax;
  /** Um card por etapa (a primeira etapa já mostra o primeiro card). */
  cards: CardItem[];
  columns?: 2 | 3 | 4;
}

export interface TableSlide extends SlideBase {
  kind: 'table';
  head: string[];
  rows: BySyntax<string[][]>;
  footnote?: BySyntax;
}

export interface SortItem {
  value: string;
  bin: string;
}

export interface SortSlide extends SlideBase {
  kind: 'sort';
  lead: string;
  bins: { id: string; shape: ChestShape; label: BySyntax }[];
  items: SortItem[];
}

export interface PredictSlide extends SlideBase {
  kind: 'predict';
  question: string;
  code: BySyntax<CodeMarkup>;
  options: string[];
  answer: number;
  explanation: string;
  /** Execução revelada passo a passo depois da resposta. */
  trace: SceneStep[];
}

/** Uma linha da conta: a expressão como está nesta etapa. */
export interface ExprStep {
  /** Mesma marcação do código; `[[ ]]` marca o trecho calculado nesta etapa. */
  expr: BySyntax<CodeMarkup>;
  caption?: BySyntax;
  /** Começa uma conta nova (as linhas anteriores saem). */
  reset?: boolean;
  /** Substitui a linha anterior em vez de acrescentar (ex.: destacar o trecho antes de calcular). */
  replace?: boolean;
  /** Linha com o resultado final da conta. */
  result?: boolean;
}

/** Avaliação de expressão passo a passo: cada etapa acrescenta uma linha à "escada" da conta. */
export interface ExprSlide extends SlideBase {
  kind: 'expr';
  steps: ExprStep[];
}

/** Tabela-verdade: uma linha a mais por etapa (a primeira etapa já mostra a primeira linha). */
export interface TruthSlide extends SlideBase {
  kind: 'truth';
  lead?: BySyntax;
  /** Cabeçalho de cada coluna, com a marcação de código (`{n:a} && {n:b}`). */
  head: BySyntax<string[]>;
  rows: boolean[][];
  /** Colunas de resultado (índices), destacadas; as demais são as entradas. */
  results: number[];
  footnote?: BySyntax;
}

/** Coluna do teste de mesa: o título e, para a conferência, o que ela mostra. */
export interface TraceColumn {
  /** Título com a marcação de código (`{n:i} <= {v:3}`). */
  head: BySyntax<CodeMarkup>;
  /** Expressão em JS avaliada a cada volta (a conferência compara com a célula). */
  js?: string;
  /** Coluna com o que a volta imprime. Sem `js` nem `out`, é um rótulo (o número da volta). */
  out?: boolean;
}

export interface TraceRow {
  cells: string[];
  /** Linha do código em destaque nesta linha da tabela. */
  line?: BySyntax<number>;
}

/**
 * Teste de mesa: o código e uma tabela com o valor das variáveis a cada volta, revelada uma linha
 * por etapa. A conferência roda o código em JS anotando as colunas antes da linha `at` (a cada
 * volta) e antes da linha `end` (depois do laço).
 */
export interface TraceSlide extends SlideBase {
  kind: 'trace';
  lead?: BySyntax;
  code: BySyntax<CodeMarkup>;
  columns: TraceColumn[];
  rows: TraceRow[];
  /** Linha do código JS (base 1) antes da qual cada volta é anotada. */
  at: number;
  /** Linha do código JS (base 1) depois do laço; além da última linha, anota no fim. */
  end?: number;
}

/** Um desafio do exercício de circuito: ligar e desligar os interruptores até cumprir o objetivo. */
export interface CircuitChallenge {
  mode: CircuitMode;
  labels?: string[];
  /** Interruptores no começo do desafio. */
  start: boolean[];
  /** true: acender a lâmpada; false: apagar. */
  goal: boolean;
}

/** Exercício interativo de circuito: vários desafios no mesmo slide. */
export interface CircuitSlide extends SlideBase {
  kind: 'circuit';
  lead: string;
  challenges: CircuitChallenge[];
}

/** Um valor que a turma pode escolher no exercício `branch`. */
export interface BranchChoice {
  /** Valor como aparece no código (`8`, `"verde"`). */
  value: string;
  /** Respostas dos losangos com esse valor (fluxograma). A triagem acha o `case` sozinha. */
  answers?: boolean[];
  /** O que o programa imprime com esse valor; `""` quando nada aparece. */
  output: BySyntax;
  /** Voltas do laço com esse valor (pista). */
  laps?: number;
  /** Valor que a função devolve com esse valor, como no código (`"Aprovado"`) (pilha). */
  returns?: string;
}

/**
 * Exercício "escolha o valor": a turma troca o valor da variável e vê qual caminho o programa
 * segue. Cada desafio pede uma saída; o caminho e a saída de cada valor ficam no deck (o teste do
 * deck roda o código em JS com cada valor para conferir).
 */
export interface BranchSlide extends SlideBase {
  kind: 'branch';
  lead: string;
  /** Nome da variável que a turma troca. */
  variable: string;
  /** Código com `@@` no lugar do valor escolhido. */
  code: BySyntax<CodeMarkup>;
  /** Fluxograma sem as respostas (vêm do valor escolhido). */
  flow?: BySyntax<Omit<FlowState, 'answers'>>;
  /** Triagem sem o valor (vem do valor escolhido). */
  sorter?: BySyntax<Omit<SorterState, 'value' | 'dropped'>>;
  /** Gaveteiro; o valor escolhido é o índice lido (em destaque, ou fantasma se não existir). */
  list?: BySyntax<Omit<ListState, 'focus' | 'outside'>>;
  /** Pista do laço; as voltas vêm do valor escolhido (`laps`), já terminadas. */
  loop?: BySyntax<Omit<LoopState, 'laps' | 'answer'>>;
  /**
   * Pilha de chamadas: o baú com o nome de `variable` recebe o valor escolhido e a sala do topo
   * devolve o `returns` do valor.
   */
  stack?: BySyntax<Omit<StackState, 'returning'>>;
  choices: BranchChoice[];
  /** Valor escolhido no começo (índice em `choices`). */
  start?: number;
  /** Saídas que cada desafio pede, em ordem. */
  goals: string[];
}

export type Slide =
  | CoverSlide
  | SceneSlide
  | CardsSlide
  | TableSlide
  | SortSlide
  | PredictSlide
  | ExprSlide
  | TruthSlide
  | CircuitSlide
  | BranchSlide
  | TraceSlide;

export interface Deck {
  slides: Slide[];
}

/** Quantas etapas o slide tem (avançar percorre as etapas antes de trocar de slide). */
export function stepCount(slide: Slide): number {
  switch (slide.kind) {
    case 'cover':
    case 'table':
    case 'sort':
    case 'circuit':
    case 'branch':
      return 1;
    case 'scene':
    case 'expr':
      return Math.max(1, slide.steps.length);
    case 'cards':
      return Math.max(1, slide.cards.length);
    case 'truth':
    case 'trace':
      return Math.max(1, slide.rows.length);
    case 'predict':
      return 1 + slide.trace.length;
  }
}

// ---------------------------------------------------------------------------
// Catálogo

export const tracks: Track[] = [
  {
    slug: 'logica-de-programacao',
    lessons: [
      {
        slug: 'variaveis-e-tipos',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 25 },
        load: () => import('./decks/variaveis-e-tipos/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'operadores-aritmeticos',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 22 },
        load: () => import('./decks/operadores-aritmeticos/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'operadores-relacionais',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 18 },
        load: () => import('./decks/operadores-relacionais/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'operadores-logicos',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 17 },
        load: () => import('./decks/operadores-logicos/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'condicionais',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 18 },
        load: () => import('./decks/condicionais/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'switch-case',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 16 },
        load: () => import('./decks/switch-case/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'listas',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 21 },
        load: () => import('./decks/listas/deck.pt').then((m) => m.deck),
      },
      {
        slug: 'lacos-de-repeticao',
        syntaxes: ['js', 'ts', 'java'],
        counts: { essencial: 10, completo: 21 },
        load: () => import('./decks/lacos-de-repeticao/deck.pt').then((m) => m.deck),
      },
    ],
  },
];

export function findLesson(
  trackSlug: string | null | undefined,
  lessonSlug: string | null | undefined,
): { track: Track; lesson: Lesson } | undefined {
  const track = tracks.find((t) => t.slug === trackSlug);
  const lesson = track?.lessons.find((l) => l.slug === lessonSlug);
  return track && lesson ? { track, lesson } : undefined;
}

/** Aula seguinte na mesma trilha (convite "seguir para a próxima aula" no fim da apresentação). */
export function nextLesson(
  trackSlug: string | null | undefined,
  lessonSlug: string | null | undefined,
  list: Track[] = tracks,
): Lesson | undefined {
  const lessons = list.find((t) => t.slug === trackSlug)?.lessons ?? [];
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  return index >= 0 ? lessons[index + 1] : undefined;
}

export function lessonPath(track: TrackId, lesson: LessonId): string {
  return `/kit/${track}/${lesson}`;
}
