# 006, Kit de Ensino, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/006-kit-de-ensino`.

## Fase 1, `feat/kit-base`, dados, rotas e textos
- [x] 1.1 Criar `src/app/kit/kit.data.ts` com `Syntax`, `Track`, `Lesson`, `Deck`, `Slide` (union discriminada por `kind`, com `depth`, `syntaxes?`, `steps`, `notes: string[]`) e o catálogo com a trilha Lógica de Programação e a aula Variáveis e Tipos (`load` lazy)
- [x] 1.2 Adicionar a chave `kit` ao `Dictionary` e aos dicionários `en`, `fr` e `pt` (botão do card, catálogo, títulos e resumos de trilha e aula, controles e atalhos do player, roteiros, `aria-label`, aviso "conteúdo em português", janela do apresentador, mensagens dos exercícios)
- [x] 1.3 Registrar as rotas `/kit`, `/kit/:trilha/:aula/apresentador`, `/kit/:trilha/:aula` e `/kit/:trilha/:aula/:slide` com `loadComponent`, antes do `**`, com redirecionamento de slug e slide inválidos
- [x] 1.4 Título e `meta description` por rota com fallback para a home (ajustar o `effect` do `I18n`), mais `public/sitemap.xml` e `public/robots.txt`

## Fase 2, `feat/kit-catalogo`, catálogo e card da ProWay
- [x] 2.1 Criar a página de catálogo `/kit` (header do site, introdução, seção por trilha, card da aula com faixa de duração, contagem por roteiro, chips de sintaxe, seletores de sintaxe e roteiro, botão "Apresentar" e aviso de idioma em EN/FR)
- [x] 2.2 Adicionar `kitPath?` em `Experience`, a constante `kitPaths` em `home.data.ts` e o botão interno "Kit de ensino →" no `ExperienceCard` (`routerLink`, mesma aba)
- [x] 2.3 Ligar `kitPath: kitPaths.root` no item ProWay nos três dicionários

## Fase 3, `feat/kit-player`, player de slides
- [x] 3.1 Criar o serviço de estado do player (slide, etapa, sintaxe, roteiro em signals; filtro de slides por roteiro e sintaxe; sincronia com URL e `localStorage`; posição ao trocar de roteiro), com testes unitários
- [x] 3.2 Criar o palco 16:9 escalado, a barra inferior com auto-ocultar, a barra de progresso, o selo de aprofundamento e a transição entre slides (com `prefers-reduced-motion`)
- [x] 3.3 Navegação por teclado, clique e swipe (setas, espaço, PageUp/Down, Home/End, `F`, `N`, `R`, `1/2/3`, `Esc`), ignorando teclas com foco em exercício
- [x] 3.4 Janela do apresentador (slide atual, próximo, tópicos, cronômetro, controles) sincronizada por `BroadcastChannel`
- [x] 3.5 Acessibilidade do player: `aria-roledescription`, rótulo "Slide N de M", `aria-live` na troca, foco visível

## Fase 4, `feat/kit-ui`, ilustrações e blocos reutilizáveis
- [x] 4.1 Componentes SVG `kit-chest` (tampa que abre, cadeado, endereço, formatos por tipo), `kit-label` e `kit-item`, animados por etapa e nas cores do tema
- [x] 4.2 Componente de código com tokens por papel (`keyword`, `type`, `name`, `value`...), cores ligadas à metáfora e destaque sincronizado com a ilustração
- [x] 4.3 Componentes de exercício: classificar itens em baús (arrastar e soltar com alternativa por clique e teclado) e prever o valor final, com feedback, `aria-live` e botão reiniciar

## Fase 5, `feat/kit-variaveis`, aula Variáveis e Tipos de Dados
- [x] 5.1 Escrever `deck.pt.ts` com os 10 slides essenciais (1, 2, 4, 5, 7, 9, 13, 14, 22, 26), etapas e tópicos de fala
- [x] 5.2 Escrever `code.ts` com os trechos em JS, TS e Java de todos os slides de código, com teste de paridade entre sintaxes
- [x] 5.3 Adicionar os aprofundamentos (3, 6, 8, 10, 11, 12, 15, 16, 23, 24, 25) com etapas e tópicos
- [x] 5.4 Adicionar as curiosidades (17, 18, 19, 20 só JS/TS, 21 só Java) e conferir cada fato nas três linguagens

## Encerramento
- [x] Merge das fases na branch `release/006-kit-de-ensino`
- [x] `npm run build` e `npm test` sem falhas; conferir que o bundle inicial da home não cresceu além do botão
- [x] Subir em `localhost:4200` e homologar no Chrome: botão no card da ProWay nos 3 idiomas, catálogo, aula nos roteiros Essencial e Completo nas três sintaxes, link direto para slide com `?sintaxe=` e `?roteiro=`, teclado, tela cheia, janela do apresentador sincronizada, exercícios com mouse e teclado, `prefers-reduced-motion`, palco em 375px

## Decisões tomadas na execução
- O documento da spec é commitado na `release/006-kit-de-ensino` antes das fases, e cada `feat/` sai dela
- `/kit/:trilha/:aula` redireciona para `/kit/:trilha/:aula/1`: uma só configuração de rota para o player, assim trocar de slide reaproveita o componente (o sitemap aponta para `/1`)
- Os trechos de código usam marcação curta escrita à mão (`{k:let} {n:idade} = {v:25};`) em vez de arrays de tokens; o papel do token define a cor e liga o código ao baú
- Cores novas da metáfora em `@theme`: `kit-name` (etiqueta, âmbar), `kit-value` (item, verde), `kit-keyword` (palavra-chave, lilás) e `kit-error`; o tipo/baú usa o `accent` do site
- `chests`, `highlight`, `activeLine` e `outputTone` das etapas aceitam valor por sintaxe (o mesmo slide mostra JS aceitando e TS/Java recusando, por exemplo)
- Cada slide tem `id` estável, usado para manter a posição ao trocar roteiro ou sintaxe e para sincronizar as janelas
- Em JS o baú também mostra o nome do tipo (o que `typeof` responde); a diferença de tipagem dinâmica fica no slide 16
- Dentro de exercício, PageUp/PageDown continuam navegando (passadores de slide enviam essas teclas); as demais teclas ficam com o exercício
- A janela do apresentador abre em modo "seguir": não publica o próprio estado inicial, espera a janela da turma responder ou o apresentador navegar
- Roteiro essencial tem **10** slides (o context.md dizia 9 por erro de contagem; corrigido)
- O aviso "conteúdo em português" na barra do player virou um selo `PT` com o texto em `title` e `sr-only`, para a barra não quebrar em duas linhas
- Bundle inicial: 350,98 kB → 385,68 kB brutos (94,87 → 104,02 kB transferidos). Nenhum componente do kit entra no inicial; o acréscimo vem dos textos do kit nos três dicionários e do suporte a rotas lazy e `animate.enter`
- O redimensionamento da janela do Chrome para 390px não pegou na homologação (viewport ficou em 2048px), como na spec 005. O palco escala por largura e a barra usa `flex-wrap`; **conferir no celular**
