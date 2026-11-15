# 012 - Funções: aula 9 do kit

## Objetivo

Publicar a próxima aula da trilha **Lógica de Programação**:

- **Aula 9: Funções.** Dar nome a um trecho de código e chamá-lo quando precisar (declarar e chamar), passar valores (parâmetros), receber uma resposta (`return`) e entender que as variáveis de uma função só existem dentro dela (escopo).

A aula responde ao incômodo que as aulas 7 e 8 deixam: o mesmo trecho (a média, a tabuada, o `if` da nota) escrito de novo cada vez que é preciso.

O formato é o mesmo das aulas anteriores (specs 006 a 011): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos. O convite de próxima aula passa a ligar: ... → Listas → Laços de repetição → Funções.

## Princípio da aula: o `main` já era uma função

- Desde a aula 1, os slides em Java mostram só o corpo do `main` (o `check:java` acrescenta a classe por fora). Esta aula **revela o arquivo inteiro** (slide 4): todo o código que a turma escreveu em Java estava dentro de uma função, o `main`, que a JVM chama quando o programa começa.
- As funções novas do Java ficam **ao lado do `main`, dentro da `class Main`**, nunca dentro do `main`. Todas levam `static`, como o `main`; o porquê fica para a aula de objetos ("por enquanto, toda função nossa leva `static`").
- `public` e `String[] args` aparecem só no slide 4: `public` não entra nas nossas funções; `String[] args` é apresentado como o parâmetro do `main` (e o array que sobreviveu à aula 7, em uma frase nas notas).
- Em Java a função se chama **método**. A aula usa "função" no texto comum a todas as sintaxes e cita "método" nas legendas e notas do Java.
- JS/TS não têm `main`: o arquivo roda de cima para baixo, e a função só roda quando é chamada. É a mesma ideia (declarar não executa) dita de dois jeitos.

### Como o código em Java aparece nos slides

- **Slide 4** e slides que precisam do arquivo inteiro (função dentro do `main`, slide 16): a classe completa, com o `main`.
- **Demais slides:** as funções primeiro, uma linha de comentário `// no main` e, depois dela, as linhas que estão dentro do `main`, sem a indentação. Assim o trecho em Java tem o mesmo tamanho do JS/TS (só `static` e os tipos a mais) e a fonte não encolhe. A legenda do slide 4 explica a convenção.

```java
static int dobro(int n) {
    return n * 2;
}
// no main
System.out.println(dobro(4));
```

## Dependência

Parte da `main` depois do merge do PR #14 (spec 011). Usa os slides `scene`, `predict`, `sort`, `branch`, `trace` e `cards`, os baús (`kit-chest`), o gaveteiro (`kit-list`), as linhas puladas (`skip`), o valor trocado (`value`, `@@`), o `noRun`, o `npm run check:java` e o `nextLesson()`.

## Escopo

### Dentro
- Aula **Funções** completa.
- Nova ilustração: **pilha de chamadas** (`kit-stack`).
- `check:java` entende a convenção `// no main`: as linhas antes do comentário vão para o nível da classe e as linhas depois dele para dentro do `main`.
- Aula no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.
- Aula 8: o resumo e as notas que falam da "próxima aula" passam a citar Funções pelo nome.

### Fora
- Objetos, classes e o porquê do `static` (próxima etapa da trilha).
- `forEach`, `map`, `filter` e lambdas do Java: só citados nas notas (agora que a turma sabe passar valores para funções).
- Recursão: só como curiosidade nas notas do slide 9 (uma função que chama a si mesma).
- Parâmetros com valor padrão, `...rest` e varargs do Java: só nas notas.
- Passagem por referência de listas (mudar a lista dentro da função muda a de fora): só nas notas do slide 15.
- Tradução do conteúdo das aulas (segue só em PT).

## Metáfora

Cada chamada abre uma **sala** em cima da sala de quem chamou. A sala tem os próprios baús (parâmetros e variáveis). O `return` fecha a sala e entrega o valor para a sala de baixo; os baús de dentro somem com ela.

