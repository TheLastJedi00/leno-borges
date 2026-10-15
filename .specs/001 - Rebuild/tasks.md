# 001, Rebuild, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/001-rebuild`.

## Fase 1, `feat/rebuild-foundation`, fundação visual
- [x] 1.1 Adicionar Google Fonts (Instrument Serif, Manrope, JetBrains Mono) com `preconnect` e `lang="pt-BR"` em `src/index.html`
- [x] 1.2 Definir tokens de cor e fonte via `@theme` em `src/styles.css` e estilos base (`body`, seleção, foco, `prefers-reduced-motion`)
- [x] 1.3 Otimizar a foto da spec para `public/images/leno.webp`, com fallback `.jpg`, peso abaixo de 200 KB, sem moldura circular e com gradiente sutil na base, apontando o `Owner` para ela
- [x] 1.4 Remover a classe inexistente `gradient-text` dos templates da Home, preservando a regra intacta em `/bfacademy`

## Fase 2, `feat/rebuild-content`, dados e componentes
- [x] 2.1 Criar `pages/home/home.data.ts` com interfaces e dados do currículo (resumo, métricas, experiências, competências, formação, idiomas, contatos), aplicando os ajustes da tabela de alinhamento do `context.md`
- [x] 2.2 Criar o componente `shared/section-heading`, número e título editorial de seção
- [x] 2.3 Reescrever `shared/experience-card` como item de linha do tempo vertical, contemplando suporte a link para `/bfacademy` no case correspondente
- [x] 2.4 Criar `shared/skill-group` e `shared/education-item`

## Fase 3, `feat/rebuild-home`, montagem da Home
- [x] 3.1 Redesenhar `Header` com navegação por âncoras e fundo escuro ao rolar (validar em `/bfacademy`)
- [x] 3.2 Implementar Hero com foto em destaque, hierarquia semântica de `h1` único, localização e botões de CTA ("Ver experiência ↓" e "Case BF Academy")
- [x] 3.3 Construir seções Sobre (com métricas de destaque) e Experiência em linha do tempo vertical
- [x] 3.4 Construir seções Competências, Formação e Idiomas
- [x] 3.5 Implementar seção Contato, Footer completo com WhatsApp e restyle do componente `Links` (validar em `/bfacademy`)

## Fase 4, `feat/rebuild-quality`, qualidade e validações
- [x] 4.1 ~~Spec da Home~~, tarefa removida, visto que sem backend não há TDD, com validação via testes no Chrome (`app.spec.ts` já corrigido no baseline)
- [x] 4.2 Revisão de responsividade nos breakpoints 375px, 768px e 1440px, sem scroll horizontal e com empilhamento correto da foto no mobile
- [x] 4.3 Revisão de acessibilidade, incluindo contraste mínimo AA, texto alternativo descritivo na foto, anel de foco no acento e conformidade com `prefers-reduced-motion`
- [x] 4.4 Validação visual cruzada e verificação de não-regressão na página `/bfacademy`, assegurando integridade com o novo `Header` e `Links`
- [x] 4.5 Atualizar `CLAUDE.md`, documentando os dados em `home.data.ts`, tokens de tema do Tailwind v4 e novos componentes compartilhados

## Encerramento
- [x] Merge das fases na branch `release/001-rebuild`
- [x] Validação dos comandos `npm run build` e `npm test`, garantindo execução com zero falhas
- [x] Subir a aplicação em `localhost:4200` e homologar no Chrome, testando a Home completa e a rota `/bfacademy`
