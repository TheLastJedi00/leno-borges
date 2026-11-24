-- Spec 013: bucket privado das pecas (fundos gerados e PNGs exportados).
-- Caminho: <owner_id>/backgrounds/<geracao>.png e <owner_id>/exports/<geracao>/v<n>.png.
-- A regra e por pasta (primeiro nivel = auth.uid()), pois a Edge Function envia com a
-- chave de servico e esses arquivos nao teriam owner_id.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ads', 'ads', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "dono le os arquivos de ads"
  on storage.objects for select to authenticated
  using (bucket_id = 'ads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "dono envia arquivos para ads"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'ads' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "dono apaga arquivos de ads"
  on storage.objects for delete to authenticated
  using (bucket_id = 'ads' and (storage.foldername(name))[1] = (select auth.uid())::text);
