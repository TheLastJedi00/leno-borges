import { Injectable, inject } from '@angular/core';
import type { Generation } from '../ads/ad.types';
import { Supabase } from './supabase';

const BUCKET = 'ads';
const TABLE = 'ad_generations';

/** Acesso ao historico do gerador (tabela `ad_generations` e bucket `ads`, ambos com RLS). */
@Injectable({ providedIn: 'root' })
export class AdHistory {
  private readonly client = inject(Supabase).client;

  /** Total de geracoes do dono; `null` se a consulta falhar (o card some o numero, nao quebra). */
  async count(): Promise<number | null> {
    const { count, error } = await this.client.from(TABLE).select('id', { count: 'exact', head: true });
    return error ? null : (count ?? 0);
  }

  /** Geracoes mais novas primeiro. */
  async list(limit = 50): Promise<Generation[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error('Não foi possível carregar o histórico.');
    return (data ?? []) as Generation[];
  }

  /** Apaga a geracao e os arquivos dela (fundo e PNGs exportados). */
  async remove(g: Generation & { owner_id?: string }): Promise<void> {
    const paths: string[] = [];
    if (g.background_path) paths.push(g.background_path);

    const owner = g.owner_id ?? g.background_path?.split('/')[0];
    if (owner) {
      const folder = `${owner}/exports/${g.id}`;
      const { data: files } = await this.client.storage.from(BUCKET).list(folder);
      for (const f of files ?? []) paths.push(`${folder}/${f.name}`);
    }
    if (paths.length > 0) await this.client.storage.from(BUCKET).remove(paths);

    const { error } = await this.client.from(TABLE).delete().eq('id', g.id);
    if (error) throw new Error('Não foi possível excluir a geração.');
  }
}
