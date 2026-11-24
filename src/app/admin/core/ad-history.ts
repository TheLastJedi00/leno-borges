import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';

/** Acesso ao historico do gerador (tabela `ad_generations`, protegida por RLS). */
@Injectable({ providedIn: 'root' })
export class AdHistory {
  private readonly client = inject(Supabase).client;

  /** Total de geracoes do dono; `null` se a consulta falhar (o card some o numero, nao quebra). */
  async count(): Promise<number | null> {
    const { count, error } = await this.client
      .from('ad_generations')
      .select('id', { count: 'exact', head: true });
    return error ? null : (count ?? 0);
  }
}
