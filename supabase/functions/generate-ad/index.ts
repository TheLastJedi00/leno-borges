import { createClient } from 'npm:@supabase/supabase-js@2';
import type { Env, GenerationRow } from '../_shared/types.ts';
import { type Deps, handle } from './handler.ts';

const REQUIRED = [
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'GEMINI_THINKING_LEVEL',
  'GEMINI_IMAGE_MODEL',
  'OWNER_USER_ID',
] as const;

function buildDeps(): Deps | null {
  const env = {} as Env;
  for (const key of REQUIRED) {
    const value = Deno.env.get(key);
    if (!value) return null;
    env[key] = value;
  }
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;

  // Chave de servico: so aqui na funcao. O dono ja foi conferido antes de qualquer escrita.
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  return {
    env,
    fetch,
    async getUserId(token) {
      const { data, error } = await admin.auth.getUser(token);
      return error ? null : (data.user?.id ?? null);
    },
    async saveGeneration(row: GenerationRow) {
      const { data, error } = await admin.from('ad_generations').insert(row).select().single();
      if (error) throw error;
      return data;
    },
    async uploadBackground(path, bytes, mimeType) {
      const { error } = await admin.storage.from('ads').upload(path, bytes, { contentType: mimeType, upsert: true });
      if (error) throw error;
    },
    newId: () => crypto.randomUUID(),
  };
}

Deno.serve((req) => {
  const deps = buildDeps();
  if (!deps) {
    return new Response(JSON.stringify({ error: 'Configuração da função incompleta.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
  return handle(req, deps);
});
