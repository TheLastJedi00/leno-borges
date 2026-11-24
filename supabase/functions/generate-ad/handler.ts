import { fixVariation, lintVariation } from '../_shared/copy-lint.ts';
import { GeminiError, generateBackground, generateVariations } from '../_shared/gemini.ts';
import { buildPrompt } from '../_shared/prompt.ts';
import type { AdVariation, Env, GenerateInput, GenerationRow } from '../_shared/types.ts';
import { parseInput, validateVariations } from '../_shared/validate.ts';

/** Tudo o que a funcao toca fora dela, injetado para os testes trocarem por simulacoes. */
export interface Deps {
  env: Env;
  fetch: typeof fetch;
  /** Id do usuario dono do JWT, ou `null` se o token for invalido. */
  getUserId(token: string): Promise<string | null>;
  saveGeneration(row: GenerationRow): Promise<GenerationRow & { created_at: string }>;
  uploadBackground(path: string, bytes: Uint8Array, mimeType: string): Promise<void>;
  newId(): string;
}

const ALLOWED_ORIGINS = [
  'http://localhost:4200',
  'https://lenoborges.com.br',
  'https://www.lenoborges.com.br',
];

const MAX_ATTEMPTS = 2;

const MSG = {
  unauthorized: 'Sessão inválida. Entre de novo.',
  forbidden: 'Acesso negado.',
  method: 'Método não permitido.',
  badJson: 'Corpo da requisição inválido.',
  gemini: 'Não foi possível gerar as peças agora. Tente de novo em instantes.',
  save: 'As peças foram geradas, mas não foi possível salvar. Tente de novo.',
  background: 'Não foi possível gerar o fundo com IA. As peças saíram sem fundo.',
};

function corsHeaders(origin: string | null): HeadersInit {
  if (!origin) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    vary: 'Origin',
  };
}

function reply(status: number, body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
}

const EXTENSION: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

interface Outcome {
  variations: AdVariation[];
}

/**
 * Ate 2 tentativas. A segunda recebe o que a primeira errou (schema ou verificador de texto).
 * No fim, as pecas sao corrigidas sozinhas e o que sobrar no texto sugerido vira `warnings`.
 */
async function writeVariations(deps: Deps, input: GenerateInput): Promise<Outcome | null> {
  let feedback: string[] = [];
  let best: AdVariation[] | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let raw: unknown;
    try {
      raw = await generateVariations(deps.fetch, deps.env, input, buildPrompt(input, feedback));
    } catch (e) {
      if (!(e instanceof GeminiError)) throw e;
      if (best) break; // ja tem uma resposta valida da tentativa anterior: usa ela
      if (attempt === MAX_ATTEMPTS) return null;
      feedback = ['A resposta anterior falhou. Gere de novo no formato pedido.'];
      continue;
    }

    const parsed = validateVariations(raw, input);
    if (!parsed.ok) {
      feedback = [parsed.error];
      continue;
    }
    best = parsed.value;

    feedback = [];
    parsed.value.forEach((v, i) => {
      const lint = lintVariation(v, input.network);
      for (const m of [...lint.pieces, ...lint.caption]) feedback.push(`variação ${i + 1}, ${m}`);
    });
    if (feedback.length === 0) break;
  }

  if (!best) return null;
  return { variations: best.map((v) => finish(v, input)) };
}

function finish(v: AdVariation, input: GenerateInput): AdVariation {
  const fixed = fixVariation(v);
  const left = lintVariation(fixed, input.network);
  const warnings = [...left.pieces, ...left.caption];
  return warnings.length > 0 ? { ...fixed, warnings } : fixed;
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: MSG.forbidden }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== 'POST') return reply(405, { error: MSG.method }, origin);

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token) return reply(401, { error: MSG.unauthorized }, origin);
  const userId = await deps.getUserId(token).catch(() => null);
  if (!userId) return reply(401, { error: MSG.unauthorized }, origin);
  if (userId !== deps.env.OWNER_USER_ID) return reply(403, { error: MSG.forbidden }, origin);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply(422, { error: MSG.badJson }, origin);
  }
  const parsed = parseInput(body);
  if (!parsed.ok) return reply(422, { error: parsed.error }, origin);
  const input = parsed.value;

  // O fundo e gerado em paralelo ao texto; so e enviado ao Storage se o texto der certo.
  const background = input.withBackground
    ? generateBackground(deps.fetch, deps.env, input).then(
        (image) => ({ image }),
        (error: unknown) => ({ error }),
      )
    : null;

  const outcome = await writeVariations(deps, input);
  if (!outcome) {
    await background;
    return reply(502, { error: MSG.gemini }, origin);
  }

  const id = deps.newId();
  let backgroundPath: string | null = null;
  let backgroundError: string | undefined;
  if (background) {
    const result = await background;
    if ('image' in result) {
      const ext = EXTENSION[result.image.mimeType] ?? 'png';
      const path = `${userId}/backgrounds/${id}.${ext}`;
      try {
        await deps.uploadBackground(path, result.image.bytes, result.image.mimeType);
        backgroundPath = path;
      } catch {
        backgroundError = MSG.background;
      }
    } else {
      backgroundError = MSG.background;
    }
  }

  try {
    const generation = await deps.saveGeneration({
      id,
      owner_id: userId,
      theme: input.theme,
      format: input.format,
      network: input.network,
      lang: input.lang,
      slide_count: input.slideCount,
      variations: outcome.variations,
      background_path: backgroundPath,
      model: deps.env.GEMINI_MODEL,
    });
    return reply(200, backgroundError ? { generation, backgroundError } : { generation }, origin);
  } catch {
    return reply(500, { error: MSG.save }, origin);
  }
}
