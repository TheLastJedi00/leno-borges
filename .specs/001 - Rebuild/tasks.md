# 001 - Rebuild — Tasks

Uma branch `feat/<fase>` por fase, um commit por task. Ao final, merge em `release/001-rebuild`.

## Fase 1 — `feat/rebuild-foundation` (fundação visual)
- [ ] 1.1 Adicionar Google Fonts (Instrument Serif, Manrope, JetBrains Mono) com `preconnect` e `lang="pt-BR"` em `src/index.html`
- [ ] 1.2 Definir tokens de cor/fonte via `@theme` em `src/styles.css` + estilos base (`body`, seleção, foco, `prefers-reduced-motion`)
- [ ] 1.3 Otimizar a foto da spec para `public/images/leno.webp` (+ `.jpg` fallback) e apontar o `Owner` para ela

## Fase 2 — `feat/rebuild-content` (dados e componentes)
- [ ] 2.1 Criar `pages/home/home.data.ts` com interfaces e dados do currículo (resumo, métricas, experiências, competências, formação, idiomas, contatos), aplicando os ajustes da tabela do `context.md`
- [ ] 2.2 Criar `shared/section-heading`
- [ ] 2.3 Reescrever `shared/experience-card` como item de linha do tempo
- [ ] 2.4 Criar `shared/skill-group` e `shared/education-item`

## Fase 3 — `feat/rebuild-home` (montagem da Home)
- [ ] 3.1 Redesenhar `Header` com navegação âncora (validar em `/bfacademy`)
- [ ] 3.2 Hero com foto em destaque e CTAs
- [ ] 3.3 Seções Sobre (com métricas) e Experiência
- [ ] 3.4 Seções Competências, Formação e Idiomas
- [ ] 3.5 Contato/Footer e restyle do `Links` (validar em `/bfacademy`)

## Fase 4 — `feat/rebuild-quality` (qualidade)
- [ ] 4.1 Corrigir `app.spec.ts` e adicionar spec da Home
- [ ] 4.2 Revisão de responsividade (375/768/1440) e acessibilidade (contraste, alt, foco, headings)
- [ ] 4.3 Atualizar `CLAUDE.md` (dados em `home.data.ts`, tokens de tema, novos componentes)

## Encerramento
- [ ] Merge das fases em `release/001-rebuild`
- [ ] `npm run build` e `npm test` passando
- [ ] Subir em `localhost:4200` e testar no Chrome: Home completa + regressão em `/bfacademy`
