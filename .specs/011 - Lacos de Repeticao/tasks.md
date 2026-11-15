# 011, Laços de Repetição, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/011-lacos-de-repeticao`, criada a partir da `main` depois do merge do PR #13 (spec 010).

## Fase 1, `feat/kit-conferencia-lacos`, conferências
- [x] 1.1 `SceneSlide.noRun`: `jsOutputProblems` e `check:java` pulam o slide, com teste
- [x] 1.2 `check:java` com tempo limite por trecho
- [x] 1.3 `traceProblems`: roda o código em JS anotando as variáveis a cada volta e compara com o teste de mesa, com teste

## Fase 2, `feat/kit-pista`, ilustração da aula
- [x] 2.1 Componente `kit-loop` (condição, corpo, `init` / `update`, variante `do`, placar, seta de saída, `prefers-reduced-motion`), com testes
- [x] 2.2 `SceneStep.loop` na `SceneView`, com a escala fixa por slide
- [x] 2.3 `BranchSlide.loop` no exercício "escolha o valor"
- [x] 2.4 Texto do placar para leitor de tela em `kit.exercise` nos três dicionários

## Fase 3, `feat/kit-teste-de-mesa`, slide `trace`
- [x] 3.1 `TraceSlide` e `stepCount`
- [x] 3.2 `TraceView` (código e tabela revelada por etapa, linha em destaque), com testes

## Fase 4, `feat/kit-lacos`, aula Laços de repetição
- [x] 4.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; resumo e notas da aula 7 citando a aula pelo nome
- [x] 4.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 4.3 Aprofundamentos, curiosidades, testes de mesa e exercícios, com o teste do deck
- [x] 4.4 Conferir cada saída e mensagem de erro nas três linguagens (`check:java`, `tsc --strict`, Node)

## Encerramento
- [x] Merge das fases na branch `release/011-lacos-de-repeticao`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: sequência 7 → 8 pelo convite, a aula nos dois roteiros e nas três sintaxes, exercícios, slides exclusivos, teste de mesa

## Decisões tomadas na execução
- **`TraceSlide` e `stepCount` (3.1) entraram na fase 1**, junto com o `traceProblems`, que já usa o tipo. As colunas do teste de mesa dizem o que conferir: `js` (expressão avaliada a cada volta), `out` (o que a volta imprime) ou nenhum (rótulo). `at` e `end` são as linhas do código JS antes das quais a volta e o fim do laço são anotados
- **Voltas no exercício "escolha o valor":** cada valor declara `laps`; a conferência exige uma linha impressa por volta. O código do Java não roda no navegador, por isso as voltas não são calculadas na hora
- **Slides 7 a 13 sem pista:** com o gaveteiro, o baú e o código, não cabia a pista também; a gaveta acesa e o baú do contador mostram as voltas. A pista fica nos slides de `while`, `for`, `continue`, `do...while` e no exercício
- **Pista dividindo a cena:** com baús ou gaveteiro no mesmo slide, a pista fica em 80% da escala e os baús em 60%. O slide do `do...while` ficou sem baú para o texto do corpo caber
- **Slide 2 sem as "três linhas iguais" no código:** o problema aparece na legenda da primeira etapa (o código do slide é um só para todas as etapas)
- **Slide 9 com título único** ("Cada item da lista"); o `for...of` / for-each aparece no código e na legenda de cada sintaxe
- **Exercício "qual laço?"** com 6 situações (2 por escaninho), curtas para caberem em duas linhas
- **Contagem regressiva:** valores 5, 3, 1 e 0; desafios "3, 2, 1", "1" e "nada"
- **Placar** usa o idioma da interface (`laps`, `tours`, `voltas`), como os outros textos do player
- Verificado: TS sem erros nos 20 trechos (`tsc --strict`); `check:java` 112 trechos, sem diferença; o laço infinito (`noRun`) não roda em nenhuma conferência
- Homologado no Chrome: sequência 7 → 8 pelo convite (mantendo sintaxe e roteiro), pista no `while`, `for` e `do...while`, teste de mesa revelando linha a linha, gaveteiro com acumulador, exercício de contagem regressiva, exercício de classificar, Essencial com 10 slides
- O que não foi homologado: `prefers-reduced-motion` (regras no CSS do `kit-loop`), palco em 375px e leitor de tela
