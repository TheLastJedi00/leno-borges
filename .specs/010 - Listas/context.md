# 010 - Listas: aula 7 do kit

## Objetivo

Publicar a próxima aula da trilha **Lógica de Programação**:

- **Aula 7: Listas.** Guardar vários valores com um nome só, ler pelo índice e usar as operações de uma lista: criar, ler, saber o tamanho, adicionar, inserir, trocar, remover, procurar, juntar em texto e ordenar.

Laços de repetição passam a ser a aula 8: com uma lista na mão, a pergunta "como passar por todos os itens?" abre a próxima aula.

O formato é o mesmo das aulas anteriores (specs 006 a 009): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos. O convite de próxima aula passa a ligar: ... → Condicionais → Switch Case → Listas.

## Princípio da aula: mesma operação, nome diferente

- Cada slide mostra **a mesma operação** nas três sintaxes; muda só o nome do método. A turma aprende a operação, não o nome.
- **Java usa `List` / `ArrayList`, não o array (`String[]`).** O array do Java tem tamanho fixo e não tem `add` nem `remove`, então não serve para as mesmas operações do JS/TS. Ele aparece só como curiosidade do Java (slide 18).
- `List` é o tipo (o que dá para fazer com a lista); `ArrayList` é a lista de verdade que o `new` cria. O slide 3 explica isso em uma frase; as notas aprofundam.
- Métodos do Java 21 (`getFirst()`, `getLast()`, `removeLast()`) ficam só nas notas: o JDK da máquina é o 17 e os trechos são conferidos nele.

## Dependência

Parte da `main` depois do merge do PR #12 (spec 009). Usa os slides `scene`, `expr`, `predict`, `sort`, `branch`, `table` e `cards`, as linhas puladas (`skip`), o valor trocado (`value`, `@@`), o `npm run check:java` e o `nextLesson()`.

## Escopo

### Dentro
- Aula **Listas** completa.
- Nova ilustração: **gaveteiro** (`kit-list`).
- Ajustes nas conferências: o `runJs` imprime listas como o Node e o `check:java` importa `java.util` sozinho e aceita o endereço variável do array.
- Aula no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.
- Aula 6: o resumo e as notas que falam da "próxima aula" passam a citar Listas.

### Fora
- Percorrer a lista (`for`, `for...of`, `forEach`): fica para a aula 8, Laços de repetição.
- Funções que recebem função (`map`, `filter`, `sort((a, b) => a - b)`, `removeIf`): só citadas nas notas; voltam depois de laços e funções.
- Lista de listas (matriz), `Set`, `Map`, `LinkedList`, tuplas do TS.
- Array do Java além da curiosidade (slide 18).
- Tradução do conteúdo das aulas (segue só em PT).

## Metáfora

O baú da aula 1 guarda um valor. A lista é um **gaveteiro**: um móvel com um nome só (a etiqueta da lista) e gavetas lado a lado, cada uma com o seu número embaixo, começando do **0**.

| Ilustração | Como funciona |
|---|---|
| **Gaveteiro** (`kit-list`) | Ler é abrir a gaveta do número pedido. Adicionar no fim encaixa uma gaveta nova à direita; inserir no meio empurra as de depois uma casa e os números delas mudam; remover tira a gaveta e as de depois andam para a esquerda. Pedir um número que não existe mostra uma gaveta fantasma em vermelho. O array do Java é um gaveteiro parafusado: não cabe gaveta nova. |

## Aula 7: Listas (roteiro)

