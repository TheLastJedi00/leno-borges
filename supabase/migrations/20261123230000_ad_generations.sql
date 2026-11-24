-- Spec 013: historico do gerador de publicidade (area restrita, dono unico).
create table public.ad_generations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  theme text not null check (char_length(theme) between 3 and 500),
  format text not null check (format in ('story', 'carousel', 'post')),
  network text not null check (network in ('instagram', 'linkedin')),
  lang text not null check (lang in ('en', 'fr', 'pt')),
  slide_count int not null check (slide_count = 1 or slide_count between 3 and 10),
  variations jsonb not null,
  background_path text,
  model text not null
);

create index ad_generations_owner_created_idx
  on public.ad_generations (owner_id, created_at desc);

alter table public.ad_generations enable row level security;

-- Uma policy por operacao; sem update (uma geracao nao muda, gera-se outra).
create policy "dono le as proprias geracoes"
  on public.ad_generations for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "dono grava as proprias geracoes"
  on public.ad_generations for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "dono apaga as proprias geracoes"
  on public.ad_generations for delete to authenticated
  using (owner_id = (select auth.uid()));
