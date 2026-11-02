# 005, Parceiros, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/005-parceiros`.

## Fase 1, `feat/parceiros-base`, dados, textos e componente
- [x] 1.1 Adicionar a interface `Partner`, o mapa `partners` (5 parceiros, URLs canônicas) e `partners?: Partner[]` em `Experience` e `Education`, em `home.data.ts`
- [x] 1.2 Adicionar a chave `partners` (`label`, `linkedin`) ao `Dictionary` e aos dicionários `en`, `fr` e `pt`
- [x] 1.3 Criar o componente `partner-links` em `src/app/shared/` (rótulo, links com ícone do LinkedIn, `sr-only`, nova aba, `flex-wrap`)

## Fase 2, `feat/parceiros-cards`, ligação nos cards
- [x] 2.1 Usar `partner-links` no `ExperienceCard` (abaixo de cargo · subtítulo) e no `EducationItem` (abaixo da instituição), com o binding na Home
- [x] 2.2 Ligar `partners` em BF Academy, Delcastanher, Matriz do DNA e ProWay, e no Bootcamp de Suporte AMS (T-Systems e ProWay), nos três dicionários

## Encerramento
- [x] Merge das fases na branch `release/005-parceiros`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: linha de parceria nos 5 itens nos 3 idiomas, links abrindo o LinkedIn correto em nova aba (incluindo o da Bárbara, com acento), ausência da linha nos demais cards, foco/contraste e quebra em 375px

## Decisões tomadas na execução
- O código da spec é commitado na `release/005-parceiros` antes das fases, e cada `feat/` sai dela
- `partner-links` recebe `class="block empty:hidden"` no host, para não sobrar margem nos cards sem parceiro
- Na formação, o aviso de nova aba reaproveita `experience.newTab`, como previsto no context.md
- O redimensionamento da janela do Chrome para 375px não pegou na homologação (viewport ficou em 2048px). A linha usa `flex-wrap` e não gerou scroll horizontal no desktop; **conferir no celular**