| Ilustração | Como funciona |
|---|---|
| **Pilha de chamadas** (`kit-stack`) | Salas empilhadas, de baixo para cima: o `main` (Java) ou o "arquivo" (JS/TS) embaixo e cada chamada em cima. A sala do topo acende (é quem está rodando); cada sala mostra o nome da função e os baús em miniatura. No `return`, o valor sai da sala do topo numa etiqueta e cai na sala de baixo; a sala do topo some. |
| **Baús** (`kit-chest`, aula 1) | Os parâmetros recebem os valores da chamada; a variável de fora recebe o valor do `return`. |
| **Gaveteiro** (`kit-list`, aula 7) | A lista passada para a função (slide 15). |

## Aula 9: Funções (roteiro)

Slug: `funcoes`. Exemplos do dia a dia: cumprimentar alguém, calcular o dobro, a média das notas, saber se pode votar, a tabuada de um número.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 23 slides no deck; cada sintaxe vê **22** (slide 17 só Java, slide 18 só JS/TS).
- Os números são a ordem no roteiro Completo com todos os slides.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Funções" | cover | |
| 2 | E | O problema: o mesmo trecho em vários lugares | scene | Três cumprimentos de duas linhas cada (`Olá!` / `Bem-vindo à aula`) copiados: mudar a mensagem é mudar em três lugares |
| 3 | E | Declarar e chamar | scene + pilha | `function saudar() { ... }` (Java `static void saudar()`): declarar não imprime nada; cada `saudar();` abre a sala, roda as duas linhas e fecha. A linha da chamada e a linha de dentro da função acendem alternadas |
| 4 | E | Onde a função mora | scene | Por sintaxe. **Java:** o arquivo inteiro, `class Main` com `saudar` e `main` lado a lado: "todo o código das aulas 1 a 8 estava aqui dentro do `main`; a JVM chama o `main` quando o programa começa". **JS/TS:** o arquivo inteiro, sem `main`: o arquivo roda de cima para baixo e a função só roda quando é chamada. Legenda do Java explica a convenção `// no main` dos próximos slides |
| 5 | E | Parâmetros: o que a função recebe | scene + pilha + baú | `saudar(nome)` (TS `nome: string`, Java `String nome`): `saudar("Ana")` e `saudar("Bia")` abrem a sala com o baú `nome` valendo cada um |
| 6 | A | A ordem dos argumentos | scene | `apresentar(nome, idade)` chamado com os valores trocados: JS imprime a frase errada sem avisar; TS (`TS2345`) e Java (`incompatible types`) recusam |
| 7 | E | `return`: a resposta da função | scene + pilha + baú | `dobro(n)` com `return n * 2` (TS `: number`, Java `static int`): `let resultado = dobro(4);`, o 8 sai da sala e cai no baú `resultado` |
| 8 | A | Exercício: quanto dá? | predict | `log(dobro(dobro(3)))`: 12 (a chamada de dentro responde primeiro) |
| 9 | A | Uma função chama outra | scene + pilha | `media(a, b)` chama `somar(a, b)`: a pilha chega a três andares e desce um por um |
| 10 | A | `return` encerra a função | scene | Uma linha depois do `return` nunca roda. JS e TS rodam sem reclamar (a linha fica apagada no editor); Java não compila: `unreachable statement` |
| 11 | A | Função sem resposta | scene | Imprimir o resultado de `saudar()`: JS/TS imprimem `undefined` (TS: o tipo é `void`); Java não compila: `'void' type not allowed here` |
| 12 | E | Escopo: o que nasce na função fica na função | scene + pilha + baú | Usar fora a variável `total` criada dentro da função: JS `ReferenceError: total is not defined`; TS `TS2304`; Java `cannot find symbol`. A sala fechou e levou o baú |
| 13 | A | Cada chamada tem os próprios baús | scene + pilha + baú | `n` no `main` e `n` como parâmetro de `dobrar`: mudar o de dentro não muda o de fora; dois baús com o mesmo nome em salas diferentes |
| 14 | E | Função que responde sim ou não | scene + pilha | `podeVotar(idade)` com `return idade >= 16;` (aula 4; TS `: boolean`, Java `static boolean`), usada dentro de um `if` (aula 5) |
| 15 | A | Função com lista e laço | scene + gaveteiro + baú | `media(notas)` (TS `number[]`, Java `List<Integer>`) com o acumulador da aula 8 |
| 16 | A | Função dentro de função | scene | Por sintaxe. JS/TS: uma função declarada dentro de outra funciona e só existe lá dentro. Java (arquivo inteiro): um método dentro do `main` não compila (`illegal start of expression` ou a mensagem exata do JDK 17) |
| 17 | A | Mesmo nome, parâmetros diferentes (só Java) | scene | Sobrecarga: `somar(int a, int b)` e `somar(int a, int b, int c)`; o Java escolhe pelo número e pelo tipo dos argumentos. Nas notas: em JS a segunda declaração apaga a primeira |
| 18 | A | Função numa variável (só JS/TS) | scene | Arrow function: `const dobro = (n) => n * 2;` (TS `(n: number): number`) faz o mesmo que o `function` do slide 7. Nas notas: é o formato que o `map` e o `filter` usam |
| 19 | A | Exercício: escolha a nota | branch + pilha | `classificar(@@)` com `if` / `else if` / `else` e três `return` ("Aprovado", "Recuperação", "Reprovado"): a turma troca a nota e cumpre os desafios ("faça aparecer Recuperação") |
| 20 | A | Exercício: devolve ou só faz? | sort | Situações curtas nos escaninhos "devolve um valor (`return`)" e "só faz algo (`void`)": calcular o frete, dizer se é maior de idade, converter Celsius em Fahrenheit, mostrar o menu, imprimir o recibo, tocar um alarme |
| 21 | A | Curiosidade: o foguete que reaproveitou uma função | cards | Ariane 5, voo 501 (4 de junho de 1996): uma função do Ariane 4 convertia a velocidade horizontal de um número de 64 bits para um inteiro de 16 bits; no Ariane 5, mais rápido, o valor não coube, o sistema de navegação parou e o foguete se autodestruiu cerca de 40 s depois da decolagem. Reaproveitar função é bom, desde que ela sirva para os valores novos |
| 22 | E | Desafio: a tabuada vira função | scene + pilha | O laço da tabuada da aula 8 dentro de `tabuada(n)`: `tabuada(7)` e `tabuada(3)` com uma linha cada. A turma escreve `areaRetangulo(base, altura)` |
| 23 | E | Resumo | cards | Declarar não executa; parâmetros entram, `return` sai; o que nasce na função fica na função; em Java o `main` é uma função e as nossas ficam ao lado dele, com `static` |

