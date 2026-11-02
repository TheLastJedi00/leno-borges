# 003, Links de Projetos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/003-links-de-projetos`.

## Fase 1, `feat/links-botao`, botão de link para o sistema
- [x] 1.1 Adicionar `projectUrls` e `displayUrl()` em `home.data.ts`, e `url?: string` na interface `Experience`
- [x] 1.2 Adicionar `experience.visit` e `experience.newTab` ao `Dictionary` e aos dicionários `en`, `fr` e `pt`
- [x] 1.3 Inputs `url`, `visitLabel` e `newTabLabel` no `ExperienceCard`, com o botão secundário (`target="_blank"`, `rel="noopener noreferrer"`, `↗` com `aria-hidden`, aviso em `sr-only`) e o binding na Home
- [x] 1.4 Ligar `url` nos itens Tichr e BF Academy nos três dicionários (o `projectUrls` já inclui `ligaDev` e `delcastanher`)

## Fase 2, `feat/links-experiencias`, experiências Matriz do DNA, Liga Dev e Delcastanher
- [x] 2.1 Renomear "Plataforma de Consultoria" para "Matriz do DNA" e adicionar o badge "Em construção", reescrever subtitle, techs (`Gemini` no lugar de "IA Generativa") e paths em `pt`, `en` e `fr`, conforme o context.md
- [x] 2.2 Adicionar a Liga Dev como primeiro item da timeline em `pt`, `en` e `fr` (badge "Em construção", stack da BF Academy, `url: projectUrls.ligaDev`), conforme o context.md
- [x] 2.3 Adicionar a Delcastanher como segundo item da timeline em `pt`, `en` e `fr` (Set 2026 — Atual, Desenvolvedor Fullstack, Angular/NestJS/Serverless/PostgreSQL, `url: projectUrls.delcastanher`), conforme o context.md

## Encerramento
- [x] Merge das fases na branch `release/003-links-de-projetos`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: Liga Dev no topo e Delcastanher em segundo, botões em Liga Dev, Delcastanher, Tichr e BF Academy nos 3 idiomas, abertura em nova aba, ausência de botão nos demais cards, card Matriz do DNA, foco/contraste e quebra de linha em 375px

## Decisões tomadas na execução
- **Matriz do DNA:** o período passou de "Jan 2026 — Mar 2026" para "Jan 2026 — Atual", para combinar com o badge "Em construção" — **confirmar**
- **Delcastanher** ganhou o badge "Atual" / "Current" / "Actuel", igual a Tichr e ProWay (a spec dizia "sem badge", mas todas as outras experiências em andamento têm esse badge)
- O `ExperienceCard` importa `displayUrl()` de `home.data.ts`, junto com `projectUrls`, para manter a URL e o formato de exibição num só lugar
- Em FR, "front-end/back-end" seguem o padrão já usado no dicionário: "au frontal" / "en arrière-plan"
- Em 375px, `liga.lenoborges.com.br/comunidade` quebra em duas linhas dentro do botão, sem scroll horizontal
- Os textos de Liga Dev, Delcastanher e Matriz do DNA são propostas (fatos fora do `resume.md`); revisar, inclusive o francês
- O commit `cd00a17` (kit de identidade visual em `.specs/brand`) ficou só na branch `fix/favicon-logo` e não entra nesta release
