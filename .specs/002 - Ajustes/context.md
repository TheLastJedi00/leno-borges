# 002 - Ajustes — i18n (EN/FR-CA/PT), nova identidade visual, stack com logos e remoção do case BF Academy

## Objetivo

Tornar o portfólio **trilíngue — inglês (principal), francês do Canadá e português** — com foco no mercado de **Barrie e GTA (Ontário, Canadá)**, substituir a identidade editorial (serifada + âmbar) por uma identidade **moderna, sólida e levemente neomórfica** baseada nas cores da logo (`logo.svg`, nesta pasta), exibir a **stack com logos das tecnologias** e **remover a página dedicada ao estudo de caso da BF Academy** (`/bfacademy`).

## Escopo

### Dentro
- Internacionalização EN (padrão) + FR-CA + PT-BR de **todo** texto visível: Home, `Header`, `Links` (rótulos `sr-only`), `Owner` (alt e legenda), footer, `<title>`, `meta description` e `lang` do `<html>`.
- Nova paleta, tipografia e estilo de superfícies em `src/styles.css` e `src/index.html`.
- Restyle dos componentes compartilhados (`header`, `links`, `owner`, `experience-card`, `section-heading`, `skill-group`, `education-item`) e da Home.
- Logo nova (`logo.svg`) no header e como favicon, substituindo as imagens do imgur.
- Remoção da página `Bfacademy`, da rota e de todas as referências.
- Logos das tecnologias na seção Skills e nas tags de stack da timeline.
- Localização exibida: **Barrie & GTA, Canadá · Blumenau, SC, Brasil**, em todos os idiomas.
- Copy em EN/FR otimizado com palavras-chave do mercado de Barrie/GTA (ver seção própria).

### Fora
- Mudança de conteúdo/fatos: o `resume.md` da spec 001 continua sendo a fonte de verdade. As versões em inglês e francês são **traduções fiéis**, sem fatos novos — exceto a localização, definida nesta spec.
- Tema claro / toggle de tema.
- Rotas por idioma (`/en`, `/pt`), SSR/prerender, backend, deploy.

## Internacionalização

- **Abordagem:** runtime, sem dependências. Um build só; a troca de idioma é instantânea, sem reload.
- **Idiomas:** `en` (padrão), `fr` (francês do Canadá, `fr-CA`) e `pt` (`pt-BR`).
- **Estrutura** em `src/app/i18n/`:
  - `i18n.ts` — serviço `I18n` (`providedIn: 'root'`) com `lang = signal<Lang>()`, `t = computed(() => dictionaries[lang()])` e `setLang(lang)`.
  - `en.ts`, `fr.ts` e `pt.ts` — dicionários tipados pela mesma interface `Dictionary`; o TypeScript garante paridade de chaves entre os três idiomas (chave faltando = erro de build).
- **Dados da Home:** `home.data.ts` mantém as interfaces e os dados neutros de idioma (stack/techs, `href`s de contato, e-mail, telefone). Textos traduzíveis (resumo, métricas, cargos, bullets, períodos, categorias de competências, formação, idiomas, rótulos) passam para os dicionários. Os componentes leem via `i18n.t()`.
- **Idioma inicial:** valor salvo em `localStorage` (`lang`); sem valor salvo → **`en`**, independente do idioma do navegador (prioridade ao inglês). Acesso ao `localStorage` protegido com `try/catch`.
- **Seletor:** toggle segmentado `EN | FR | PT` no `Header` (desktop e mobile), com `aria-pressed`/`aria-label` e estado ativo destacado.
- **Efeitos colaterais da troca:** atualizar `document.documentElement.lang` (`en` / `fr-CA` / `pt-BR`), `Title` e `Meta` (`description`) via serviços do Angular. `index.html` passa a ter `lang="en"` e title/description em inglês como padrão.
- **Âncoras de seção** ficam em inglês e neutras de idioma: `#about`, `#experience`, `#skills`, `#education`, `#contact`.
- **WhatsApp:** texto pré-preenchido do link traduzido por idioma.
- **Francês do Canadá:** usar vocabulário canadense, não o da França: `courriel` (não `e-mail`), `infonuagique` ao lado de `cloud`, `développeur logiciel full stack`, `compétences`, `formation`, `me joindre`. Pontuação francesa (espaço antes de `:` e `?`). Revisão humana do texto antes do merge.
- **Inglês:** ortografia canadense quando houver diferença (`centre`, `colour`); termos de mercado em vez de traduções literais (ex.: "Tech Educator", não "Technology Teacher").

## Palavras-chave de mercado (Barrie / GTA)

Pesquisa em vagas de Toronto/GTA e Barrie (Glassdoor, Indeed, Built In Toronto, Talent.com, Robert Half — out/2026) mostra como recorrentes: **TypeScript**, **REST APIs**, **Node.js**, **Java**, **Angular**, **cloud**, **Docker**, **PostgreSQL**, **CI/CD**, **Agile**, **API integration** (Barrie: integração de sistemas via APIs e middleware) e **IA generativa / LLMs** (bancos de Toronto pedem IA para produtividade). React, Python e AWS aparecem com frequência, mas **não** estão no currículo e **não** serão adicionados.