### Diferenças por sintaxe

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Declarar | `function dobro(n) {` | `function dobro(n: number): number {` | `static int dobro(int n) {` (dentro da `class Main`) |
| Sem resposta | Devolve `undefined` | Tipo de retorno `void` | `void`; não dá para imprimir o resultado |
| Onde começa o programa | Primeira linha do arquivo | Primeira linha do arquivo | O `main` |
| Argumento do tipo errado ou fora de ordem | Roda com o valor errado | `TS2345` | `incompatible types` |
| Linha depois do `return` | Ignorada | Ignorada (aviso no editor) | `unreachable statement` |
| Variável de dentro usada fora | `ReferenceError` | `TS2304` | `cannot find symbol` |
| Função dentro de função | Pode | Pode | Não compila |
| Mesmo nome, parâmetros diferentes | A última vence | Erro de declaração duplicada (nas notas) | Sobrecarga |
| Função numa variável | Arrow function | Arrow function tipada | Lambda (só nas notas) |

## Componentes e tipos novos

| Item | Onde | Descrição |
|---|---|---|
| `kit-stack` | `ui/stack/` | Pilha de salas em SVG ou HTML nas cores do tema. Cada sala: nome da função (com marcação de código), baús em miniatura (nome e valor) e, opcionalmente, a etiqueta do `return` saindo pela borda de cima da sala de baixo. Sala do topo acesa. Animação curta ao abrir e fechar sala; `prefers-reduced-motion`: troca de estado sem animar. Rótulo para leitor de tela com a pilha de baixo para cima. |
| `SceneStep.stack` | `kit.data.ts` | `{ frames: { name, vars?: { name, value }[] }[], returning?: string }` (aceita `BySyntax` nos textos): `frames[0]` é a sala de baixo (`main` ou arquivo); `returning` é o valor que acabou de sair da sala que fechou. `null` tira a pilha da cena. |
| `BranchSlide.stack` | `kit.data.ts` | O exercício "escolha o valor" com a pilha: a sala de `classificar` mostra o baú `nota` com o valor escolhido. |
| `check:java` com `// no main` | `scripts/check-java.cjs` | Trecho com a linha `// no main`: o que vem antes vai para o nível da classe, o que vem depois para dentro do `main`. Trechos sem a linha e sem classe continuam inteiros dentro do `main`. |

