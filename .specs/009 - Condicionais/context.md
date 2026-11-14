# 009 - Condicionais: aulas 5 e 6 do kit

## Objetivo

Publicar as próximas duas aulas da trilha **Lógica de Programação**, nesta ordem:

1. **Aula 5: Condicionais (`if`, `else` e `else if`).** Usar as respostas `true` / `false` das aulas 3 e 4 para decidir qual trecho do programa roda.
2. **Aula 6: Switch Case.** Escolher um caminho entre vários a partir de um valor (`switch`, `case`, `break`, `default`).

O formato é o mesmo das aulas anteriores (specs 006 a 008): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos. O convite de próxima aula passa a ligar: Variáveis → Aritméticos → Relacionais → Lógicos → Condicionais → Switch Case.

## Dependência

Parte da `main` depois do merge do PR #11 (spec 008). Usa os slides `expr`, `truth`, `predict` e `sort`, a balança (`kit-scale`) e o `nextLesson()`.

## Escopo

### Dentro
- Aula **Condicionais** completa, com o operador ternário como aprofundamento.
- Aula **Switch Case** completa, incluindo o `switch` com seta do Java (14 ou mais novo).
- Novas ilustrações: **fluxograma** (aula 5) e **triagem de escaninhos** (aula 6).
- **Linhas puladas no código:** na cena, as linhas que não rodam ficam apagadas, para a turma ver o caminho da execução.
- Novo exercício: **escolha o valor** (a turma troca o valor da variável e vê qual caminho roda), usado nas duas aulas.
- Aulas no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.
- Notas das aulas 2 e 4 que citam "a aula de condicionais" passam a citar a aula pelo nome.

### Fora
- Laços (`while`, `for`): ficam para a próxima aula da trilha.
- `switch` com padrões de tipo do Java 21 (`case Integer i ->`) e `when`.
- Exaustividade de `switch` com tipos união e `never` no TS (só uma nota).
- Tradução do conteúdo das aulas (segue só em PT).

## Metáforas

A metáfora do baú continua: a condição é uma pergunta cuja resposta (`true` / `false`) vem da balança (aula 3) ou do circuito (aula 4). O que muda é **para onde o programa vai** com essa resposta.

| Aula | Ilustração | Como funciona |
|---|---|---|
| 5 | **Fluxograma** (`kit-flow`) | A execução é um caminho que desce. A condição fica num losango; dele saem a seta `true` e a seta `false`. O caminho percorrido acende (como a lâmpada da aula 4) e o outro fica apagado. `else if` é uma fila de losangos: a execução para no primeiro `true`. |
| 6 | **Triagem** (`kit-switch`) | O valor do `switch` é um item (como o dos baús) que desce por uma fileira de escaninhos com etiqueta (`case 1`, `case 2`, ..., `default`) e cai no que tem a etiqueta igual. Sem `break`, o item continua caindo nos escaninhos de baixo (fall-through); com `break`, para. |

## Aula 5: Condicionais (roteiro)

