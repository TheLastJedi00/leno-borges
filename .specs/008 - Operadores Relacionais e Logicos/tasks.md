# 008, Operadores Relacionais e Lógicos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/008-operadores-relacionais-e-logicos`, criada a partir da `main` depois do merge do PR #10 (spec 007).

## Fase 1, `feat/kit-balanca`, ilustração da aula 3
- [ ] 1.1 Componente `kit-scale` (pratos, operador, inclinação animada, resposta `true`/`false`, `prefers-reduced-motion`), com testes
- [ ] 1.2 `SceneStep.compare` e a balança na `SceneView`, ao lado de baús e código

## Fase 2, `feat/kit-relacionais`, aula Operadores Relacionais
- [ ] 2.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`; nota de próxima aula no resumo da aula 2
- [ ] 2.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 2.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck (utilitário compartilhado de contas `expr`)
- [ ] 2.4 Conferir cada saída e mensagem de erro nas três linguagens

## Fase 3, `feat/kit-circuito`, ilustração e slides da aula 4
- [ ] 3.1 Componente `kit-circuit` (série, paralelo, inversor, lâmpada) e `SceneStep.circuit`, com testes
- [ ] 3.2 Slide `truth` (tabela-verdade revelada por etapa)
- [ ] 3.3 Exercício `circuit` (interruptores por clique e teclado, feedback, reiniciar) e textos em `kit.exercise` nos três dicionários

## Fase 4, `feat/kit-logicos`, aula Operadores Lógicos
- [ ] 4.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [ ] 4.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 4.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck
- [ ] 4.4 Conferir cada saída e mensagem de erro nas três linguagens

## Encerramento
- [ ] Merge das fases na branch `release/008-operadores-relacionais-e-logicos`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome: sequência 2 → 3 → 4 pelo convite, as duas aulas nos dois roteiros e nas três sintaxes, exercícios, `prefers-reduced-motion`
