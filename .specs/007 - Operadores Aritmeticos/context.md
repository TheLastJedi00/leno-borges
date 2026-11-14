# 007 - Operadores Aritméticos: segunda aula do kit e passagem direta entre aulas

## Objetivo

Publicar a **aula 2 da trilha Lógica de Programação: Operadores Aritméticos**, no mesmo formato da aula 1 (spec 006): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos.

E deixar a apresentação **dinâmica entre aulas**: ao terminar uma aula, o player **pergunta se o apresentador quer seguir direto para a próxima aula da trilha**. Confirmar abre a próxima aula no slide 1, com a mesma sintaxe e o mesmo roteiro, sem voltar ao catálogo.

## Escopo

### Dentro
- Convite "Seguir para a próxima aula?" no fim de qualquer aula que tenha uma seguinte na trilha (hoje: aula 1 → aula 2).
- Aula **Operadores Aritméticos** completa (essenciais, aprofundamentos, curiosidades e exercícios).
- Novo tipo de slide `expr`: avaliação de expressão passo a passo (precedência e parênteses).
- Aula no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.

### Fora
- Operadores relacionais e lógicos (`>`, `===`, `&&`...): ficam para a aula de condicionais.
- Tradução do conteúdo das aulas (segue só em PT, como na spec 006).
- Voltar automaticamente para a aula anterior ao recuar do slide 1.

## Passagem para a próxima aula

| Tema | Decisão |
|---|---|
| Quando aparece | Ao avançar na **última etapa do último slide** do roteiro ativo, se a trilha tiver uma aula seguinte. Vale nos dois roteiros. Sem aula seguinte, nada muda (o avanço para no fim, como hoje). |
| Visual | Painel sobre o palco: selo "Fim da aula", pergunta "Seguir para a próxima aula?", título da próxima aula e dois botões: **Seguir** (primário) e **Ficar nesta aula**. |
| Teclado e passador | Com o painel aberto: `→`, `Espaço`, `PageDown` ou `Enter` **seguem**; `←`, `PageUp` ou `Esc` **fecham** o painel e ficam no último slide. Assim um passador de slides atravessa as aulas sem mouse. |
| Ao seguir | Abre `/kit/:trilha/:proxima/1` com a mesma `?sintaxe=` (se a próxima aula a suportar) e o mesmo `?roteiro=`. Navegação normal (entra no histórico: voltar no navegador retorna à aula anterior). |
| Janela do apresentador | Mostra o mesmo convite no lugar de "Próximo" e tem os mesmos botões. O estado do convite (aberto/fechado) sincroniza pelo `BroadcastChannel`; seguir em qualquer janela leva as duas para a próxima aula. |
| Textos | Interface trilíngue no dicionário (`kit.player.end`); o título da próxima aula vem de `kit.tracks`. |

Implementação:
- `kit.data.ts`: `nextLesson(trackSlug, lessonSlug)` devolve a aula seguinte da trilha (ou `undefined`).
- `PlayerState`: guarda a trilha, expõe `upNext` (próxima aula) e `asking` (convite aberto). `next()` no fim abre o convite; com o convite aberto, `next()` segue e `prev()` fecha. O convite entra no `SyncMessage` de estado; uma nova mensagem `{ type: 'lesson', track, lesson }` pede às outras janelas que sigam.
- Rotas: hoje o Angular reaproveita o componente do player quando só os parâmetros mudam, e o player lê a rota uma vez. Um `RouteReuseStrategy` do app passa a **recriar** o componente quando `trilha` ou `aula` mudam (trocar de slide continua reaproveitando).

## Aula 2: Operadores Aritméticos (roteiro)

