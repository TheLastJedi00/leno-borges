import { Injectable, inject } from '@angular/core';
import { FunctionsHttpError } from '@supabase/supabase-js';
import type { GenerateRequest, Generation } from '../ads/ad.types';
import { Supabase } from './supabase';

export interface GenerateResult {
  generation: Generation;
  /** Aviso quando so o fundo com IA falhou (as pecas sairam sem fundo). */
  backgroundError?: string;
}

const FALLBACK = 'Não foi possível gerar as peças. Tente de novo.';

@Injectable({ providedIn: 'root' })
export class AdApi {
  private readonly client = inject(Supabase).client;

  /** Chama a Edge Function. Erros chegam como `Error` com a mensagem em PT vinda da funcao. */
  async generate(request: GenerateRequest): Promise<GenerateResult> {
    const { data, error } = await this.client.functions.invoke<GenerateResult>('generate-ad', {
      body: request,
    });
    if (error) {
      let message = FALLBACK;
      if (error instanceof FunctionsHttpError) {
        const body = await error.context.json().catch(() => null);
        if (typeof body?.error === 'string') message = body.error;
      }
      throw new Error(message);
    }
    if (!data?.generation) throw new Error(FALLBACK);
    return data;
  }
}
