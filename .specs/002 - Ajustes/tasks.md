# 002, Ajustes, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/002-ajustes`.

## Fase 1, `feat/ajustes-cleanup`, remoção do case BF Academy
- [x] 1.1 Remover `pages/bfacademy/`, import e rota em `app.routes.ts`; adicionar redirect `bfacademy` → `''` e fallback `**` → `''`
- [x] 1.2 Remover o CTA "Case BF Academy" do Hero, o `caseLink` da experiência BF Academy e o suporte a `caseLink` em `ExperienceCard` e na interface `Experience`

## Fase 2, `feat/ajustes-identity`, nova identidade visual
- [x] 2.1 Trocar fontes em `src/index.html` (Outfit, DM Sans, JetBrains Mono) e atualizar `theme-color`
- [x] 2.2 Redefinir tokens em `src/styles.css`: paleta grafite + azul da logo, novo token `raised`, sombras `--shadow-raised`/`--shadow-inset` e fontes
- [x] 2.3 Copiar `logo.svg` para `public/images/`, usá-la no `Header` e como favicon SVG (fallback `favicon.ico`), removendo as imagens do imgur
- [x] 2.4 Restyle de `Header`, `Links` e `Owner` (foto com cantos arredondados)
- [x] 2.5 Instalar `simple-icons`, criar o registro `tech-icons.ts` e o componente `shared/tech-icon` (monocromático, cor da marca no hover, chip só de texto para conceitos)
- [x] 2.6 Restyle de `section-heading`, `experience-card`, `skill-group`, `education-item` e das seções da Home com cards neomórficos leves, sem itálicos serifados, usando `tech-icon` em Skills e nas tags da timeline

## Fase 3, `feat/ajustes-i18n`, internacionalização
- [x] 3.1 Criar `src/app/i18n/` com o serviço `I18n` (signal `lang`, `t` computado, `setLang`, persistência em `localStorage` com `try/catch`, padrão `en`) e a interface `Dictionary`
- [x] 3.2 Criar `pt.ts` (conteúdo atual) e mover os textos de `home.data.ts` para os dicionários, mantendo lá só dados neutros de idioma; localização "Barrie & GTA, Canadá · Blumenau, SC, Brasil"
- [x] 3.3 Criar `en.ts` (inglês canadense) aplicando a tabela de palavras-chave de Barrie/GTA, sem fatos novos
- [x] 3.4 Criar `fr.ts` (francês do Canadá: `courriel`, `infonuagique`…) aplicando a mesma tabela; sinalizar no PR que o texto precisa de revisão humana
- [x] 3.5 Ligar Home e componentes compartilhados a `i18n.t()` (incluindo `alt`, `aria-label`, `sr-only`, legenda da foto, footer e texto do WhatsApp); renomear âncoras para `about`, `experience`, `skills`, `education` e `contact`
- [x] 3.6 Toggle segmentado `EN | FR | PT` no `Header` (desktop e mobile) com estado ativo e `aria-pressed`
- [x] 3.7 Sincronizar `<html lang>` (`en`/`fr-CA`/`pt-BR`), `Title` e `Meta` description com o idioma, incluindo palavras-chave e "Barrie & GTA, Ontario"; `index.html` com `lang="en"` e textos padrão em inglês

## Fase 4, `feat/ajustes-quality`, qualidade e validações
- [x] 4.1 Revisão de responsividade em 375px, 768px e 1440px nos três idiomas (francês costuma ser o texto mais longo)
- [x] 4.2 Revisão de acessibilidade: contraste AA da nova paleta, foco visível em azul, `prefers-reduced-motion`
- [x] 4.3 Varredura por restos: âmbar/laranja, `Instrument Serif`, `Manrope`, `gradient-text`, imgur, `Bfacademy`, strings de idioma fora dos dicionários, ícones carregados de rede
- [x] 4.4 Atualizar `CLAUDE.md` (rotas, i18n em 3 idiomas, `tech-icon`/`simple-icons`, tokens, fontes, remoção de `Bfacademy`)

## Encerramento
- [x] Merge das fases na branch `release/002-ajustes`
- [x] `npm run build` e `npm test` sem falhas
- [x] Subir em `localhost:4200` e homologar no Chrome: primeira visita em EN, troca para FR e PT, persistência após reload, `lang`/title/meta, redirect de `/bfacademy`, logos na stack e visual nos 3 breakpoints

## Decisões tomadas na execução
- `--color-faint` ficou `#8e8e93` (o `#737373` da logo dá ~3,6:1 sobre `ink`, abaixo do AA)
- Novo token `--color-accent-deep` (`#2563d9`) para botões com texto branco (branco sobre `#3986ff` dá ~3,5:1)
- Rótulos pequenos em `accent-soft`: `accent` fica exatamente no limite de 4,5:1 sobre `surface`
- Tags de stack ficam nos dicionários (não em `home.data.ts`): algumas são traduzíveis ("IA Generativa", "POO")
- Java usa o ícone `siOpenjdk` (o `simple-icons` não tem `siJava`); Angular usa o vermelho clássico `#dd0031` no hover; marcas quase pretas usam `paper` no hover
- Seletor de idioma usa `title` em vez de `aria-label` (WCAG 2.5.3, nome acessível contém o texto visível "PT")
- Telefone exibido no formato internacional `+55 (47) 99247-8232`
- "REST APIs" adicionado ao grupo de Arquitetura (fato do currículo: "comandos via REST API") e skills reordenadas por relevância no mercado de Barrie/GTA
- "Multiplano" (Tichr) traduzido como "multi-plan" / "multiforfait" — **confirmar o sentido**
- Texto em francês precisa de revisão de um falante nativo antes de publicar
- 4.3 sem alterações: varredura limpa (só o redirect intencional de `bfacademy`); únicos recursos externos são as Google Fonts
- Porta 4200 estava ocupada por outro projeto local; homologação feita em `localhost:4201`