Metáfora continua a mesma: o operador **abre os baús, faz a conta com os itens e guarda o resultado** em um baú. Exemplos genéricos do dia a dia (carrinho, notas, saldo, relógio).

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 22 slides em cada sintaxe: 21 comuns e 1 exclusivo (slide 7 só em Java, slide 18 só em JS/TS).
- Os números da tabela são a ordem no roteiro Completo com todos os slides; no Essencial, o player numera de 1 a 10 só os slides E.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Operadores Aritméticos" | cover | |
| 2 | E | Fazer contas com os itens | cards | Total do carrinho, média das notas, troco |
| 3 | A | Operando, operador, expressão | cards | Vocabulário: `7 + 2` tem dois operandos, um operador, e a expressão vira um resultado |
| 4 | E | Os cinco operadores | table | `+ - * / %` com exemplo e resultado na sintaxe ativa (`7 / 2` = 3.5 em JS/TS e 3 em Java) |
| 5 | E | O operador abre os baús | scene | `preco` 10 e `qtd` 3; `total = preco * qtd` guarda 30 |
| 6 | E | Divisão: inteira ou decimal? | scene | JS/TS: `7 / 2` = 3.5. Java: `7 / 2` = 3 e `7.0 / 2` = 3.5 |
| 7 | A | Média que perde a vírgula (só Java) | scene | `(7 + 8) / 2` = 7; com `2.0` vira 7.5 |
| 8 | E | O resto da divisão: `%` | expr | `17 % 5`: 17 = 5 × 3 + 2, resto 2 |
| 9 | A | Para que serve o resto? | cards | Par ou ímpar, último dígito, relógio, repetir a cada N |
| 10 | E | Quem vem primeiro? | expr | `2 + 3 * 4` → `2 + 12` → `14` |
| 11 | E | Parênteses mandam | expr | `(2 + 3) * 4` → `5 * 4` → `20` |
| 12 | A | Mesma prioridade: da esquerda para a direita | expr | `20 / 2 * 5` → 50 e `10 - 4 - 3` → 3 |
| 13 | A | Exercício: quanto vale `total`? | predict | `preco * qtd - 10 / 2` = 55 |
| 14 | E | Atalhos de atribuição | scene | `saldo` 100, `-= 30`, `*= 2`, `/= 4` → 35 |
| 15 | A | `++` e `--`: antes ou depois? | scene | `b = a++` guarda 5; `c = ++a` guarda 7 |
| 16 | A | Exercício: qual o valor de `x`? | predict | `x = 7; x += 3; x %= 4; x *= 5` → 10 |
| 17 | A | O `+` também junta textos | scene | `"Nota: " + 7`, `"1" + 2 + 3` = "123", `1 + 2 + "3"` = "33" |
| 18 | A | Curiosidade: texto em conta (só JS/TS) | scene | JS: `"6" * 2` = 12, `"abc" * 2` = NaN. TS recusa antes de rodar |
| 19 | A | Curiosidade: dividir por zero | scene | JS/TS: `Infinity` e `NaN`. Java: `int` lança `ArithmeticException`, `double` dá `Infinity` |
| 20 | A | Curiosidade: potência | scene | JS/TS `2 ** 10` = 1024; Java `Math.pow(2, 10)` = 1024.0 |
| 21 | A | Arredondar com `Math` | table | `floor`, `ceil`, `round`, `abs`, `sqrt` com o resultado na sintaxe ativa |
| 22 | A | Desafio: segundos em minutos | scene | 125 s = 2 min 5 s, com divisão inteira (Java) ou `Math.floor` (JS/TS) e `%` |
| 23 | E | Resumo | cards | Operadores, prioridade, parênteses, atalhos |

### Diferenças por sintaxe

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| `7 / 2` | `3.5` | `3.5` | `3` (inteiro com inteiro) |
| Potência | `2 ** 10` | `2 ** 10` | `Math.pow(2, 10)` → `1024.0` |
| `10 / 0` | `Infinity` | `Infinity` | `ArithmeticException: / by zero` |
| `"6" * 2` | `12` | erro de compilação | erro de compilação (não entra no slide) |
| `Math.floor(7.8)` | `7` | `7` | `7.0` |
| `-7 % 3` | `-1` | `-1` | `-1` |

## Slide `expr`

- Mostra uma expressão grande, em fonte mono, e a reduz etapa a etapa: cada etapa acrescenta uma linha abaixo da anterior (a "escada" da conta), e a parte calculada naquela etapa fica em destaque.
- Marcação: a mesma do código (`{v:2} + {v:3} * {v:4}`), com `[[ ]]` em volta do trecho em destaque.
- Cada etapa pode trazer legenda e uma linha pode variar por sintaxe (`BySyntax`).

## Testes

- Unitários: `nextLesson`, convite no fim (abre, segue, fecha, sem próxima aula não abre), sincronia do convite, `RouteReuseStrategy` (recria ao trocar de aula, reaproveita ao trocar de slide), marcação `[[ ]]` do `expr`, e os testes de deck da aula 2 (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, sem travessão).
- Manual no Chrome: fim da aula 1 com teclado e com clique (seguir e ficar), janela do apresentador seguindo junto, aula 2 nos dois roteiros e nas três sintaxes, exercícios.
