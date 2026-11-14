# 008 - Operadores Relacionais e Lógicos: aulas 3 e 4 do kit

## Objetivo

Publicar as próximas duas aulas da trilha **Lógica de Programação**, nesta ordem:

1. **Aula 3: Operadores Relacionais.** Comparar valores e receber uma resposta de verdadeiro ou falso.
2. **Aula 4: Operadores Lógicos.** Juntar e inverter essas respostas (`&&`, `||`, `!`).

O formato é o mesmo das aulas 1 e 2 (specs 006 e 007): player, roteiros `Essencial` / `Completo`, sintaxes JS, TS e Java, notas em tópicos e exercícios interativos. A passagem direta entre aulas (spec 007) passa a ligar a sequência inteira: Variáveis → Aritméticos → Relacionais → Lógicos.

## Dependência

Usa o slide `expr`, o `nextLesson()` e a escala de baús (`chestZoom`) da spec 007. A execução parte da `main` **depois do merge do PR #10**.

## Escopo

### Dentro
- Aula **Operadores Relacionais** completa.
- Aula **Operadores Lógicos** completa.
- Novas ilustrações: **balança** (aula 3) e **circuito de interruptores e lâmpada** (aula 4).
- Novos tipos de slide: **tabela-verdade** revelada linha a linha e **exercício de circuito** (ligar os interruptores para acender a lâmpada).
- Aulas no catálogo, nos três dicionários (título, resumo, duração) e no `sitemap.xml`.
- Ajuste nas notas da aula 2 que citam a "próxima aula".

### Fora
- `if` / `else`, `switch` e o operador ternário: ficam para a aula de condicionais.
- Operadores bit a bit (`&`, `|`, `^` com números) além de uma nota de "não confundir".
- Tradução do conteúdo das aulas (segue só em PT).

## Metáforas

A metáfora do baú continua: comparações e combinações **produzem um item `true` ou `false`**, que pode ser guardado num baú de formato verdadeiro/falso (`bool`, já existente).

| Aula | Ilustração | Como funciona |
|---|---|---|
| 3 | **Balança** (`kit-scale`) | Os itens de dois baús (ou dois valores) vão para os pratos; o operador fica no centro. Com números, a balança inclina para o lado maior; em igualdade, fica nivelada. Embaixo, a resposta `true` / `false` aparece como um item, pronto para cair num baú. |
| 4 | **Circuito** (`kit-circuit`) | Interruptores ligam uma lâmpada. `&&` = interruptores **em série** (a luz só acende com os dois ligados); `\|\|` = **em paralelo** (basta um); `!` = **inversor** (ligado apaga, desligado acende). Cada interruptor tem a etiqueta da condição (`maior`, `temIngresso`). |

## Aula 3: Operadores Relacionais (roteiro)

Slug: `operadores-relacionais`. Exemplos do dia a dia: idade mínima, saldo e compra, senha, nota.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 19 slides no deck; cada sintaxe vê **18** (slide 9 só JS/TS, slide 11 só Java).
- Os números são a ordem no roteiro Completo com todos os slides.

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Operadores Relacionais" | cover | |
| 2 | E | Perguntas de sim ou não | cards | "Tem 18 anos ou mais?" `idade >= 18`, "O saldo cobre a compra?" `saldo >= total`, "A senha confere?" (`===` em JS/TS, `equals` em Java) |
| 3 | E | A balança | scene + balança | `idade` 20 e `18` nos pratos, operador `>=` no centro, a balança inclina e a resposta `true` aparece |
| 4 | E | Os seis operadores | table | `>`, `<`, `>=`, `<=`, igual (`===` / `==`), diferente (`!==` / `!=`), com exemplo e resultado na sintaxe ativa |
| 5 | E | A resposta vai para um baú | scene | `maior = idade >= 18` guarda `true`; com `idade` 15, guarda `false` |
| 6 | E | A borda: `>` ou `>=`? | expr | `18 > 18` → `false`; `18 >= 18` → `true` |
| 7 | A | Exercício: verdadeiro ou falso | sort | Classificar comparações nos baús `true` e `false` (`7 > 3`, `2 >= 2`, `5 < 5`, `9 <= 4`, `3 * 2 > 5`, `10 / 2 < 5`, `0 >= -1`, `1 + 1 <= 2`) |
| 8 | E | `=` guarda, `==` compara | cards | Atribuição x comparação; o erro de trocar um pelo outro |
| 9 | A | `==` ou `===`? (só JS/TS) | scene | JS: `"5" == 5` é `true`, `"5" === 5` é `false`; regra: sempre `===`. TS recusa as duas antes de rodar |
| 10 | E | Comparar textos | scene | JS/TS: `nome === "Ana"`. Java: `nome.equals("Ana")` |
| 11 | A | `==` em texto no Java (só Java) | scene | `a == b` com `new String("Ana")` dá `false`; `a.equals(b)` dá `true` |
| 12 | A | Curiosidade: ordem alfabética | scene | JS/TS: `"banana" < "maçã"` é `true`, `"Zebra" < "abelha"` é `true` (maiúscula vem antes), `"10" < "9"` é `true`. Java: `compareTo` (`<` não compila com `String`) |
| 13 | E | Contas antes da comparação | expr | `10 * 3 > 25` → `30 > 25` → `true` |
| 14 | A | Exercício: qual comparação dá `false`? | predict | Quatro linhas de comparação; a turma escolhe a que dá `false` |
| 15 | A | Curiosidade: `0.1 + 0.2 == 0.3` | scene | `false` nas três; comparar com tolerância (`Math.abs(a - b) < 0.000001`) |
| 16 | A | Curiosidade: `NaN` não é igual a nada | scene | JS/TS `NaN === NaN` é `false`, `Number.isNaN`; Java `Double.NaN == Double.NaN` é `false`, `Double.isNaN` |
| 17 | A | Curiosidade: `3 > 2 > 1` | scene | JS: `false` (`true > 1` vira `1 > 1`). TS e Java recusam antes de rodar. Gancho para a aula 4 (`&&`) |
| 18 | A | Desafio: par como verdadeiro ou falso | scene | `par = numero % 2 === 0` (Java `== 0`): 7 guarda `false`, 10 guarda `true` (retoma o `%` da aula 2) |
| 19 | E | Resumo | cards | Seis operadores, resposta booleana, `=` x `==`, textos (`===` / `equals`) |