Regras de aplicação no copy EN/FR (sem inventar fatos):

| Fato do currículo | Termo de mercado (EN / FR) |
|---|---|
| Software Developer Fullstack | Full-Stack Software Developer / Développeur logiciel full stack |
| Integração via REST API | REST APIs, API integration / API REST, intégration d'API |
| Integração de IA, LLMs, Gemini | Generative AI, LLM integration / IA générative, intégration de LLM |
| FinOps, Serverless | Cloud cost optimization (FinOps), serverless / Optimisation des coûts infonuagiques (FinOps), sans serveur |
| GCP, Firebase, Docker, CI/CD | Cloud-native, GCP, Docker, CI/CD pipelines / Infonuagique (GCP), Docker, pipelines CI/CD |
| Mentoria e instrutoria | Technical mentoring, developer training / Mentorat technique, formation de développeurs |
| "Entrega ágil de código" | Agile delivery / Livraison agile — **sem** citar Scrum (não consta no currículo) |

- `<title>` e `meta description` em EN/FR incluem cargo + stack principal + "Barrie & GTA, Ontario".
- Ordem de destaque na Home: TypeScript, Angular, Node.js/NestJS, Java/Spring Boot, REST APIs, PostgreSQL, Docker, CI/CD, GCP, IA generativa.

## Stack com logos

- **Fonte dos ícones:** pacote npm `simple-icons` (CC0), importando ícone a ícone (`import { siAngular } from 'simple-icons'`) para tree-shaking. Sem CDN, sem imagens externas.
- **Registro** em `src/app/shared/tech-icon/tech-icons.ts`: mapa `nome da tech → ícone` (ex.: `Angular → siAngular`, `TypeScript`, `JavaScript`, `Java → siOpenjdk`, `Spring Boot`, `NestJS`, `Node.js`, `RxJS → siReactivex`, `PostgreSQL`, `MySQL`, `Firebase`, `Firestore → siFirebase`, `GCP → siGooglecloud`, `Vercel`, `Docker`, `Git`, `GitHub`, `Gemini`/`AI Studio → siGooglegemini`, `JWT → siJsonwebtokens`). Validar na instalação se cada ícone existe na versão do pacote. Se algum faltar, usar o SVG oficial da marca em `public/icons/`.
- **Componente** `shared/tech-icon` (`input.required<string>()` com o nome): renderiza o `<svg>` com o `path` do ícone e `aria-hidden="true"`. O nome continua como texto visível ao lado (acessível e indexável).
- **Conceitos sem logo** (Clean Architecture, SOLID, CQRS, Design Patterns, Serverless, CI/CD, Signals, LLMs, FinOps, POO) aparecem como chip só de texto, no mesmo estilo.
- **Estilo:** ícones monocromáticos (`currentColor`, tom `muted`); no hover do chip, assumem a cor oficial da marca (`hex` do simple-icons). Mantém o visual sóbrio.
- **Onde:** seção Skills (chips com logo por categoria) e tags de stack de cada item da timeline.
- Nomes de marca **não** são traduzidos; categorias e conceitos (ex.: "Integração de LLMs") ficam nos dicionários.

## Direção visual — Moderno sólido, levemente neomórfico

### Paleta (derivada da logo)

A logo é um monograma azul em gradiente (`#488FFF` → `#3986FF`) com sombras internas e dobras em cinza (`#383838`, `#494949`, `#737373`). A paleta segue isso: **base grafite neutra + um único acento azul**.

| Token | Valor sugerido | Uso |
|---|---|---|
| `--color-ink` | `#1c1c1e` | Fundo da página |
| `--color-surface` | `#232326` | Cards, header ao rolar |
| `--color-raised` | `#2a2a2d` | Superfícies elevadas, hover |
| `--color-line` | `#383838` | Bordas finas, divisores |
| `--color-paper` | `#f2f3f5` | Títulos |
| `--color-muted` | `#a3a7ad` | Corpo |
| `--color-faint` | `#737373` | Metadados, legendas |
| `--color-accent` | `#3986FF` | Links, CTAs, foco, marcadores |
| `--color-accent-soft` | `#488FFF` | Hover do acento, gradiente da logo |

- Nomes dos tokens são mantidos onde possível (`ink`, `surface`, `line`, `paper`, `muted`, `faint`, `accent`, `accent-soft`) para reduzir churn nos templates; novo token `raised`.
- O azul é usado com parcimônia, como o âmbar era. Gradiente azul só em detalhes pontuais (ex.: CTA principal, marcador ativo), nunca em blocos grandes de texto.
- `theme-color` do `index.html` passa a ser `#1c1c1e`.
- Contraste AA obrigatório: verificar `muted` e `faint` sobre `ink`/`surface`, e texto sobre `accent` nos botões.

