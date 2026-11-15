# 011 - Laços de Repetição: aula 8 do kit

## Objetivo

Publicar a próxima aula da trilha **Lógica de Programação**:

- **Aula 8: Laços de repetição.** Repetir um trecho enquanto uma condição for verdadeira (`while`), contar voltas (`for`), percorrer uma lista (pelo índice e com `for...of` / for-each), acumular valores (soma, maior valor) e controlar o laço (`break`, `continue`).

A aula responde à pergunta que fecha a aula 7: "e para mostrar cada item numa linha, sem escrever uma linha por item?".

O formato é o mesmo das aulas anteriores (specs 006 a 010): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos. O convite de próxima aula passa a ligar: ... → Switch Case → Listas → Laços de repetição.

## Princípio da aula: mesma ideia, sintaxe diferente

- Como na aula 7, cada slide mostra **o mesmo laço** nas três sintaxes. `while`, `for`, `break`, `continue` e `do...while` são iguais nas três; muda o jeito de percorrer a lista: `for (const fruta of frutas)` no JS/TS e `for (String fruta : frutas)` no Java.
- Java continua com `List` / `ArrayList` (aula 7); tamanho com `size()` e item com `get(i)`.
- `forEach`, `map` e `filter` ficam só nas notas: recebem uma função, assunto da próxima aula.

## Dependência

Parte da `main` depois do merge do PR #13 (spec 010). Usa os slides `scene`, `predict`, `sort`, `branch` e `cards`, o gaveteiro (`kit-list`), os baús (`kit-chest`), as linhas puladas (`skip`), o valor trocado (`value`, `@@`), o `npm run check:java` e o `nextLesson()`.

## Escopo

### Dentro
- Aula **Laços de repetição** completa.
- Nova ilustração: **pista de voltas** (`kit-loop`).
- Novo slide: **teste de mesa** (`trace`), a tabela que mostra o valor das variáveis a cada volta.
- **Cenas que não rodam** (`noRun`): o laço infinito do slide 4 aparece na tela, mas as conferências (JS e `check:java`) não executam o trecho.
- `check:java` com tempo limite por trecho, para um laço infinito por engano não travar a conferência.
- Aula no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.
- Aula 7: o resumo e as notas que falam da "próxima aula" passam a citar Laços de repetição pelo nome.

### Fora
- `forEach`, `map`, `filter`, `reduce` e streams do Java: só citados nas notas; voltam depois de funções.
- Laço dentro de laço (matriz, tabuada completa de 1 a 10): só como desafio extra nas notas.
- Recursão.
- `Iterator` do Java (só citado na nota do slide 17, como o jeito certo de remover durante o laço).
- Tradução do conteúdo das aulas (segue só em PT).

## Metáfora

A execução é um corredor numa **pista**. Antes de cada volta, passa pelo portão da condição (o losango da aula 5): `true` entra para mais uma volta, `false` sai da pista. Um placar mostra quantas voltas já foram.

| Ilustração | Como funciona |
|---|---|
| **Pista de voltas** (`kit-loop`) | O losango da condição na entrada, o corpo do laço numa caixa e a seta que volta para a condição. A volta atual acende; o placar conta as voltas; quando a condição dá `false`, a seta de saída acende. No `for`, o começo (`let i = 0`) fica antes da pista e o passo (`i++`) no fim da volta. No `do...while`, o corpo vem antes da condição. |
| **Gaveteiro** (`kit-list`, aula 7) | Ao percorrer a lista, a gaveta em destaque anda uma casa a cada volta. |
| **Baús** (`kit-chest`, aula 1) | O contador (`i`) e o acumulador (`soma`, `maior`) mudam de valor a cada volta. |

## Aula 8: Laços de repetição (roteiro)

