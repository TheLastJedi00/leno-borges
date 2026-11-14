# 007, Operadores Aritméticos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/007-operadores-aritmeticos`.

## Fase 1, `feat/kit-proxima-aula`, passagem direta entre aulas
- [ ] 1.1 `nextLesson()` em `kit.data.ts` e `RouteReuseStrategy` que recria o componente ao trocar de trilha ou aula, com testes
- [ ] 1.2 Convite no `PlayerState` (`upNext`, `asking`, `next`/`prev` no fim, sincronia por `BroadcastChannel`, mensagem `lesson`), com testes
- [ ] 1.3 Painel "Seguir para a próxima aula?" no player e na janela do apresentador, teclas `Enter`/`Esc` e textos `kit.player.end` nos três dicionários

## Fase 2, `feat/kit-expressoes`, slide de expressão
- [ ] 2.1 Tipo `expr` em `kit.data.ts`, marcação `[[ ]]` com teste e componente `ExprView`

## Fase 3, `feat/kit-operadores`, aula Operadores Aritméticos
- [ ] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [ ] 3.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [ ] 3.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck

## Encerramento
- [ ] Merge das fases na branch `release/007-operadores-aritmeticos`
- [ ] `npm run build` e `npm test` sem falhas
- [ ] Subir em `localhost:4200` e homologar no Chrome
