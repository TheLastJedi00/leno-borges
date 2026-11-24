import { BACKGROUND_BRIEF } from './brand.ts';
import type { Env, GenerateInput } from './types.ts';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Falha ao falar com o Gemini. A mensagem nunca leva a chave nem o corpo da requisicao. */
export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

type Level = 'minimal' | 'low' | 'medium' | 'high';
const LEVELS: Level[] = ['minimal', 'low', 'medium', 'high'];
/** Orcamento equivalente, para modelos que so aceitam `thinkingBudget`. */
const BUDGET: Record<Level, number> = { minimal: 512, low: 1024, medium: 4096, high: 8192 };

function level(raw: string): Level {
  return LEVELS.includes(raw as Level) ? (raw as Level) : 'medium';
}

// deno-lint-ignore no-explicit-any
type Json = any;

async function post(fetchFn: typeof fetch, env: Env, model: string, body: unknown): Promise<Json> {
  let res: Response;
  try {
    res = await fetchFn(`${BASE_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GeminiError('Não foi possível falar com o Gemini.');
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const detail: string = json?.error?.message ?? '';
    throw new GeminiError(`Gemini respondeu ${res.status}${detail ? `: ${detail}` : ''}`, res.status);
  }
  return json;
}

/** Texto da resposta (ignora partes de "pensamento"). */
function textOf(json: Json): string {
  const parts: Json[] = json?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text)
    .join('');
}

const str = { type: 'STRING' };

/** Teto de saida: o HTML de um carrossel de 10 slides passa facil de 20 mil tokens. */
const MAX_OUTPUT_TOKENS = 49152;

/** Schema da saida estruturada: uma variacao, com o texto e o HTML de cada slide. */
export function responseSchema(input: GenerateInput) {
  return {
    type: 'OBJECT',
    properties: {
      angle: str,
      slides: {
        type: 'ARRAY',
        minItems: input.slideCount,
        maxItems: input.slideCount,
        items: {
          type: 'OBJECT',
          properties: { kicker: str, title: str, body: str, cta: str, html: str },
          required: ['title', 'html'],
        },
      },
      caption: str,
      hashtags: { type: 'ARRAY', items: str },
    },
    required: ['angle', 'slides', 'caption', 'hashtags'],
  };
}

/** Pede uma variacao ao `GEMINI_MODEL`, com saida estruturada e raciocinio no nivel configurado. */
export async function generateVariation(
  fetchFn: typeof fetch,
  env: Env,
  input: GenerateInput,
  prompt: { system: string; user: string },
): Promise<unknown> {
  const lvl = level(env.GEMINI_THINKING_LEVEL);
  const request = (thinkingConfig: Record<string, unknown>) => ({
    systemInstruction: { parts: [{ text: prompt.system }] },
    contents: [{ role: 'user', parts: [{ text: prompt.user }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema(input),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      thinkingConfig,
    },
  });

  let json: Json;
  try {
    json = await post(fetchFn, env, env.GEMINI_MODEL, request({ thinkingLevel: lvl }));
  } catch (e) {
    // Modelos mais antigos so aceitam orcamento de raciocinio: repete uma vez nesse formato.
    if (e instanceof GeminiError && e.status === 400 && /think/i.test(e.message)) {
      json = await post(fetchFn, env, env.GEMINI_MODEL, request({ thinkingBudget: BUDGET[lvl] }));
    } else {
      throw e;
    }
  }

  try {
    return JSON.parse(textOf(json));
  } catch {
    throw new GeminiError('A resposta do Gemini não veio em JSON válido.');
  }
}

const ASPECT: Record<GenerateInput['format'], string> = { story: '9:16', carousel: '1:1', post: '3:4' };

export interface BackgroundImage {
  bytes: Uint8Array;
  mimeType: string;
}

/** Gera o fundo opcional (uma imagem por geracao) na proporcao do formato, sem texto. */
export async function generateBackground(
  fetchFn: typeof fetch,
  env: Env,
  input: GenerateInput,
): Promise<BackgroundImage> {
  const json = await post(fetchFn, env, env.GEMINI_IMAGE_MODEL, {
    contents: [{ role: 'user', parts: [{ text: `${BACKGROUND_BRIEF} Proporção ${ASPECT[input.format]}.` }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: ASPECT[input.format] },
    },
  });
  const parts: Json[] = json?.candidates?.[0]?.content?.parts ?? [];
  const image = parts.find((p) => p.inlineData?.data)?.inlineData;
  if (!image) throw new GeminiError('O Gemini não devolveu a imagem de fundo.');
  const binary = atob(image.data as string);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return { bytes, mimeType: (image.mimeType as string) ?? 'image/png' };
}
