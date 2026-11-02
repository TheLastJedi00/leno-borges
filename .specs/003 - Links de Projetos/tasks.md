# 003, Links de Projetos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/003-links-de-projetos`.

## Fase 1, `feat/links-botao`, botão de link para o sistema
- [ ] 1.1 Adicionar `projectUrls` e `displayUrl()` em `home.data.ts`, e `url?: string` na interface `Experience`
- [ ] 1.2 Adicionar `experience.visit` e `experience.newTab` ao `Dictionary` e aos dicionários `en`, `fr` e `pt`
- [ ] 1.3 Inputs `url`, `visitLabel` e `newTabLabel` no `ExperienceCard`, com o botão secundário (`target="_blank"`, `rel="noopener noreferrer"`, `↗` com `aria-hidden`, aviso em `sr-only`) e o binding na Home
- [ ] 1.4 Ligar `url` nos itens Tichr e BF Academy nos três dicionários (o `projectUrls` já inclui `ligaDev` e `delcastanher`)

## Fase 2, `feat/links-experiencias`, experiências Matriz do DNA, Liga Dev e Delcastanher
- [ ] 2.1 Renomear "Plataforma de Consultoria" para "Matriz do DNA" e adicionar o badge "Em construção", reescrever subtitle, techs (`Gemini` no lugar de "IA Generativa") e paths em `pt`, `en` e `fr`, conforme o context.md
- [ ] 2.2 Adicionar a Liga Dev como primeiro item da timeline em `pt`, `en` e `fr` (badge "Em construção", stack da BF Academy, `url: projectUrls.ligaDev`), conforme o context.md
- [ ] 2.3 Adicionar a Delcastanher como segundo item da timeline em `pt`, `en` e `fr` (Set 2026 — Atual, Desenvolvedor Fullstack, Angular/NestJS/Serverless/PostgreSQL, `url: projectUrls.delcastanher`), conforme o context.md

## Encerramento
- [ ] Merge das fases na branch `release/003-links-de-projetos`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: Liga Dev no topo e Delcastanher em segundo, botões em Liga Dev, Delcastanher, Tichr e BF Academy nos 3 idiomas, abertura em nova aba, ausência de botão nos demais cards, card Matriz do DNA, foco/contraste e quebra de linha em 375px