### Neomorfismo leve

- Tokens de sombra no `@theme`: `--shadow-raised` (elevação suave: sombra escura embaixo/direita + realce claro e sutil em cima/esquerda) e `--shadow-inset` (afundado, para estado pressionado/ativo e chips).
- Aplicar em: cards da timeline, métricas, grupos de competências, toggle de idioma, botões. **Não** aplicar em tudo — texto corrido e seções continuam planos.
- Raios consistentes (`rounded-2xl` em cards, `rounded-full` em botões/chips). A foto ganha cantos arredondados (substitui o `rounded-sm` editorial).
- Sem glassmorphism exagerado, sem glow, sem gradientes de fundo chamativos. O blur do header ao rolar pode ficar.

### Tipografia (Google Fonts)

- Títulos/display: **Outfit** (geométrica arredondada, conversa com as curvas da logo) — pesos 500–700.
- Corpo/UI: **DM Sans** — pesos 400–700.
- Datas, tags de stack, rótulos: **JetBrains Mono** (mantida).
- Remover `Instrument Serif` e `Manrope`. Itálicos serifados de ênfase saem. A ênfase passa a ser peso/cor do acento.
- Tokens: `--font-display`, `--font-sans` e `--font-mono` atualizados (utilitários `font-display`, `font-mono` continuam valendo).

### Layout

- Mantém a estrutura de seções da spec 001 (Hero, About, Experience, Skills, Education + Languages, Contact/Footer) e a numeração (`01 — About`…), com estética mais limpa: menos réguas finas, mais cards com superfície.
- Movimento mínimo (mantém `animate-rise` e `prefers-reduced-motion`); hover sutil de elevação nos cards.
- Responsivo: 375px, 768px e 1440px, sem scroll horizontal.

## Logo

- Copiar `logo.svg` para `public/images/logo.svg`, usá-la no `Header` (substitui `https://i.imgur.com/ATVSc28.png`) e como favicon SVG em `index.html` (substitui o imgur), mantendo `favicon.ico` como fallback.
- O filtro de sombra interna da logo é mantido. Validar a legibilidade em 32px sobre `ink`.

## Remoção do case BF Academy

- Apagar `src/app/pages/bfacademy/` e o import/rota em `app.routes.ts`.
- Adicionar `{ path: 'bfacademy', redirectTo: '' }` para não quebrar links antigos, e um `**` → `''` como fallback.
- Hero: remover o CTA "Case BF Academy" (fica só "See experience ↓" / "Ver experiência ↓" e, opcionalmente, um CTA de contato).
- Timeline: remover `caseLink` da experiência BF Academy e o suporte a `caseLink` no `ExperienceCard` e na interface `Experience` (sem uso restante).
- A métrica "5 dias → 2 min" e a experiência BF Academy **permanecem** na Home (são fatos do currículo).
- `gradient-text` e o `DomSanitizer` somem junto com a página.
- Atualizar o `CLAUDE.md` (rotas, i18n, tokens, fontes; remover notas sobre `Bfacademy`/`gradient-text`).

## Decisões técnicas

- **Sem lib de i18n** (`@angular/localize`/Transloco descartados): o site é uma página só, com poucas centenas de strings em três idiomas; signal + dicionários tipados é o caminho mais simples, compatível com zoneless e sem mudança no Firebase.
- **Paridade de traduções pelo tipo**, não por teste: `en.ts`, `fr.ts` e `pt.ts` implementam `Dictionary`.
- **Única dependência nova:** `simple-icons` (só os ícones importados entram no bundle).
- **Testes:** sem TDD no front (padrão da spec 001). `app.spec.ts` continua passando; validação funcional no Chrome.

## Critérios de aceite

- Primeira visita sem preferência salva abre em **inglês**; o toggle troca todo o texto para FR-CA ou PT-BR sem reload, e a escolha persiste após recarregar.
- Nenhum texto de outro idioma vaza no idioma ativo (inclusive `alt`, `aria-label`, `sr-only`, title e meta).
- Localização "Barrie & GTA, Canada · Blumenau, SC, Brazil" (traduzida) visível no Hero e no meta description nos três idiomas.
- Techs com marca exibem logo; conceitos sem marca aparecem como chip de texto; nenhum ícone carregado de rede externa.
- `<html lang>`, `<title>` e `meta description` acompanham o idioma.
- Paleta, fontes e sombras seguem os tokens acima; nenhuma referência restante a âmbar/laranja, `Instrument Serif` ou `Manrope`.
- Logo nova no header e no favicon; nenhuma imagem servida do imgur.
- `/bfacademy` redireciona para `/`; nenhuma referência a `Bfacademy` no código.
- Contraste AA, foco visível em azul, layout ok em 375/768/1440px.
- `npm run build` e `npm test` passam.
- Verificado no Chrome em `localhost:4200`, nos três idiomas.