Slug: `condicionais`. Exemplos do dia a dia: entrada no show (idade), guarda-chuva (chuva), frete grátis, nota e conceito, par ou ímpar.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 19 slides no deck; cada sintaxe vê **18** (slide 14 só JS/TS, slide 15 só Java).
- Os números são a ordem no roteiro Completo com todos os slides.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Condicionais" | cover | |
| 2 | E | O programa escolhe um caminho | cards | "Está chovendo? Leve o guarda-chuva", "Tem 18 anos? Pode entrar", "Compra acima de 200? Frete grátis": cada decisão é uma pergunta das aulas 3 e 4 |
| 3 | E | `if`: só se for verdade | scene + fluxograma | `if (idade >= 18) { ... }` com `idade` 20: a seta `true` acende e a linha de dentro roda. Com 15: a linha de dentro fica apagada e nada é impresso |
| 4 | E | `else`: senão | scene + fluxograma | Os dois caminhos: com 20 imprime "Pode entrar", com 15 imprime "Entrada proibida". Sempre um dos dois, nunca os dois |
| 5 | E | A condição pode ser qualquer pergunta | expr | `idade >= 18 && temIngresso` → `true && false` → `false`: o `if` só recebe a resposta final (retoma a aula 4) |
| 6 | A | Exercício: o que aparece? | predict | `if` / `else` com `saldo` e `preco`; a turma escolhe a saída, depois a execução linha a linha mostra o caminho |
| 7 | E | `else if`: várias perguntas em fila | scene + fluxograma | Conceito pela nota: `>= 9` "A", `>= 7` "B", `>= 5` "C", senão "Reprovado". Com 8: o primeiro losango dá `false`, o segundo `true`, os demais nem são perguntados |
| 8 | E | A ordem importa | scene + fluxograma | As mesmas perguntas com `>= 5` primeiro: a nota 9,5 recebe "C". Regra: da condição mais exigente para a menos |
| 9 | A | Exercício: qual conceito? | sort | Classificar notas (`9.5`, `7`, `6.9`, `5`, `4.9`, `10`, `0`, `8`) nos escaninhos A, B, C e Reprovado |
| 10 | A | Exercício: escolha o valor | branch | Mesmo código do slide 7; a turma troca a nota e cumpre os desafios: "faça aparecer B", "faça aparecer Reprovado" |
| 11 | E | Bloco e indentação | cards | `{ }` marcam o que roda junto; a indentação é para quem lê; o `else` pertence ao `if` logo acima |
| 12 | A | Curiosidade: `if` sem chaves | scene | Sem chaves, só a primeira linha pertence ao `if`: a segunda roda sempre, mesmo indentada. Caso real: o erro "goto fail" da Apple (2014), uma linha repetida depois de um `if` sem chaves |
| 13 | A | `=` dentro do `if` | scene | JS/TS: `if (x = 5)` guarda 5 e sempre entra. Java: não compila com `int`. Retoma "`=` guarda, `==` compara" da aula 3 |
| 14 | A | Verdadeiro por conversão (só JS/TS) | scene | `if (nome)` com `""` não entra; valores "falsos" da aula 4 (`0`, `""`, `null`, `undefined`, `NaN`) |
| 15 | A | O `if` do Java só aceita `boolean` (só Java) | scene | `if (1)` e `if (nome)` não compilam; é preciso comparar (`nome.isEmpty()`, `x != 0`) |
| 16 | A | `if` dentro de `if` | scene + fluxograma | `if` aninhado que pode virar `&&`; quando o aninhado faz sentido (mensagens diferentes para cada falta) |
| 17 | A | Operador ternário | expr | `idade >= 18 ? "adulto" : "menor"` → `true ? "adulto" : "menor"` → `"adulto"`: um `if` / `else` que devolve um valor e cabe num baú |
| 18 | E | Desafio: par ou ímpar | scene + fluxograma | `if (numero % 2 === 0)` (Java `== 0`) com 7 e 10 (prometido na aula 2) e a divisão protegida `if (divisor !== 0)` |
| 19 | E | Resumo | cards | `if`, `else`, `else if` (ordem importa), chaves; próxima aula: switch case |

### Diferenças por sintaxe (aula 5)

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Condição | Qualquer valor (convertido para verdadeiro ou falso) | Qualquer valor | Só `boolean` |
| `if (x = 5)` | Guarda 5 e entra | Guarda 5 e entra (conferir se o `tsc` avisa) | Não compila (`int` não vira `boolean`) |
| `if (nome)` | Entra se o texto não for vazio | Idem | Não compila |
| Ternário | `c ? a : b` | `c ? a : b` | `c ? a : b` |

## Aula 6: Switch Case (roteiro)