Slug: `lacos-de-repeticao`. Exemplos do dia a dia: contagem regressiva, lista de chamada, soma das notas, tabuada, procurar o primeiro item.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 22 slides no deck; cada sintaxe vê **21** (slide 16 só JS/TS, slide 17 só Java).
- Os números são a ordem no roteiro Completo com todos os slides.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Laços de repetição" | cover | |
| 2 | E | `while`: enquanto for verdade | scene + pista + baú | Primeiro, três linhas iguais imprimindo 1, 2 e 3 (o problema). Depois `let i = 1; while (i <= 3) { log(i); i++; }`: a cada volta a condição é perguntada, o baú `i` muda e o placar conta. Com `i` 4, a condição dá `false` e a execução sai |
| 3 | A | Teste de mesa | trace | O mesmo laço numa tabela: volta, `i`, `i <= 3`, o que imprime. A última linha é a pergunta que dá `false` |
| 4 | E | Laço infinito | scene + pista (`noRun`) | Sem o `i++`, `i` fica em 1 e a condição nunca dá `false`: o placar não para. Como parar um programa travado (Ctrl+C no terminal) |
| 5 | E | `for`: começo, condição e passo | scene + pista | `for (let i = 1; i <= 3; i++)` (Java `int i`): as três partes do `while` numa linha só; a pista mostra o começo antes, a condição no portão e o passo no fim da volta |
| 6 | A | Exercício: quantas vezes? | predict | `for (let i = 0; i < 10; i += 2)` imprimindo `i`: quantas linhas aparecem? (5: 0, 2, 4, 6, 8) |
| 7 | E | Percorrer a lista pelo índice | scene + gaveteiro + pista | `for (let i = 0; i < frutas.length; i++)` imprimindo `frutas[i]` (Java `size()` e `get(i)`): a gaveta em destaque anda uma casa por volta. Responde à pergunta do fim da aula 7 |
| 8 | A | Uma volta a mais | scene + gaveteiro | `i <= frutas.length`: a última volta pede a gaveta 3, que não existe. JS/TS imprimem `undefined`; Java para com `IndexOutOfBoundsException` (retoma o slide 13 da aula 7) |
| 9 | E | `for...of` / for-each: cada item | scene + gaveteiro | `for (const fruta of frutas)` / `for (String fruta : frutas)`: sem índice, cada volta recebe o próximo item. Mesma ideia, sintaxe diferente |
| 10 | E | Acumulador: a soma das notas | scene + gaveteiro + baú | `soma` começa em 0; cada volta faz `soma += nota`. No fim, a média (aula 2) |
| 11 | A | Teste de mesa da soma | trace | Volta, `nota`, `soma` antes e depois |
| 12 | A | O maior valor | scene + gaveteiro + baú | `maior` começa com a primeira nota; cada volta compara com `if (nota > maior)` (aula 5) |
| 13 | E | `break`: parar antes do fim | scene + gaveteiro | Procurar o primeiro aluno reprovado: achou, avisa e sai do laço; as gavetas seguintes nem são abertas |
| 14 | A | `continue`: pular uma volta | scene + pista | De 1 a 6, pula os pares com `if (i % 2 === 0) continue;` (retoma o par ou ímpar da aula 5) |
| 15 | A | `do...while`: pelo menos uma vez | scene + pista | Com a condição já `false` no começo: o `while` roda 0 vezes, o `do...while` roda 1. Uso típico: menu que aparece antes da primeira escolha |
| 16 | A | Curiosidade: `for...in` na lista (só JS/TS) | scene | `for (const i in frutas)` dá os índices **como texto**: `i + 1` imprime `01`, `11`, `21`. Para listas, `for...of` |
| 17 | A | Remover durante o for-each (só Java) | scene + gaveteiro | Remover um item dentro do `for (String f : frutas)` para com `ConcurrentModificationException`. O `removeIf` e o `Iterator` ficam nas notas |
| 18 | A | Exercício: escolha o valor | branch + pista | Contagem regressiva `for (let i = @@; i >= 1; i--)`: a turma troca o começo e cumpre os desafios ("faça aparecer 3, 2, 1", "faça não aparecer nada") |
| 19 | A | Exercício: `while` ou `for`? | sort | Situações ("repetir 10 vezes", "até a senha estar certa", "cada item da lista", "enquanto tiver saldo", ...) nos escaninhos `for`, `for...of` / for-each e `while` |
| 20 | A | Curiosidade: o tocador que travou no último dia do ano | cards | Em 31 de dezembro de 2008, os tocadores Zune de 30 GB da Microsoft travaram: um laço que convertia dias em anos nunca terminava no dia 366 de um ano bissexto. Voltaram a funcionar no dia seguinte |
| 21 | E | Desafio: tabuada | scene + baú | `for` de 1 a 5 imprimindo `7 x i = resultado` (retoma a multiplicação da aula 2); a turma completa até 10 |
| 22 | E | Resumo | cards | `while` (enquanto), `for` (contar), `for...of` / for-each (cada item), `break` / `continue`; cuidado com o laço infinito; próxima aula: funções |

