# 009, Condicionais, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/009-condicionais`, criada a partir da `main` depois do merge do PR #11 (spec 008).

## Fase 0, `feat/kit-java-conferido`, Java das aulas anteriores
- [x] 0.1 Rodar no JDK 17 (`~/.jdks/ms-17.0.19`) os trechos de Java das aulas 1 a 4 e corrigir saídas e mensagens de erro que não baterem

## Fase 1, `feat/kit-fluxograma`, ilustração e linhas puladas da aula 5
- [x] 1.1 `SceneStep.skip`: linhas que não rodam ficam apagadas no código da cena, com teste
- [x] 1.2 Componente `kit-flow` (formatos `if`, `else`, `chain`, caminho aceso, respostas nos losangos, `prefers-reduced-motion`), com testes
- [x] 1.3 `SceneStep.flow` e o fluxograma na `SceneView`, ao lado do código

## Fase 2, `feat/kit-escolha`, exercício `branch`
- [x] 2.1 Slide `branch` (valores por clique e teclado, caminho, saída, desafios, reiniciar) e `stepCount`, com testes
- [x] 2.2 Textos do exercício em `kit.exercise` nos três dicionários
- [x] 2.3 Conferência das saídas do `branch` em `decks/deck-checks.ts` (roda o JS com cada valor)

## Fase 3, `feat/kit-condicionais`, aula Condicionais
- [x] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; notas da aula 2 citando a aula 5
- [x] 3.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 3.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [x] 3.4 Conferir cada saída e mensagem de erro nas três linguagens

## Fase 4, `feat/kit-triagem`, ilustração da aula 6
- [x] 4.1 Componente `kit-switch` (escaninhos, `default`, marca de `break`, queda animada, `prefers-reduced-motion`), com testes
- [x] 4.2 `SceneStep.sorter` na `SceneView` e no exercício `branch`

## Fase 5, `feat/kit-switch-case`, aula Switch Case
- [x] 5.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [x] 5.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 5.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [x] 5.4 Conferir cada saída e mensagem de erro nas três linguagens

## Encerramento
- [x] Merge das fases na branch `release/009-condicionais`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: sequência 4 → 5 → 6 pelo convite, as duas aulas nos dois roteiros e nas três sintaxes, exercícios (`prefers-reduced-motion` ficou de fora, ver decisões)

## Decisões tomadas na execução
- **Java conferido de verdade:** o JDK 17 da máquina fica em `~/.jdks/ms-17.0.19` (fora do PATH). Novo comando `npm run check:java [-- <aula>]` compila e roda cada trecho de Java dos decks (com cada valor da cena e de cada escolha do exercício) e compara com o slide. Os 38 trechos das aulas 1 a 4 já batiam; hoje são 73, sem diferença
- **TS conferido no `tsc` 5.9 `--strict`:** aula 5 sem erros; aula 6 só com o TS2678 que o slide mostra. `if (x = 5)` compila sem aviso no TS (o slide diz isso)
- **Java 17 e `switch` com `double` / `boolean`:** a mensagem do `javac` 17 é "patterns in switch statements are a preview feature", confusa para quem está começando. O slide do Java mostra o erro de `case` repetido ("duplicate case label") e cita `double` e `boolean` na legenda e nas notas
- **Fluxograma sem `shape`:** o formato sai das listas (`if` = 1 condição e 1 saída; com uma saída a mais, há `else`; várias condições = `else if`). `FlowState` = `conditions`, `outcomes` e `answers`; o caminho é calculado por `flowRoute`
- **Triagem:** `SorterState` = `value`, `cases` (`label`, `out`, `brk`), `fallback` (o `default`) e `dropped`. O escaninho onde o item cai é calculado comparando o texto do valor com a etiqueta (como o `===`: `"5"` não é `5`); o deck não declara `landed`
- **Valor trocado por etapa:** `SceneStep.value` entra no lugar de `@@` no código, para a mesma cena rodar com 20 e com 15. As conferências de JS e Java rodam o código com cada valor
- **Fonte do código:** encolhe pelo número de linhas e pela linha mais comprida (`fitFontSize`), para o `case ...; break;` numa linha caber. Nenhum slide das aulas 1 a 4 mudou de tamanho (conferido)
- **Exercício "escolha o valor":** os valores e os botões ficam numa barra embaixo, para o fluxograma ou a triagem ocuparem a coluna da direita. O texto de dica (`branchHint`) saiu dos dicionários: o `lead` do slide já explica
- **Aula 6:** os `case` curtos ficam numa linha (`case 1: ...; break;`); dia 1 é domingo e 7 é sábado (`case 1:` vazio caindo no `case 7`, "Folga"); o slide de texto e os exclusivos de Java e JS/TS não têm triagem (linhas longas demais ao lado dela); a curiosidade da AT&T virou cards; a calculadora tem `+` e `/` (a turma acrescenta `-` e `*`)
- **Aula 6, Java moderno:** mostra só o `switch` que devolve valor (`case 1, 7 -> "Folga"`); o `case` com seta sem devolver valor fica nas notas
- **Aula 5, `if` dentro de `if`:** sem fluxograma (a fila de losangos não desenha um `if` aninhado); as linhas puladas mostram o caminho
- O exercício "escolha o valor" da aula 6 treina a queda: "só Ter" (3), "Seg e Ter" (2) e "cair no default" (9)
- Homologação: a seta `false` do `if` sem `else` chegava curta e o círculo do fim cobria o rótulo; a linha pulada ficou mais apagada (0,14) para se distinguir das linhas fora de foco; os cards do resumo da aula 5 cabem numa linha
- Homologado no Chrome: sequência 4 → 5 → 6 pelo convite (mantendo sintaxe e roteiro), fluxograma nos três formatos, triagem com `break`, sem `break`, `case` vazio e `default`, `===` no `switch` (JS), exercícios de classificar, prever e escolha o valor (clique), slides exclusivos de Java e de JS/TS
- O que não foi homologado: `prefers-reduced-motion` (a extensão do Chrome não emula a preferência; as regras estão no CSS dos dois componentes), palco em 375px e leitor de tela
