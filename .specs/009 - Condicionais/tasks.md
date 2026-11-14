# 009, Condicionais, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/009-condicionais`, criada a partir da `main` depois do merge do PR #11 (spec 008).

## Fase 0, `feat/kit-java-conferido`, Java das aulas anteriores
- [ ] 0.1 Rodar no JDK 17 (`~/.jdks/ms-17.0.19`) os trechos de Java das aulas 1 a 4 e corrigir saídas e mensagens de erro que não baterem

## Fase 1, `feat/kit-fluxograma`, ilustração e linhas puladas da aula 5
- [ ] 1.1 `SceneStep.skip`: linhas que não rodam ficam apagadas no código da cena, com teste
- [ ] 1.2 Componente `kit-flow` (formatos `if`, `else`, `chain`, caminho aceso, respostas nos losangos, `prefers-reduced-motion`), com testes
- [ ] 1.3 `SceneStep.flow` e o fluxograma na `SceneView`, ao lado do código

## Fase 2, `feat/kit-escolha`, exercício `branch`
- [ ] 2.1 Slide `branch` (valores por clique e teclado, caminho, saída, desafios, reiniciar) e `stepCount`, com testes
- [ ] 2.2 Textos do exercício em `kit.exercise` nos três dicionários
- [ ] 2.3 Conferência das saídas do `branch` em `decks/deck-checks.ts` (roda o JS com cada valor)

## Fase 3, `feat/kit-condicionais`, aula Condicionais
- [ ] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; notas da aula 2 citando a aula 5
- [ ] 3.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 3.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [ ] 3.4 Conferir cada saída e mensagem de erro nas três linguagens

## Fase 4, `feat/kit-triagem`, ilustração da aula 6
- [ ] 4.1 Componente `kit-switch` (escaninhos, `default`, marca de `break`, queda animada, `prefers-reduced-motion`), com testes
- [ ] 4.2 `SceneStep.sorter` na `SceneView` e no exercício `branch`

## Fase 5, `feat/kit-switch-case`, aula Switch Case
- [ ] 5.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [ ] 5.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 5.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [ ] 5.4 Conferir cada saída e mensagem de erro nas três linguagens

## Encerramento
- [ ] Merge das fases na branch `release/009-condicionais`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: sequência 4 → 5 → 6 pelo convite, as duas aulas nos dois roteiros e nas três sintaxes, exercícios, `prefers-reduced-motion`