Slug: `listas`. Exemplos do dia a dia: frutas da feira, carrinho de compras, fila do caixa, notas da turma.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 23 slides no deck; cada sintaxe vê **21** (slides 16 e 17 só JS/TS, slides 18 e 19 só Java).
- Os números são a ordem no roteiro Completo com todos os slides.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Listas" | cover | |
| 2 | E | Uma lista no lugar de muitas variáveis | scene + baús | `fruta1`, `fruta2`, `fruta3` em três baús (aula 1) viram um gaveteiro `frutas` com três gavetas |
| 3 | E | Criar e mostrar a lista | scene + gaveteiro | JS `let frutas = ["maçã", "uva", "pera"];`, TS `let frutas: string[] = ...`, Java `List<String> frutas = new ArrayList<>(List.of("maçã", "uva", "pera"));` com os `import` do `java.util`. Imprimir a lista inteira |
| 4 | E | O índice começa no 0 | scene + gaveteiro | `frutas[0]` / `frutas.get(0)` dá "maçã", `[2]` / `get(2)` dá "pera". O número é a distância até a primeira gaveta |
| 5 | A | Tamanho e último item | expr | `frutas.length - 1` → `3 - 1` → `2` (Java `frutas.size() - 1`): o último índice é sempre o tamanho menos 1 |
| 6 | A | Exercício: escolha o índice | branch + gaveteiro | `frutas[@@]` / `frutas.get(@@)` com os índices 0, 1, 2 e 3. Desafios: "faça aparecer uva", "faça aparecer pera". O 3 mostra o que acontece fora da lista (slide 13) |
| 7 | E | Adicionar no fim | scene + gaveteiro | `push("kiwi")` / `add("kiwi")`: uma gaveta nova à direita; o tamanho passa de 3 para 4 |
| 8 | E | Trocar um item | scene + gaveteiro | `frutas[1] = "kiwi"` / `frutas.set(1, "kiwi")`: a gaveta 1 troca de conteúdo, as outras não mudam |
| 9 | E | Remover | scene + gaveteiro | Do fim: `pop()` / `remove(frutas.size() - 1)`. Por índice: `splice(0, 1)` / `remove(0)`: as gavetas de depois andam e os números mudam ("uva" passa a ser a 0) |
| 10 | A | Inserir no meio | scene + gaveteiro | `splice(1, 0, "kiwi")` / `add(1, "kiwi")`: as de depois andam uma casa para a direita |
| 11 | A | Exercício: quem é o primeiro da fila? | predict | Fila `["Ana", "Bia", "Caio"]`: atende (remove o 0), chega "Davi" no fim, imprime `fila[0]` e o tamanho. A saída é um item e um número (igual nas três sintaxes), não a lista inteira |
| 12 | E | Procurar na lista | scene | `includes("uva")` / `contains("uva")` dá `true`; `indexOf("uva")` (mesmo nome nas três) dá 1, e -1 quando não existe. Com o `if` da aula 5: `if (carrinho.includes("leite"))` |
| 13 | A | Fora da lista | scene + gaveteiro | `frutas[10]`: JS e TS imprimem `undefined` (o TS diz que é `string`); Java para com `IndexOutOfBoundsException: Index 10 out of bounds for length 3` |
| 14 | A | Uma lista, um tipo | scene | `frutas.push(5)`: JS aceita e mistura; TS recusa (TS2345); Java não compila (`incompatible types: int cannot be converted to String`) |
| 15 | A | Juntar em texto e ordenar | scene | `join(", ")` / `String.join(", ", frutas)` dá `maçã, uva, pera`; `sort()` / `Collections.sort(frutas)` põe em ordem alfabética |
| 16 | A | Curiosidade: o `sort` ordena como texto (só JS/TS) | scene | `[10, 9, 1].sort()` dá `[ 1, 10, 9 ]`: compara "10" com "9" letra a letra. O jeito certo (`sort((a, b) => a - b)`) fica nas notas, para depois de funções |
| 17 | A | `const` não congela a lista (só JS/TS) | scene | `const frutas = [...]` aceita `push` e troca de item; só não aceita `frutas = outraLista` (retoma a aula 1) |
| 18 | A | Curiosidade: o array do Java (só Java) | scene + gaveteiro parafusado | `String[] frutas = {"maçã", "uva", "pera"};`: tamanho fixo, `frutas.length` sem parênteses, sem `add`; imprimir mostra `[Ljava.lang.String;@...` (precisa de `Arrays.toString`). Por isso a aula usa `List` |
| 19 | A | `List<Integer>` e o `remove` que confunde (só Java) | scene | `List<int>` não compila (a lista guarda objetos: `Integer`). Em `List<Integer>`, `numeros.remove(1)` remove o **índice** 1, não o número 1 |
| 20 | A | Mesma operação, nome diferente | table | Uma linha por operação, com as colunas JS/TS e Java lado a lado (igual nas três sintaxes): a tabela de equivalência abaixo, sem as linhas de erro |
| 21 | A | Exercício: qual operação? | sort | Situações ("chegou mais um na fila", "o primeiro da fila foi atendido", "tem leite no carrinho?", "qual a terceira música da playlist?", ...) nos escaninhos Ler, Adicionar, Remover e Procurar, com o método de cada sintaxe na etiqueta |
| 22 | E | Desafio: carrinho de compras | scene + gaveteiro | Cria o carrinho, adiciona dois itens, confere com `if` se tem "leite" antes de adicionar, remove um e imprime o tamanho. Fecha com a pergunta: "e para mostrar cada item numa linha, sem escrever uma linha por item?" |
| 23 | E | Resumo | cards | Lista = vários valores com um nome; índice começa no 0; tamanho; adicionar, trocar, remover, procurar (com os nomes da sintaxe escolhida); próxima aula: laços de repetição |