Slug: `switch-case`. Exemplos: dia da semana, opção de menu, cor do semáforo, calculadora.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 18 slides no deck; cada sintaxe vê **16** (slides 9 e 12 só JS/TS, slides 10 e 11 só Java).

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Switch Case" | cover | |
| 2 | E | Muitos `else if` com o mesmo valor | scene | Dia da semana com `else if (dia === 1)`, `(dia === 2)`, ...: repete `dia ===` em toda linha |
| 3 | E | `switch`: o valor procura a etiqueta | scene + triagem | `switch (dia)` com `case 1`, `case 2`, `case 3`: o item 2 desce e cai no escaninho `case 2` |
| 4 | E | `default`: quando nenhum `case` serve | scene + triagem | Com 9, nenhuma etiqueta confere e o item cai no `default` (o `else` do `switch`) |
| 5 | E | `break`: pare aqui | scene + triagem | Sem `break`, o item 1 cai em `case 1` e continua descendo: imprime as linhas de `case 2` e `case 3` também (fall-through) |
| 6 | A | Exercício: o que aparece? | predict | `switch` com um `break` faltando; a turma escolhe a saída e a execução mostra a queda |
| 7 | E | Casos juntos de propósito | scene + triagem | `case 6: case 7:` (sábado e domingo) imprime "Fim de semana": o fall-through usado a favor |
| 8 | E | `switch` com texto | scene | `switch (cor)` com `"verde"`, `"amarelo"`, `"vermelho"` (Java aceita `String` desde o 7) |
| 9 | A | O `switch` compara com `===` (só JS/TS) | scene | JS: `switch ("5")` com `case 5` cai no `default`. TS recusa antes de rodar (TS2678) |
| 10 | A | O que o `switch` do Java aceita (só Java) | scene | `int`, `char`, `String`, `enum`; `double` e `boolean` não compilam; `case` repetido não compila |
| 11 | A | Java moderno: `case` com seta (só Java) | scene | `case 6, 7 -> ...` sem `break` e sem queda; `switch` que devolve valor: `String nome = switch (dia) { ... };` |
| 12 | A | Curiosidade: `switch (true)` (só JS/TS) | scene | `case nota >= 9:` faixas de valores num `switch`; funciona, mas o `else if` costuma ser mais claro |
| 13 | E | `switch` ou `if`? | cards | `switch`: um valor comparado com valores fixos. `if`: faixas, condições combinadas, comparações diferentes |
| 14 | A | Exercício: `switch` ou `if`? | sort | Classificar situações ("conceito pela nota", "opção 1 a 4 do menu", "idade e ingresso", "cor do semáforo", ...) |
| 15 | A | Exercício: escolha o valor | branch | `switch` do dia da semana; desafios: "faça aparecer Fim de semana", "faça cair no default" |
| 16 | A | Curiosidade: o `break` que parou os EUA | cards | Em 1990, um `break` mal colocado num `switch` em C derrubou parte da rede de longa distância da AT&T por cerca de 9 horas |
| 17 | E | Desafio: calculadora | scene | `switch (op)` com `"+"`, `"-"`, `"*"`, `"/"` (retoma a aula 2) e um `if` dentro do `case "/"` para o divisor zero (retoma a aula 5) |
| 18 | E | Resumo | cards | `switch`, `case`, `break`, `default`, fall-through, quando usar `if`; próxima aula: laços de repetição |

### Diferenças por sintaxe (aula 6)

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Comparação | `===` | `===`, com checagem de tipo (TS2678) | `==` para números e `char`, `equals` para `String` |
| Tipos aceitos | Qualquer valor | Qualquer valor | `int`, `char`, `String`, `enum` (e embrulhos como `Integer`) |
| `case` repetido | Roda o primeiro | Conferir se o `tsc` acusa | Não compila |
| Sem queda | não existe | não existe | `case ... ->` (Java 14 ou mais novo) |
| `switch` que devolve valor | não existe | não existe | `switch` com seta e `yield` |

## Componentes e tipos novos

