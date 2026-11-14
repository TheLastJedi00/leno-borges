# 008, Operadores Relacionais e Lógicos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/008-operadores-relacionais-e-logicos`, criada a partir da `main` depois do merge do PR #10 (spec 007).

## Fase 1, `feat/kit-balanca`, ilustração da aula 3
- [x] 1.1 Componente `kit-scale` (pratos, operador, inclinação animada, resposta `true`/`false`, `prefers-reduced-motion`), com testes
- [x] 1.2 `SceneStep.compare` e a balança na `SceneView`, ao lado de baús e código

## Fase 2, `feat/kit-relacionais`, aula Operadores Relacionais
- [x] 2.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; nota de próxima aula no resumo da aula 2
- [x] 2.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 2.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck (utilitário compartilhado de contas `expr`)
- [x] 2.4 Conferir cada saída e mensagem de erro nas três linguagens

## Fase 3, `feat/kit-circuito`, ilustração e slides da aula 4
- [x] 3.1 Componente `kit-circuit` (série, paralelo, inversor, lâmpada) e `SceneStep.circuit`, com testes
- [x] 3.2 Slide `truth` (tabela-verdade revelada por etapa)
- [x] 3.3 Exercício `circuit` (interruptores por clique e teclado, feedback, reiniciar) e textos em `kit.exercise` nos três dicionários

## Fase 4, `feat/kit-logicos`, aula Operadores Lógicos
- [x] 4.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [x] 4.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 4.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [x] 4.4 Conferir cada saída e mensagem de erro nas três linguagens

## Encerramento
- [x] Merge das fases na branch `release/008-operadores-relacionais-e-logicos`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: sequência 2 → 3 → 4 pelo convite, as duas aulas nos dois roteiros e nas três sintaxes, exercícios, `prefers-reduced-motion`

## Decisões tomadas na execução
- **Java não foi executado**: não há JDK na máquina. JS foi conferido rodando cada trecho, TS compilando cada trecho no `tsc` 5.9 (`--strict`), e as saídas e mensagens do Java seguem o comportamento documentado (mensagens do `javac` do JDK 9 ou mais novo). Vale rodar os trechos de Java uma vez antes de dar a aula
- **TS: `NaN === NaN` não compila** (TS2845, "This condition will always return 'false'"). A spec dizia que imprime `false` nas três; o slide 16 da aula 3 mostra o erro em TS
- O teste de cada deck agora roda os trechos em JS e compara o que imprimem com a saída do slide (`jsOutputProblems`), e confere as tabelas-verdade calculando cada coluna (`truthProblems`). As conferências comuns saíram dos testes das aulas para `decks/deck-checks.ts`, funções puras que o teste da aula 2 também usa
- A balança só inclina quando responde (`result` definido): enquanto a turma palpita, fica nivelada
- Na conta passo a passo, um resultado `false` aparece em vermelho
- Aula 3, slide 4 ("Os seis operadores") virou **cards** em vez de tabela: seis linhas mais o cabeçalho não cabiam no palco, e os cards entram um por etapa
- Aula 4, slide 9 ("Faixa de valores") e slide 17 ("Ano bissexto") são cenas com código e saída, não `expr`: as expressões eram longas demais para a fonte grande da conta passo a passo. O bissexto mostra 2024 e cita 1900 e 2000 na legenda e nas notas
- Aula 4, slide 2: os exemplos ficaram "Pode dirigir?" (`maior && cnh`), "Frete grátis?" (`vip || cupom`) e "Mostrar Entrar?" (`!logado`), para os nomes caberem nos cards; o circuito usa as mesmas etiquetas
- TS usa inferência de tipo em duas linhas para caberem ao lado da ilustração (`perto` na aula 3, `bissexto` na aula 4), dito nas notas
- `a !== b` como OU exclusivo só aparece num card: com `let a = true` e `let b = false`, o TS estreita os tipos e recusa a comparação (TS2367), então o slide não mostra código rodável
- Homologação: a JetBrains Mono juntava `>=`, `===`, `!=` e `&&` em um símbolo só (ligaduras). O palco do kit e os componentes com `font:` desligam as ligaduras, para a turma ver os caracteres que vai digitar. Vale para as quatro aulas
- Homologação: no exercício de prever, com quatro baús a segunda fileira passava da borda do palco; a escala agora é calculada para os baús caberem numa linha (máximo 0,7, como antes)
- Homologação: balança e circuito ficam maiores quando não há código ao lado; o ramo de cima do OU descia sobre o título da expressão e foi rebaixado
- Homologado no Chrome: sequência 2 → 3 → 4 pelo convite (Enter e PageDown), balança nos três estados, circuito nos três modos, tabela-verdade, exercício de circuito com clique e teclado, slides exclusivos de Java e de JS/TS e os slides mais cheios das duas aulas
- O que não foi homologado: `prefers-reduced-motion`, palco em 375px (mesma limitação das specs anteriores) e leitor de tela
