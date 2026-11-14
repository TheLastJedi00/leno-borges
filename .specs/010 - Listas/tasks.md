# 010, Listas, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/010-listas`, criada a partir da `main` depois do merge do PR #12 (spec 009).

## Fase 1, `feat/kit-conferencia-listas`, conferências
- [ ] 1.1 `runJs` imprime listas no formato do Node, com teste
- [ ] 1.2 `check:java` importa `java.util.*` quando o trecho não tem `import` e aceita o endereço do array depois do `@`

## Fase 2, `feat/kit-gaveteiro`, ilustração
- [ ] 2.1 Componente `kit-list` (gavetas com `id`, índices, foco, gaveta fantasma, `fixed`, `prefers-reduced-motion`), com testes
- [ ] 2.2 `SceneStep.list` e `listZoom` na `SceneView`
- [ ] 2.3 `BranchSlide.list` no exercício "escolha o valor" (valor escolhido = gaveta em foco ou fantasma)

## Fase 3, `feat/kit-listas`, aula Listas
- [ ] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; resumo e notas da aula 6 citando Listas
- [ ] 3.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 3.3 Aprofundamentos, curiosidades, tabela de equivalência e exercícios, com o teste do deck
- [ ] 3.4 Conferir cada saída e mensagem de erro nas três linguagens (`check:java`, `tsc --strict`, Node)

## Encerramento
- [ ] Merge das fases na branch `release/010-listas`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: sequência 6 → 7 pelo convite, a aula nos dois roteiros e nas três sintaxes, exercícios, slides exclusivos