| Item | Onde | Descrição |
|---|---|---|
| `kit-flow` | `ui/flow/` | Fluxograma em SVG nas cores do tema: início, losangos com a condição, setas `true` / `false`, caixas com o que roda e fim. Formatos `if`, `else`, `chain` (`else if` com até 4 condições e `else` opcional). O caminho percorrido acende; cada losango já perguntado mostra a resposta. `prefers-reduced-motion`: sem animar o caminho, só troca de estado. |
| `SceneStep.flow` | `kit.data.ts` | `{ shape, conditions, outcomes, answers }` (aceita `BySyntax` nos textos): `answers` são as respostas dos losangos já perguntados (`[false, true]` = parou no segundo); o caminho é calculado a partir delas. `null` tira o fluxograma da cena. |
| `kit-switch` | `ui/switch/` | Triagem em SVG: o item do valor no topo, fileira de escaninhos com etiqueta (`case`), `default` por último e uma marca de `break` em cada escaninho que tem. O item cai no escaninho que confere e segue descendo enquanto não houver `break`. |
| `SceneStep.sorter` | `kit.data.ts` | `{ value, cases: { label, brk }[], hasDefault, landed }`: `landed` é o índice onde o item cai (ou `default`); os escaninhos atravessados pela queda são calculados a partir dos `brk`. |
| `SceneStep.skip` | `kit.data.ts` | Linhas do código (base 1) que **não rodam** nesta etapa; ficam apagadas. Vale para todas as cenas (aceita `BySyntax`). |
| `branch` (exercício) | `slides/branch-view.ts` | Código + fluxograma (ou triagem) com valores para escolher (botões, teclado); cada valor declara o caminho e a saída; desafios com objetivo de saída ("faça aparecer B"), feedback com `aria-live` e botão reiniciar. Fica dentro de `data-kit-exercise`. |

- Os novos tipos entram no `Slide` (união discriminada) e no `stepCount`.
- Textos de interface do exercício novo (escolha o valor, objetivo, acerto, próximo desafio) vão para `kit.exercise` nos três dicionários.
- O teste de cada deck confere as saídas do exercício `branch` rodando o código em JS com cada valor (extensão do `jsOutputProblems`), e confere que o caminho do fluxograma e da triagem bate com a saída.

## Ajustes nas aulas 2 e 4

- Aula 2: as notas "aula de condicionais" (par ou ímpar, divisão por zero) passam a citar a **aula 5, Condicionais**.
- Aula 4: o resumo já aponta para condicionais; conferir o texto.

## Catálogo e textos

| Aula | PT | EN | FR-CA | Duração |
|---|---|---|---|---|
| 5 | Condicionais | Conditionals | Structures conditionnelles | 10 min a 3 h |
| 6 | Switch Case | Switch Case | Switch case | 10 min a 3 h |

- Resumos curtos nos três idiomas; regras de copy do projeto valem (sem travessão, FR com uso canadense e espaço antes de `:`).
- `sitemap.xml`: `/kit/logica-de-programacao/condicionais/1` e `/kit/logica-de-programacao/switch-case/1`.

## Fatos a conferir na execução

Cada saída e mensagem de erro mostrada nos slides deve ser conferida rodando o código nas três linguagens (ou no compilador), em especial:
- TS: `if (x = 5)` (aviso ou não), `switch ("5")` com `case 5` (TS2678) e `case` repetido.
- Java: `if (x = 5)` com `int`, `if (1)`, `switch` com `double` e `boolean`, `case` repetido, `case` com seta e `switch` que devolve valor.
- **JDK da máquina:** `~/.jdks/ms-17.0.19` (Microsoft Build of OpenJDK 17). As mensagens do `javac` mostradas nos slides são as do JDK 17; o `case` com seta e o `switch` que devolve valor existem desde o Java 14.
- **Java das aulas 3 e 4:** como agora há JDK, os trechos de Java das specs 007 e 008 (nunca executados) também são rodados e, se algo não bater, corrigidos nesta spec.
- Caso "goto fail" (Apple, 2014) e queda da AT&T (15 de janeiro de 1990): datas e descrição nas notas.

## Testes

- Unitários: `kit-flow` (caminho certo nos três formatos, para no primeiro `true`), `kit-switch` (cai no `case` certo, `default`, queda até o `break`), `skip` na cena, `stepCount` do `branch`, exercício `branch` (acerto, reiniciar, teclado), e os testes de deck das duas aulas (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, contas dos `expr`, saídas em JS, respostas dos exercícios, sem travessão).
- Manual no Chrome: sequência 4 → 5 → 6 pelo convite, as duas aulas nos dois roteiros e nas três sintaxes, exercício `branch` com mouse e teclado, slides exclusivos de Java e de JS/TS, `prefers-reduced-motion`.