### Tabela de equivalência (slide 20 e notas)

| Operação | JavaScript | TypeScript | Java (`List` / `ArrayList`) |
|---|---|---|---|
| Criar | `["maçã", "uva"]` | `let l: string[] = [...]` | `new ArrayList<>(List.of("maçã", "uva"))` |
| Lista vazia | `[]` | `let l: string[] = []` | `new ArrayList<>()` |
| Ler | `l[0]` | `l[0]` | `l.get(0)` |
| Tamanho | `l.length` | `l.length` | `l.size()` |
| Último | `l[l.length - 1]` (`l.at(-1)` nas notas) | idem | `l.get(l.size() - 1)` (`getLast()` no Java 21, nas notas) |
| Adicionar no fim | `l.push(x)` | `l.push(x)` | `l.add(x)` |
| Inserir na posição | `l.splice(i, 0, x)` | idem | `l.add(i, x)` |
| Trocar | `l[i] = x` | `l[i] = x` | `l.set(i, x)` |
| Remover do fim | `l.pop()` | `l.pop()` | `l.remove(l.size() - 1)` (`removeLast()` no Java 21, nas notas) |
| Remover por índice | `l.splice(i, 1)` | idem | `l.remove(i)` |
| Contém | `l.includes(x)` | `l.includes(x)` | `l.contains(x)` |
| Posição | `l.indexOf(x)` (-1 se não tem) | idem | `l.indexOf(x)` (-1 se não tem) |
| Juntar em texto | `l.join(", ")` | idem | `String.join(", ", l)` |
| Ordenar | `l.sort()` (como texto) | idem | `Collections.sort(l)` |

### Diferenças por sintaxe (comportamento)

| Situação | JavaScript | TypeScript | Java |
|---|---|---|---|
| Imprimir a lista | `[ 'maçã', 'uva' ]` (Node) | idem | `[maçã, uva]` |
| Índice que não existe | `undefined` | `undefined` (o tipo diz `string`; `noUncheckedIndexedAccess` nas notas) | `IndexOutOfBoundsException` |
| Item de outro tipo | Aceita | Erro TS2345 | Não compila |
| Tamanho | Cresce e diminui | Idem | `ArrayList` cresce e diminui; array e `List.of` não (notas: `UnsupportedOperationException`) |
| Lista de números | `[1, 2]` | `number[]` | `List<Integer>` (não `List<int>`) |

## Componentes e tipos novos

