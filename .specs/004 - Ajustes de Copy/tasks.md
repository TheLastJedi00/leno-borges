# 004, Ajustes de Copy, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/004-ajustes-de-copy`.

## Fase 1, `feat/copy-finops`, remoção de FinOps e do exagero de custo
- [x] 1.1 Reescrever `meta.description` nos 3 dicionários e no `src/index.html`, sem FinOps
- [x] 1.2 Reescrever `hero.tagline` e `about.summaryExtra` em `pt`, `en` e `fr`, conforme o context.md
- [x] 1.3 Remover a métrica "≈ 0%", corrigir o rótulo de "3 h → 1 min" para Matriz do DNA e trocar o grid de métricas para `sm:grid-cols-2`
- [x] 1.4 BF Academy: trocar a tag `FinOps` por `Vercel` e o path FinOps por "Cloud Run → Vercel", nos 3 idiomas
- [x] 1.5 Liga Dev, Matriz do DNA e Delcastanher: remover a tag `FinOps` e as menções a custo zero, conforme a tabela do context.md

## Fase 2, `feat/copy-travessoes`, travessões nos 3 idiomas
- [x] 2.1 Períodos nos 3 dicionários no formato "Desde…" / "… a …" (EN "Since…" / "… to …"; FR "Depuis…" / "De… à…")
- [x] 2.2 Remover os travessões restantes de `pt.ts`, `en.ts` e `fr.ts` (`meta.title`, `header.home`, módulo de mentoria, `languages.title`) e do `<title>` do `src/index.html`
- [x] 2.3 Registrar no `CLAUDE.md` as regras de copy: sem FinOps/"custo zero" e sem travessão em nenhum idioma

## Encerramento
- [x] Varredura: `grep -ri finops src` e `grep -rn "—" src/app/i18n src/index.html` vazios
- [x] Merge das fases na branch `release/004-ajustes-de-copy`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: hero, Sobre com 2 métricas em 375/768/1440px, tags e paths dos cards (BF Academy com Vercel), períodos sem travessão nos 3 idiomas, `<title>`/meta nos 3 idiomas

## Decisões tomadas na execução
- No francês, o período encerrado ficou "D’oct. 2025 à nov. 2025" (elisão de "de" antes de vogal)
- O `CLAUDE.md` também passou a documentar como ligar o botão de link de uma experiência (`projectUrls` + `url`), que tinha ficado de fora na spec 003
- O `resume.md` (spec 001) **não** foi alterado: o site agora diverge dele de propósito em FinOps/custo. Recomendado ajustar o currículo (PDF/LinkedIn) e citar a migração Cloud Run → Vercel
- O texto em francês continua precisando da revisão de um falante nativo
