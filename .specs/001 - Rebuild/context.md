# 001 - Rebuild — Redesign visual do portfólio

## Objetivo

Reformular o design visual da **Home** do portfólio usando o currículo (`resume.md`) como fonte de conteúdo e a foto (`IMG_2519(2) (1).jpg`) como imagem principal, substituindo a estética atual (slate/violeta genérica) por uma direção **editorial escura**, mais autoral.

## Escopo

### Dentro
- Página `Home` (`src/app/pages/home/`) — layout, seções e conteúdo.
- Componentes compartilhados usados pela Home (`header`, `links`, `owner`, `experience-card`).
- Tokens globais de design (`src/styles.css`) e fontes (`src/index.html`).
- Nova foto em `public/`.

### Fora
- Página `Bfacademy` (`/bfacademy`): **não** é redesenhada nesta spec. Ela continua usando `Header` e `Links`; qualquer alteração nesses componentes não pode quebrar ou deixar a página visualmente inconsistente (verificar no Chrome).
- Backend, rotas novas, i18n, deploy.

## Fonte de conteúdo

`resume.md` é a **fonte de verdade** para fatos (cargos, empresas, períodos, métricas, stack). Textos atuais da Home que extrapolam o currículo devem ser alinhados a ele:

| Atual (`home.ts`) | Currículo | Ação |
|---|---|---|
| Tichr: "eliminando **100%** do retrabalho" | "eliminando o trabalho manual" | Remover o "100%" |
| ProWay: techs incluem `Spring Boot` | Java, POO, Node, SQL, Angular, JS, TS, Versionamento | Usar a lista do currículo |
| ProWay: local "Blumenau, SC (Part-Time)" | "Part-Time" | Manter "Blumenau, SC · Part-Time" |
| Freelancer: "~99% de ganho de eficiência" | "de 3 horas para 1 minuto" | Manter só a métrica do currículo |

Os nomes dos subtítulos das trilhas (ex.: "Entra 21 & Especialização", "Tech Explorers") podem ser mantidos — são rótulos, não fatos novos.

## Direção visual — Editorial escuro

- **Fundo:** quase preto quente (ex. `#0f0e0c`), superfícies levemente mais claras (`#1a1815`), bordas finas (`#2a2723`).
- **Texto:** off-white (`#ece8e1`) para títulos, cinza quente (`#a8a29e`) para corpo.
- **Acento único:** âmbar/laranja (ex. `#f59e0b` / `#fb923c`) — conversa com o cordão laranja da foto. Usado com parcimônia: links, números de métrica, marcadores, foco.
- **Tipografia (Google Fonts):**
  - Display/títulos: serifada de alto contraste — `Instrument Serif` (itálico disponível para ênfase).
  - Corpo/UI: `Manrope`.
  - Datas, tags de stack, rótulos: `JetBrains Mono`.
- **Layout:** de revista — grid assimétrico, numeração de seções (`01 — Sobre`, `02 — Experiência`…), réguas finas separando seções, bastante respiro vertical.
- **Foto:** grande, recortada em retrato (enquadrando rosto e mãos), com tratamento sutil (leve dessaturação/gradiente escuro na base para integrar ao fundo). Sem moldura circular.
- **Movimento:** mínimo — fade/slide de entrada no hero, hover discreto. Respeitar `prefers-reduced-motion`.
- **Responsivo:** mobile-first; sem scroll horizontal; foto empilha acima do texto no mobile.
- **Acessibilidade:** contraste AA, `alt` descritivo na foto, foco visível com o acento, hierarquia de headings correta (um `h1` por página).

Os tokens ficam em `src/styles.css` via `@theme` do Tailwind v4 (ex. `--color-ink`, `--color-paper`, `--color-accent`, `--font-display`), para serem usados como utilitários (`bg-ink`, `text-accent`, `font-display`).

## Estrutura da Home

1. **Header** — logo atual + navegação âncora (Sobre, Experiência, Competências, Formação, Contato). Fixo, com fundo ao rolar.
2. **Hero** — nome em display grande, "Engenheiro de Software Fullstack & Tech Educator", localização (Blumenau, SC), foto em destaque, CTAs: "Ver experiência ↓" e "Case BF Academy".
3. **01 — Sobre** — Resumo profissional do currículo + 3 números de destaque extraídos dele:
   - 5 dias → 2 min (material didático, BF Academy)
   - 3 h → 1 min (material personalizado, Freelancer)
   - ~0% custo de infraestrutura ociosa (FinOps/Serverless)
4. **02 — Experiência** — linha do tempo vertical (substitui o grid de 2 colunas), na ordem do currículo: Tichr, ProWay, Freelancer, BF Academy, Autônomo. Cada item: período (mono), empresa, cargo, local, badge (Atual/Cofundador), bullets e tags de stack. BF Academy com link para `/bfacademy`.
5. **03 — Competências** — stack agrupada pelas 6 categorias do currículo (Linguagens, Frameworks & Bibliotecas, Arquitetura & Padrões, Cloud & DevOps, IA, Banco de Dados).
6. **04 — Formação** — Bootcamp de Suporte AMS (T-Systems / ProWay, Dez 2025) com os 4 módulos e carga horária; ADS Uniasselvi (conclusão prevista 06/2027).
7. **05 — Idiomas** — Português (Nativo), Inglês (Intermediário B1). Pode ser bloco compacto ao lado de Formação.
8. **Contato / Footer** — chamada final ("Vamos conversar?"), e-mail `lenoborges.dev@gmail.com`, WhatsApp `(47) 99247-8232`, LinkedIn, GitHub, Instagram; copyright com ano corrente.

## Decisões técnicas

- **Dados fora do componente:** com 4 novos blocos de conteúdo, `home.ts` ficaria grande demais. Os dados vão para `src/app/pages/home/home.data.ts` (tipados com interfaces) e são importados pelo `Home`. Desvio consciente do padrão "dados inline" do `CLAUDE.md` — atualizar o `CLAUDE.md` ao final.
- **Novos componentes** em `src/app/shared/` seguindo a convenção Angular 20 (`foo.ts`/`foo.html`, sem sufixo `Component`, `OnPush`, `input()`/`input.required()`):
  - `section-heading` — número + título da seção.
  - `skill-group` — categoria + lista de tags.
  - `education-item` — formação com módulos opcionais.
  - `ExperienceCard` é reescrito como item de linha do tempo (mantém o nome e a API de inputs; `paths` passa a aceitar bullets do currículo).
- **Foto:** converter o JPG (2160×2881, pesado) para `public/images/leno.webp` (≈ 900px de largura, qualidade ~80) + fallback `.jpg`. Exibir com `NgOptimizedImage` e `priority` no `Owner`. O `Owner` deixa de apontar para o imgur.
- **Fontes:** `<link>` do Google Fonts com `preconnect` em `src/index.html`; `lang="pt-BR"` no `<html>`.
- **`gradient-text`:** classe inexistente — remover dos templates da Home (a da Bfacademy fica, fora de escopo).
- **Testes:** corrigir `app.spec.ts` (expectativa inválida de `h1`) e adicionar spec mínima da Home verificando que as seções renderizam (com `provideZonelessChangeDetection()`).

## Critérios de aceite

- Home reflete 100% dos fatos do currículo e nenhum fato fora dele.
- Nova foto exibida, otimizada (< 200 KB).
- Layout correto em 375px, 768px e 1440px, sem scroll horizontal.
- `/bfacademy` continua renderizando sem regressão visual grave.
- `npm run build` e `npm test` passam.
- Verificado no Chrome em `localhost:4200`.
