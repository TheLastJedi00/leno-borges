# 007, Operadores Aritméticos, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/007-operadores-aritmeticos`.

## Fase 1, `feat/kit-proxima-aula`, passagem direta entre aulas
- [x] 1.1 `nextLesson()` em `kit.data.ts` e `RouteReuseStrategy` que recria o componente ao trocar de trilha ou aula, com testes
- [x] 1.2 Convite no `PlayerState` (`upNext`, `asking`, `next`/`prev` no fim, sincronia por `BroadcastChannel`, mensagem `lesson`), com testes
- [x] 1.3 Painel "Seguir para a próxima aula?" no player e na janela do apresentador, teclas `Enter`/`Esc` e textos `kit.player.end` nos três dicionários

## Fase 2, `feat/kit-expressoes`, slide de expressão
- [x] 2.1 Tipo `expr` em `kit.data.ts`, marcação `[[ ]]` com teste e componente `ExprView`

## Fase 3, `feat/kit-operadores`, aula Operadores Aritméticos
- [x] 3.1 Aula no catálogo, nos três dicionários e no `sitemap.xml`
- [x] 3.2 `code.ts` com os trechos em JS, TS e Java e os 10 slides essenciais
- [x] 3.3 Aprofundamentos, curiosidades e exercícios, com o teste do deck

## Encerramento
- [x] Merge das fases na branch `release/007-operadores-aritmeticos`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome

## Decisões tomadas na execução
- Cada sintaxe vê **22** slides no roteiro Completo (o deck tem 23: o slide 7 é só de Java e o 18 só de JS/TS); o context.md dizia 23 e foi corrigido
- O slide `expr` ganhou a etapa `replace` (troca a linha anterior em vez de acrescentar), para destacar o trecho na mesma linha antes de calcular
- `chest()` e os nomes de tipo por formato saíram do deck da aula 1 para `decks/chests.ts`, compartilhado entre as aulas
- O teste do deck confere as contas dos slides `expr` (cada linha vale o mesmo que a anterior) e as respostas dos exercícios
- Slide 22 em TS: `min` e `seg` usam inferência de tipo para a linha caber ao lado dos baús (dito nas notas)
- Homologação: com o código ao lado, 2 ou mais baús não cabiam na largura e empilhavam até vazar do palco, o que também afetava o slide "Troque os itens de dois baús" da aula 1. O `SceneView` agora aplica uma escala (`chestZoom`) calculada para a etapa com mais baús, numa linha ou em duas quando eles ficariam pequenos demais
- Homologação: o subtítulo da capa ficou mais estreito para não encostar no baú
- O convite foi testado com o apresentador em outra aba (o `BroadcastChannel` vale entre abas e janelas): o convite aparece nas duas e seguir por uma leva as duas para a aula 2, que continuam sincronizadas
- O que não foi homologado: palco em 375px (mesma limitação de redimensionamento das specs 005 e 006) e o painel com leitor de tela