### Diferenças por sintaxe (aula 3)

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Igual / diferente | `===` / `!==` (evitar `==` / `!=`) | `===` / `!==` | `==` / `!=` |
| `"5" == 5` | `true` (converte o texto) | erro de compilação | erro de compilação |
| Comparar textos | `===` | `===` | `equals` (`==` compara se é o mesmo objeto) |
| Ordem de textos | `<`, `>` | `<`, `>` | `compareTo` |
| `3 > 2 > 1` | `false` | erro de compilação | erro de compilação |
| `NaN` | `Number.isNaN(x)` | `Number.isNaN(x)` | `Double.isNaN(x)` |

## Aula 4: Operadores Lógicos (roteiro)

Slug: `operadores-logicos`. Exemplos: entrar no show (idade e ingresso), frete grátis (valor ou assinatura), login, faixa de nota.

- **Essencial (E):** 10 slides, cerca de 10 min.
- **Completo (E + A):** 18 slides no deck; cada sintaxe vê **17** (slide 13 só Java, slide 14 só JS/TS).

| # | Roteiro | Slide | Tipo | O que mostra |
|---|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Operadores Lógicos" | cover | |
| 2 | E | Juntar perguntas | cards | "Pode entrar no show?" `maior && temIngresso`, "Frete grátis?" `total > 200 \|\| assinante`, "Mostrar o login?" `!logado` |
| 3 | E | E (`&&`): as duas precisam ser verdade | scene + circuito | Série: as quatro combinações dos interruptores, a lâmpada só acende com os dois ligados |
| 4 | E | OU (`\|\|`): basta uma | scene + circuito | Paralelo: acende com qualquer um ligado |
| 5 | E | NÃO (`!`): inverte | scene + circuito | Inversor: `!true` é `false`, `!false` é `true` |
| 6 | E | Tabela-verdade | truth | `a`, `b`, `a && b`, `a \|\| b`, uma linha por etapa |
| 7 | A | Exercício: acenda a lâmpada | circuit | A turma liga e desliga interruptores até a expressão dar `true`; vários desafios no mesmo slide |
| 8 | E | Com os relacionais | expr | `20 >= 18 && 20 < 65` → `true && true` → `true` |
| 9 | E | Faixa de valores | scene | `nota >= 0 && nota <= 10`: a forma certa do `3 > 2 > 1` da aula 3 |
| 10 | E | Quem vem primeiro? | expr | `!` antes de `&&` antes de `\|\|`: `true \|\| false && false` → `true \|\| false` → `true` (da esquerda para a direita daria `false`) |
| 11 | A | Exercício: qual o resultado? | predict | Expressão com relacionais e lógicos; resposta `true` / `false` com a execução linha a linha |
| 12 | A | Curto-circuito | scene | `&&` para no primeiro `false`, `\|\|` no primeiro `true`: `x !== 0 && 10 / x > 2` com `x` 0 não divide por zero (retoma a aula 2). Java: `x != 0 && ...` |
| 13 | A | `&` e `\|` sem curto-circuito (só Java) | scene | `x != 0 & 10 / x > 2` com `x` 0 lança `ArithmeticException` |
| 14 | A | `\|\|` devolve um valor (só JS/TS) | scene | Valores "falsos" (`0`, `""`, `null`, `undefined`, `NaN`, `false`); `nome \|\| "Visitante"`; `??` só para `null` / `undefined` (`0 ?? 10` é `0`) |
| 15 | A | De Morgan | truth | `!(a && b)` é o mesmo que `!a \|\| !b`, conferido na tabela |
| 16 | A | Curiosidade: OU exclusivo | cards | Um ou outro, não os dois: `a !== b` (JS/TS), `a ^ b` ou `a != b` (Java); `^` não é potência (retoma a aula 2) |
| 17 | A | Desafio: ano bissexto | expr | `(ano % 4 === 0 && ano % 100 !== 0) \|\| ano % 400 === 0` com 2024 (`true`), 1900 (`false`) e 2000 (`true`) |
| 18 | E | Resumo | cards | `&&`, `\|\|`, `!`, prioridade e curto-circuito; próxima aula: condicionais |

