# 006, Kit de Ensino, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/006-kit-de-ensino`.

## Fase 1, `feat/kit-base`, dados, rotas e textos
- [ ] 1.1 Criar `src/app/kit/kit.data.ts` com `Syntax`, `Track`, `Lesson`, `Deck`, `Slide` (union discriminada por `kind`, com `depth`, `syntaxes?`, `steps`, `notes: string[]`) e o catálogo com a trilha Lógica de Programação e a aula Variáveis e Tipos (`load` lazy)
- [ ] 1.2 Adicionar a chave `kit` ao `Dictionary` e aos dicionários `en`, `fr` e `pt` (botão do card, catálogo, títulos e resumos de trilha e aula, controles e atalhos do player, roteiros, `aria-label`, aviso "conteúdo em português", janela do apresentador, mensagens dos exercícios)
- [ ] 1.3 Registrar as rotas `/kit`, `/kit/:trilha/:aula/apresentador`, `/kit/:trilha/:aula` e `/kit/:trilha/:aula/:slide` com `loadComponent`, antes do `**`, com redirecionamento de slug e slide inválidos
- [ ] 1.4 Título e `meta description` por rota com fallback para a home (ajustar o `effect` do `I18n`), mais `public/sitemap.xml` e `public/robots.txt`

## Fase 2, `feat/kit-catalogo`, catálogo e card da ProWay
- [ ] 2.1 Criar a página de catálogo `/kit` (header do site, introdução, seção por trilha, card da aula com faixa de duração, contagem por roteiro, chips de sintaxe, seletores de sintaxe e roteiro, botão "Apresentar" e aviso de idioma em EN/FR)
- [ ] 2.2 Adicionar `kitPath?` em `Experience`, a constante `kitPaths` em `home.data.ts` e o botão interno "Kit de ensino →" no `ExperienceCard` (`routerLink`, mesma aba)
- [ ] 2.3 Ligar `kitPath: kitPaths.root` no item ProWay nos três dicionários

## Fase 3, `feat/kit-player`, player de slides
- [ ] 3.1 Criar o serviço de estado do player (slide, etapa, sintaxe, roteiro em signals; filtro de slides por roteiro e sintaxe; sincronia com URL e `localStorage`; posição ao trocar de roteiro), com testes unitários
- [ ] 3.2 Criar o palco 16:9 escalado, a barra inferior com auto-ocultar, a barra de progresso, o selo de aprofundamento e a transição entre slides (com `prefers-reduced-motion`)
- [ ] 3.3 Navegação por teclado, clique e swipe (setas, espaço, PageUp/Down, Home/End, `F`, `N`, `R`, `1/2/3`, `Esc`), ignorando teclas com foco em exercício
- [ ] 3.4 Janela do apresentador (slide atual, próximo, tópicos, cronômetro, controles) sincronizada por `BroadcastChannel`
- [ ] 3.5 Acessibilidade do player: `aria-roledescription`, rótulo "Slide N de M", `aria-live` na troca, foco visível

## Fase 4, `feat/kit-ui`, ilustrações e blocos reutilizáveis
- [ ] 4.1 Componentes SVG `kit-chest` (tampa que abre, cadeado, endereço, formatos por tipo), `kit-label` e `kit-item`, animados por etapa e nas cores do tema
- [ ] 4.2 Componente de código com tokens por papel (`keyword`, `type`, `name`, `value`...), cores ligadas à metáfora e destaque sincronizado com a ilustração
- [ ] 4.3 Componentes de exercício: classificar itens em baús (arrastar e soltar com alternativa por clique e teclado) e prever o valor final, com feedback, `aria-live` e botão reiniciar

## Fase 5, `feat/kit-variaveis`, aula Variáveis e Tipos de Dados
- [ ] 5.1 Escrever `deck.pt.ts` com os 10 slides essenciais (1, 2, 4, 5, 7, 9, 13, 14, 22, 26), etapas e tópicos de fala
- [ ] 5.2 Escrever `code.ts` com os trechos em JS, TS e Java de todos os slides de código, com teste de paridade entre sintaxes
- [ ] 5.3 Adicionar os aprofundamentos (3, 6, 8, 10, 11, 12, 15, 16, 23, 24, 25) com etapas e tópicos
- [ ] 5.4 Adicionar as curiosidades (17, 18, 19, 20 só JS/TS, 21 só Java) e conferir cada fato nas três linguagens

## Encerramento
- [ ] Merge das fases na branch `release/006-kit-de-ensino`
- [ ] `npm run build` e `npm test` sem falhas; conferir que o bundle inicial da home não cresceu além do botão
- [ ] Subir em `localhost:4200` e homologar no Chrome: botão no card da ProWay nos 3 idiomas, catálogo, aula nos roteiros Essencial e Completo nas três sintaxes, link direto para slide com `?sintaxe=` e `?roteiro=`, teclado, tela cheia, janela do apresentador sincronizada, exercícios com mouse e teclado, `prefers-reduced-motion`, palco em 375px

## Decisões tomadas na execução
