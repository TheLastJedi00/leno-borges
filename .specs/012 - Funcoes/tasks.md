# 012, Funções, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/012-funcoes`, criada a partir da `main` depois do merge do PR #14 (spec 011).

## Fase 1, `feat/kit-conferencia-funcoes`, conferências
- [x] 1.1 `check:java` com a convenção `// no main` (antes: nível da classe; depois: dentro do `main`), com teste
- [x] 1.2 Conferência do `returning` da pilha no teste de deck (valor aparece no baú ou na saída da etapa seguinte; sala de baixo `main` no Java), com teste

## Fase 2, `feat/kit-pilha`, ilustração da aula
- [x] 2.1 Componente `kit-stack` (salas, baús em miniatura, sala do topo acesa, etiqueta do `return`, `prefers-reduced-motion`, rótulo para leitor de tela), com testes
- [x] 2.2 `SceneStep.stack` na `SceneView`, com a escala fixa por slide quando divide a cena com baús ou gaveteiro
- [x] 2.3 `BranchSlide.stack` no exercício "escolha o valor"
- [x] 2.4 Textos da pilha (rótulo e nome da sala de baixo no JS/TS) em `kit.exercise` nos três dicionários

## Fase 3, `feat/kit-funcoes`, aula Funções
- [x] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; resumo e notas da aula 8 citando a aula pelo nome
- [x] 3.2 `code.ts` com os trechos em JS, TS e Java (convenção `// no main`; classe inteira nos slides 4 e 16) e os 10 slides essenciais
- [x] 3.3 Aprofundamentos, slides exclusivos, curiosidade e exercícios, com o teste do deck
- [x] 3.4 Conferir cada saída e mensagem de erro nas três linguagens (`check:java`, `tsc --strict`, Node) e os fatos do Ariane 5

## Encerramento
- [x] Merge das fases na branch `release/012-funcoes`
- [x] `npm run build` e `npm test` sem falhas; `npm run check:java` das aulas 1 a 9 sem diferenças
- [x] Subir em `localhost:4200` e homologar no Chrome: sequência 8 → 9 pelo convite, a aula nos dois roteiros e nas três sintaxes, slide 4 nas três sintaxes, pilha subindo e descendo, exercícios, slides exclusivos

## Decisões tomadas na execução
- **`returning` fica na sala que devolve:** a etiqueta `return 8` aparece na sala do topo na etapa do `return`; a sala fecha na etapa seguinte. A conferência aceita o valor num baú, na saída ou num baú da sala que recebeu (`soma`, `r`, `resultado`), e aceita uma sala que devolve logo em seguida (função que chama outra)
- **Variáveis do `main` / arquivo moram na sala de baixo** (baús em miniatura), em vez dos baús grandes: a cena fica com uma ilustração só, e a pilha mostra quem guarda o quê
- **Slide 4 e slide 16 com `class Aula`:** a janela de código mostra `Aula.java`, então a classe tem o mesmo nome; o `check:java` grava o arquivo com o nome da classe pública. O comentário com o nome do arquivo saiu (a janela já mostra)
- **Montagem do Java em `decks/java-source.ts`**, testada no Karma e usada pelo `check:java`
- **Escopo (slide 12):** em TS e Java o trecho não compila; as etapas da pilha mostram o que aconteceria e a última etapa mostra o erro. Sem `returning` nesse slide, para a conferência não exigir o 8 numa saída que não existe
- **`return` encerra (slide 10) sem pilha:** em Java o trecho não compila
- **`tsc --strict` não acusa a linha depois do `return`:** sem `allowUnreachableCode: false`, o aviso 7027 só aparece no editor. O slide diz isso
- **Tabuada até 3** (e não até 5), para as duas chamadas caberem na saída
- **Função com lista (slide 15):** a lista vai direto na chamada (`media([7, 9, 8])` / `List.of(7, 9, 8)`), sem a variável `notas` fora
- **Escala da pilha:** até 1,25 sozinha ao lado do código; 80% disso com gaveteiro ou baús
- **Bin do "devolve ou só faz?":** 2 escaninhos com 3 situações cada
- Verificado: TS só com os erros que os slides mostram (`TS2304` no escopo, `TS2345` na ordem dos argumentos); `check:java` 133 trechos das aulas 1 a 9, sem diferença; 189 testes; build (bundle inicial 405,60 kB)
- Homologado no Chrome: sequência 8 → 9 pelo convite, slide 4 em Java, pilha com três salas (função que chama outra), gaveteiro com pilha, escopo em JS, exercício "escolha a nota" (desafio resolvido com 6), exercício de classificar por clique, arrow function (só JS), Essencial com 10 slides
- O que não foi homologado: `prefers-reduced-motion` (regras no CSS do `kit-stack`), palco em 375px e leitor de tela