### Diferenças por sintaxe (aula 4)

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Operandos | Qualquer valor (verdadeiro ou falso "por conversão") | Qualquer valor, com tipos | Só `boolean` (`1 && 2` não compila) |
| Resultado de `\|\|` / `&&` | Um dos operandos (`0 \|\| "x"` é `"x"`) | Um dos operandos | Sempre `boolean` |
| Sem curto-circuito | não existe para lógicos (`&` / `\|` são bit a bit) | idem | `&` e `\|` |
| OU exclusivo | `a !== b` | `a !== b` | `a ^ b` ou `a != b` |
| Valor padrão | `\|\|` e `??` | `\|\|` e `??` | (fora do escopo) |

## Componentes e tipos novos

| Item | Onde | Descrição |
|---|---|---|
| `kit-scale` | `ui/scale/` | Balança em SVG inline, nas cores do tema: pratos com os itens, operador no centro, inclinação animada (só quando os dois lados são números), resposta `true` / `false` abaixo. `prefers-reduced-motion`: sem inclinar, só troca de estado. |
| `SceneStep.compare` | `kit.data.ts` | `{ left, op, right, result }` (aceita `BySyntax`); a cena desenha a balança ao lado dos baús e do código. |
| `kit-circuit` | `ui/circuit/` | Circuito em SVG: interruptores com etiqueta, fio, lâmpada que acende com brilho. Modos `and`, `or`, `not`. |
| `SceneStep.circuit` | `kit.data.ts` | `{ mode, switches: boolean[], labels? }`; a lâmpada é calculada a partir dos interruptores (o deck não declara se acende). |
| `truth` | `slides/truth-view.ts` | Tabela-verdade: colunas de entrada e de resultado, uma linha revelada por etapa, `true` em `kit-value` e `false` em `kit-error`. |
| `circuit` (exercício) | `slides/circuit-view.ts` | Lista de desafios (`expressão` + modo); a turma alterna os interruptores por clique ou teclado; feedback "Lâmpada acesa!" com `aria-live`; botão reiniciar. Fica dentro de `data-kit-exercise`. |

- Os novos tipos entram no `Slide` (union discriminada) e no `stepCount`.
- Textos de interface dos exercícios novos (ligado/desligado, "acenda a lâmpada", acerto) vão para `kit.exercise` nos três dicionários.
- O teste de deck da aula 2 que confere as contas dos `expr` vira um utilitário compartilhado, aceitando resultados `true` / `false`.

## Ajustes na aula 2

- Notas que citam a próxima aula: o resumo passa a apontar para **operadores relacionais**; as menções a "aula de condicionais" (par ou ímpar, divisão por zero) continuam valendo.

## Catálogo e textos

| Aula | PT | EN | FR-CA | Duração |
|---|---|---|---|---|
| 3 | Operadores Relacionais | Relational Operators | Opérateurs relationnels | 10 min a 3 h |
| 4 | Operadores Lógicos | Logical Operators | Opérateurs logiques | 10 min a 3 h |

- Resumos curtos nos três idiomas; regras de copy do projeto valem (sem travessão, FR com uso canadense).
- `sitemap.xml`: `/kit/logica-de-programacao/operadores-relacionais/1` e `/kit/logica-de-programacao/operadores-logicos/1`.

## Fatos a conferir na execução

Cada saída e mensagem de erro mostrada nos slides deve ser conferida rodando o código nas três linguagens (ou no compilador), em especial:
- Mensagem do TypeScript para `"5" === 5` (TS2367) e para `3 > 2 > 1` (TS2365).
- Mensagens do `javac` para `"5" == 5`, `3 > 2 > 1` e `1 && 2` (o texto muda entre versões do JDK; usar o do JDK 21).
- `"banana".compareTo("maçã")` em Java e a ordem de textos acentuados em JS.

## Testes

- Unitários: `kit-scale` (inclina para o lado certo, nivelado na igualdade), lâmpada do `kit-circuit` nos três modos, `stepCount` dos tipos novos, exercício de circuito (acerto, reiniciar), e os testes de deck das duas aulas (paridade de sintaxes, ids únicos, notas, selos, contagem do catálogo, contas dos `expr`, respostas dos exercícios, sem travessão).
- Manual no Chrome: sequência completa com o convite entre as aulas 2 → 3 → 4, as duas aulas nos dois roteiros e nas três sintaxes, exercício de circuito com mouse e teclado, `prefers-reduced-motion`.