| Item | Onde | Descrição |
|---|---|---|
| `kit-list` | `ui/list/` | Gaveteiro em SVG nas cores do tema: etiqueta com o nome da lista, gavetas lado a lado com o conteúdo e o índice embaixo. Cada gaveta mantém a identidade (`id`) entre etapas para animar: entrar à direita, abrir espaço no meio, sair e fechar o espaço, trocar o conteúdo. Gaveta em foco (lida, trocada), gaveta fantasma para índice fora da lista (vermelha) e variante `fixed` (parafusado, array do Java). `prefers-reduced-motion`: troca de estado sem deslizar. |
| `SceneStep.list` | `kit.data.ts` | `{ name, items: { id, value }[], focus?, outside?, fixed? }` (aceita `BySyntax`): `focus` é o índice em destaque, `outside` o índice pedido fora da lista. `null` tira o gaveteiro da cena. |
| `BranchSlide.list` | `kit.data.ts` | O exercício "escolha o valor" também aceita o gaveteiro: o valor escolhido vira o `focus` (ou o `outside`, se passar do tamanho). |

- O novo campo entra no zoom da cena (`listZoom`, como `flowZoom` e `sorterZoom`) e no teste de cena.
- O gaveteiro reaproveita as cores e a tipografia do baú (`kit-chest`) para a turma reconhecer a ideia da aula 1.

## Conferências (deck-checks e check:java)

- **`runJs`** passa a imprimir listas como o `console.log` do Node (`[ 'maçã', 'uva' ]`, `[ 1, 10, 9 ]`), em vez de `String(lista)` (`maçã,uva`). O formato do Node é o que a turma vê no terminal; o console do navegador mostra diferente (fica nas notas do slide 3).
- **`check:java`** importa `java.util.*` quando o trecho não tem `import` (para os slides não repetirem as linhas de import) e aceita o endereço do array (`[Ljava.lang.String;@1b6d3586`) com qualquer número depois do `@`.
- O teste do deck confere que o gaveteiro de cada etapa bate com a lista que o código impresso mostra (como o teste da triagem na aula 6).

## Ajustes na aula 6

- Resumo: "Próxima aula: laços de repetição" passa a "Próxima aula: listas, guardar vários valores com um nome só".
- Notas que citam laços como a próxima aula passam a citar Listas.

## Catálogo e textos

| Aula | PT | EN | FR-CA | Duração |
|---|---|---|---|---|
| 7 | Listas | Lists | Listes | 10 min a 3 h |

- Resumos curtos nos três idiomas; regras de copy do projeto valem (sem travessão, FR com uso canadense e espaço antes de `:`).
- `sitemap.xml`: `/kit/logica-de-programacao/listas/1`.

## Fatos a conferir na execução

Cada saída e mensagem de erro mostrada nos slides deve ser conferida rodando o código nas três linguagens (Node, `tsc --strict` e JDK 17), em especial:
- JS/TS: formato do `console.log` de listas no Node, `[10, 9, 1].sort()`, `frutas[10]`, `push(5)` no TS (TS2345, texto exato), `splice` e `pop`.
- Java: `IndexOutOfBoundsException` (texto exato no JDK 17), `add(5)` em `List<String>`, `List<int>` (mensagem exata do `javac`), `remove(1)` em `List<Integer>`, impressão do array, `List.of(...).add(...)` (`UnsupportedOperationException`, nas notas).

## Testes

- Unitários: `kit-list` (entrar, inserir, remover, trocar mantendo os `id`, índices renumerados, gaveta fantasma, variante `fixed`), `list` na cena e no exercício `branch`, `runJs` com listas, e o teste de deck da aula (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, contas dos `expr`, saídas em JS, gaveteiro conferindo com a saída, respostas dos exercícios, sem travessão).
- `npm run check:java -- listas` sem diferenças.
- Manual no Chrome: sequência 6 → 7 pelo convite, a aula nos dois roteiros e nas três sintaxes, exercícios (clique e teclado), slides exclusivos de Java e de JS/TS, tabela do slide 20 sem rolagem.
