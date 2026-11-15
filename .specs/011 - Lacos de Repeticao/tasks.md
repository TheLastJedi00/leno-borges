# 011, Laços de Repetição, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/011-lacos-de-repeticao`, criada a partir da `main` depois do merge do PR #13 (spec 010).

## Fase 1, `feat/kit-conferencia-lacos`, conferências
- [ ] 1.1 `SceneSlide.noRun`: `jsOutputProblems` e `check:java` pulam o slide, com teste
- [ ] 1.2 `check:java` com tempo limite por trecho
- [ ] 1.3 `traceProblems`: roda o código em JS anotando as variáveis a cada volta e compara com o teste de mesa, com teste

## Fase 2, `feat/kit-pista`, ilustração da aula
- [ ] 2.1 Componente `kit-loop` (condição, corpo, `init` / `update`, variante `do`, placar, seta de saída, `prefers-reduced-motion`), com testes
- [ ] 2.2 `SceneStep.loop` na `SceneView`, com a escala fixa por slide
- [ ] 2.3 `BranchSlide.loop` no exercício "escolha o valor"
- [ ] 2.4 Texto do placar para leitor de tela em `kit.exercise` nos três dicionários

## Fase 3, `feat/kit-teste-de-mesa`, slide `trace`
- [ ] 3.1 `TraceSlide` e `stepCount`
- [ ] 3.2 `TraceView` (código e tabela revelada por etapa, linha em destaque), com testes

## Fase 4, `feat/kit-lacos`, aula Laços de repetição
- [ ] 4.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; resumo e notas da aula 7 citando a aula pelo nome
- [ ] 4.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 4.3 Aprofundamentos, curiosidades, testes de mesa e exercícios, com o teste do deck
- [ ] 4.4 Conferir cada saída e mensagem de erro nas três linguagens (`check:java`, `tsc --strict`, Node)

## Encerramento
- [ ] Merge das fases na branch `release/011-lacos-de-repeticao`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: sequência 7 → 8 pelo convite, a aula nos dois roteiros e nas três sintaxes, exercícios, slides exclusivos, teste de mesa
