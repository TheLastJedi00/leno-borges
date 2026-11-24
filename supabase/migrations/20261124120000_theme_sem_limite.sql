-- Fix: o tema da geracao deixa de ter limite maximo (antes 3 a 500 caracteres).
alter table public.ad_generations drop constraint if exists ad_generations_theme_check;
alter table public.ad_generations
  add constraint ad_generations_theme_check check (char_length(theme) >= 3);