- O tipo novo entra no `SceneStep` e na escala fixa por slide da `SceneView` (como `loopZoom` da aula 8).
- O teste de cada deck confere que o valor de `returning` aparece no baú ou na saída da etapa seguinte, e que a sala de baixo se chama `main` no Java.
- Textos de interface novos (rótulo da pilha para leitor de tela, nome da sala de baixo no JS/TS, "arquivo") vão para `kit.exercise` nos três dicionários.

## Ajustes em outras aulas e conferências

- Aula 8: o resumo e a nota "Próxima aula: funções" passam a citar a aula pelo nome; a nota sobre `forEach` / `map` / `filter` aponta para esta aula.
- `check:java`: convenção `// no main` (acima).
- O slide 4 com a classe inteira e o slide 16 (método dentro do `main`) já funcionam no `check:java` porque trazem a classe.

## Catálogo e textos

| Aula | PT | EN | FR-CA | Duração |
|---|---|---|---|---|
| 9 | Funções | Functions | Fonctions | 10 min a 3 h |

- Resumos curtos nos três idiomas; regras de copy do projeto valem (sem travessão, FR com uso canadense e espaço antes de `:`).
- `sitemap.xml`: `/kit/logica-de-programacao/funcoes/1`.
- O resumo da aula 9 cita a próxima aula pelo assunto ("objetos", onde o `static` vai embora) sem nome de slug, até a spec dela existir.

## Fatos a conferir na execução

Cada saída e mensagem de erro mostrada nos slides deve ser conferida rodando o código nas três linguagens (Node, `tsc --strict` e JDK 17), em especial:
- JS/TS: argumentos trocados (saída em JS, `TS2345` em TS), linha depois do `return` (o `tsc --strict` acusa ou não: depende de `allowUnreachableCode`; conferir e dizer o que a turma vê), `log(saudar())` imprime `undefined`, `ReferenceError: total is not defined`, `TS2304`, função dentro de função, arrow function.
- Java: `incompatible types` (texto exato do JDK 17 para os argumentos trocados), `unreachable statement`, `'void' type not allowed here`, `cannot find symbol`, mensagem de um método declarado dentro do `main`, sobrecarga escolhendo a versão certa.
- Ariane 5, voo 501: data (4 de junho de 1996), a conversão de 64 bits para inteiro de 16 bits, o reaproveitamento do código do Ariane 4 e o tempo até a autodestruição: conferir e citar nas notas.

## Testes

- Unitários: `kit-stack` (salas de baixo para cima, sala do topo acesa, baús em miniatura, etiqueta do `return`, rótulo para leitor de tela), `stack` na `SceneView` e no exercício `branch`, `check:java` com `// no main`, e o teste de deck da aula (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, saídas em JS com cada valor, `returning` conferido, respostas dos exercícios, sem travessão).
- `npm run check:java -- funcoes` sem diferenças, e a conferência completa das aulas 1 a 9 continua sem diferenças.
- Manual no Chrome: sequência 8 → 9 pelo convite, a aula nos dois roteiros e nas três sintaxes, slide 4 nas três sintaxes, pilha subindo e descendo, exercícios (clique e teclado), slides exclusivos de Java e de JS/TS.