### Diferenças por sintaxe

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Contador do `for` | `let i = 0` | `let i = 0` (o TS deduz `number`) | `int i = 0` |
| Cada item da lista | `for (const f of lista)` | `for (const f of lista)` | `for (String f : lista)` |
| `for...in` em lista | Índices como texto (`"0"`) | Idem (o tipo é `string`) | Não existe |
| Passar do fim da lista | `undefined` | `undefined` | `IndexOutOfBoundsException` |
| Remover durante o laço de itens | Pula itens sem avisar (nas notas) | Idem | `ConcurrentModificationException` |
| `i++`, `i--`, `i += 2` | Igual | Igual | Igual |

## Componentes e tipos novos

| Item | Onde | Descrição |
|---|---|---|
| `kit-loop` | `ui/loop/` | Pista em SVG nas cores do tema: começo opcional (`init`, no `for`), losango da condição, caixa do corpo, passo opcional (`update`), seta de volta e seta de saída. A volta atual acende; o losango mostra a resposta da última pergunta; placar com o número de voltas. Variante `do` (corpo antes da condição). `prefers-reduced-motion`: troca de estado sem animar a seta. |
| `SceneStep.loop` | `kit.data.ts` | `{ condition, body, init?, update?, kind?: 'while' \| 'do', laps, answer: boolean \| null }` (aceita `BySyntax` nos textos): `laps` é o número de voltas já completadas; `answer` é a resposta da condição nesta etapa (`null` = ainda não perguntou). `null` tira a pista da cena. |
| `BranchSlide.loop` | `kit.data.ts` | O exercício "escolha o valor" com a pista: o número de voltas de cada valor é calculado rodando o código. |
| `trace` (slide) | `slides/trace-view.ts` | Teste de mesa: código à esquerda, tabela à direita com uma linha por volta, revelada uma por etapa (como a tabela-verdade da aula 4). A linha atual fica em destaque e a linha do código correspondente acende. |
| `TraceSlide` | `kit.data.ts` | `{ code, head, rows, line? }`: `head` são os nomes das colunas (variáveis e expressões, com marcação de código); `rows` os valores de cada volta. `stepCount` = número de linhas. |
| `SceneSlide.noRun` | `kit.data.ts` | A cena mostra um código que não deve ser executado (laço infinito): `jsOutputProblems` e `check:java` pulam o slide. |

- Os novos tipos entram no `Slide` (união discriminada) e no `stepCount`.
- O teste de cada deck confere o teste de mesa rodando o código em JS e anotando as variáveis a cada volta (nova conferência `traceProblems`), e confere que o número de voltas da pista bate com a saída.
- Textos de interface novos (placar de voltas, para leitor de tela) vão para `kit.exercise` nos três dicionários.

## Ajustes em outras aulas e conferências

- Aula 7: o resumo e a nota "Próxima aula: laços de repetição" passam a citar a aula pelo nome; a pergunta do desafio do carrinho fica como está.
- `check:java`: tempo limite de alguns segundos por trecho; passando do limite, a conferência acusa o slide em vez de travar.

## Catálogo e textos

| Aula | PT | EN | FR-CA | Duração |
|---|---|---|---|---|
| 8 | Laços de repetição | Loops | Boucles | 10 min a 3 h |

- Resumos curtos nos três idiomas; regras de copy do projeto valem (sem travessão, FR com uso canadense e espaço antes de `:`).
- `sitemap.xml`: `/kit/logica-de-programacao/lacos-de-repeticao/1`.

## Fatos a conferir na execução

Cada saída e mensagem de erro mostrada nos slides deve ser conferida rodando o código nas três linguagens (Node, `tsc --strict` e JDK 17), em especial:
- JS/TS: `for...in` em lista (`01`, `11`, `21`), `i <= frutas.length` (`undefined`), `do...while` com a condição falsa, `continue`.
- Java: `IndexOutOfBoundsException` na volta a mais, `ConcurrentModificationException` (texto exato e em qual remoção acontece), `for (String f : frutas)`.
- Caso do Zune (31 de dezembro de 2008, modelo de 30 GB, laço no código do relógio no dia 366 do ano bissexto): data e descrição nas notas.

## Testes

- Unitários: `kit-loop` (placar, resposta no losango, seta de saída, `init` / `update`, variante `do`), `trace` (uma linha por etapa, linha em destaque), `noRun` nas conferências, `traceProblems`, `loop` no exercício `branch`, e o teste de deck da aula (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, saídas em JS com cada valor, teste de mesa conferido, gaveteiro conferindo com a saída, respostas dos exercícios, sem travessão).
- `npm run check:java -- lacos-de-repeticao` sem diferenças.
- Manual no Chrome: sequência 7 → 8 pelo convite, a aula nos dois roteiros e nas três sintaxes, exercícios (clique e teclado), slides exclusivos de Java e de JS/TS, teste de mesa revelando linha a linha.
