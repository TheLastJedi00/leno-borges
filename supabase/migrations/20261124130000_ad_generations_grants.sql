-- Fix: o projeto nao expoe tabelas novas a Data API automaticamente, e a migration da
-- spec 013 criou so o RLS. Sem GRANT, o navegador (authenticated) e a Edge Function
-- (service_role) recebiam "permission denied for table ad_generations" (403).
-- O RLS continua decidindo quais linhas cada um ve: as policies sao por dono.
grant select, insert, delete on public.ad_generations to authenticated;
grant select, insert, update, delete on public.ad_generations to service_role;

-- Visitante sem login nao precisa de nada nesta tabela (TRUNCATE ignora o RLS).
revoke all on public.ad_generations from anon;
revoke truncate, references, trigger on public.ad_generations from authenticated;
