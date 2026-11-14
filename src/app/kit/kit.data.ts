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
export type LessonId = 'variaveis-e-tipos';

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
  output?: BySyntax | null;
  outputTone?: BySyntax<'ok' | 'error'>;
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
  /** Linha com o resultado final da conta. */
  result?: boolean;
}

/** Avaliação de expressão passo a passo: cada etapa acrescenta uma linha à "escada" da conta. */
export interface ExprSlide extends SlideBase {
  kind: 'expr';
  steps: ExprStep[];
}

export type Slide =
  | CoverSlide
  | SceneSlide
  | CardsSlide
  | TableSlide
  | SortSlide
  | PredictSlide
  | ExprSlide;

export interface Deck {
  slides: Slide[];
}

/** Quantas etapas o slide tem (avançar percorre as etapas antes de trocar de slide). */
export function stepCount(slide: Slide): number {
  switch (slide.kind) {
    case 'cover':
    case 'table':
    case 'sort':
      return 1;
    case 'scene':
    case 'expr':
      return Math.max(1, slide.steps.length);
    case 'cards':
      return Math.max(1, slide.cards.length);
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
