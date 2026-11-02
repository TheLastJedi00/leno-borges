# 004, Ajustes de Copy, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/004-ajustes-de-copy`.

## Fase 1, `feat/copy-finops`, remoção de FinOps e do exagero de custo
- [ ] 1.1 Reescrever `meta.description` nos 3 dicionários e no `src/index.html`, sem FinOps
- [ ] 1.2 Reescrever `hero.tagline` e `about.summaryExtra` em `pt`, `en` e `fr`, conforme o context.md
- [ ] 1.3 Remover a métrica "≈ 0%", corrigir o rótulo de "3 h → 1 min" para Matriz do DNA e trocar o grid de métricas para `sm:grid-cols-2`
- [ ] 1.4 BF Academy: trocar a tag `FinOps` por `Vercel` e o path FinOps por "Cloud Run → Vercel", nos 3 idiomas
- [ ] 1.5 Liga Dev, Matriz do DNA e Delcastanher: remover a tag `FinOps` e as menções a custo zero, conforme a tabela do context.md

## Fase 2, `feat/copy-travessoes`, travessões nos 3 idiomas
- [ ] 2.1 Períodos nos 3 dicionários no formato "Desde…" / "… a …" (EN "Since…" / "… to …"; FR "Depuis…" / "De… à…")
- [ ] 2.2 Remover os travessões restantes de `pt.ts`, `en.ts` e `fr.ts` (`meta.title`, `header.home`, módulo de mentoria, `languages.title`) e do `<title>` do `src/index.html`
- [ ] 2.3 Registrar no `CLAUDE.md` as regras de copy: sem FinOps/"custo zero" e sem travessão em nenhum idioma

## Encerramento
- [ ] Varredura: `grep -ri finops src` e `grep -rn "—" src/app/i18n src/index.html` vazios
- [ ] Merge das fases na branch `release/004-ajustes-de-copy`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: hero, Sobre com 2 métricas em 375/768/1440px, tags e paths dos cards (BF Academy com Vercel), períodos sem travessão nos 3 idiomas, `<title>`/meta nos 3 idiomas
