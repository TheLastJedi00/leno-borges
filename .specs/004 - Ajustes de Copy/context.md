# 004 - Ajustes de Copy: sem FinOps, sem exagero de custo e sem travessões

## Objetivo

Deixar o texto do portfólio mais sóbrio e natural:

1. **Remover o termo FinOps de todo o site.** FinOps é uma disciplina de gestão financeira de nuvem (times, orçamento, alocação de custo). O que o Leno fez foi tomar **decisões de arquitetura e hospedagem com atenção ao custo**: usar Serverless, que hoje é o padrão para qualquer SaaS, e migrar um serviço da BF Academy do **Cloud Run para a Vercel** para reduzir custos. Chamar isso de FinOps soa exagerado para um recrutador técnico e tira o peso das métricas que são reais (as de IA).
2. **Não vender "custo zero" como resultado.** Custo ocioso zero vem junto com o modelo Serverless.
3. **Remover os travessões (—) do site, nos 3 idiomas.** O travessão é pouco natural no português do dia a dia e soa como texto traduzido. Para manter o padrão visual igual entre os idiomas, ele sai também do inglês e do francês.

## Diagnóstico

### FinOps e "custo zero" (3 idiomas)

| Onde | Texto atual (PT) | Problema |
|---|---|---|
| `meta.description` + `src/index.html` | "…IA Generativa e FinOps." | FinOps como palavra-chave principal |
| `hero.tagline` | "…e FinOps mantendo a infraestrutura perto de zero." | Promessa exagerada no topo da página |
| `about.summaryExtra` | "…aplicação de estratégias de FinOps para escalar produtos mantendo o custo de infraestrutura próximo a zero." | "Estratégias de FinOps" para o que foram escolhas de arquitetura |
| `about.metrics[2]` | "≈ 0% · Custo de infraestrutura ociosa com FinOps e arquitetura Serverless" | Propriedade da tecnologia apresentada como resultado |
| Tags de BF Academy e Liga Dev | `'FinOps'` | FinOps não é tecnologia; ao lado dos logos, parece parte da stack |
| Path da BF Academy | **FinOps**: "…custo de infraestrutura próximo de 0%…" | Esconde o fato real (migração Cloud Run → Vercel) atrás do jargão |
| Path da Liga Dev | **IA Generativa & FinOps**: "…custo próximo de zero…" | Mesmo exagero |
| Matriz do DNA, Delcastanher | "custo zero de ociosidade", "sem custo de servidor ocioso" | Repetido em quase todo card |

**Incoerência:** o rótulo da métrica "3 h → 1 min" ainda diz "em plataforma de consultoria", mas desde a spec 003 o card se chama **Matriz do DNA**.

### Travessões em `pt.ts`

| Chave | Atual | Novo |
|---|---|---|
| `meta.title` | Leno Borges — Software Developer Fullstack & Tech Educator \| Barrie & GTA, Canadá | Leno Borges, Software Developer Fullstack & Tech Educator \| Barrie & GTA, Canadá |
| `header.home` (sr-only) | Leno Borges — início | Página inicial de Leno Borges |
| `hero.tagline` | …Java/Spring — com IA… | reescrita (ver abaixo), sem travessão |
| `period` (7 experiências) | Out 2025 — Nov 2025 / Abr 2026 — Presente / Out 2025 — Atual | **Out 2025 a Nov 2025** / **Desde Abr 2026** / **Desde Out 2025** |
| Formação, módulo "Mentoria e Excelência Técnica" | …projetos práticos — o que resultou no convite… | …projetos práticos, o que resultou no convite… |
| `languages.title` | 05 — Idiomas | 05 · Idiomas (o `·` já é usado no site, ex.: "Em aula · ProWay") |

O formato "Desde Abr 2026" também resolve a mistura atual de "Presente" (Tichr) e "Atual" (demais). O badge "Atual" continua marcando o que está em andamento.

Períodos em PT depois da mudança:

| Experiência | Período |
|---|---|
| Liga Dev | Desde 2026 |
| Delcastanher | Desde Set 2026 |
| Tichr | Desde Abr 2026 |
| ProWay | Desde Jan 2026 |
| Matriz do DNA | Desde Jan 2026 |
| BF Academy | Desde Out 2025 |
| Sistema de Agendamento | Out 2025 a Nov 2025 |

### Travessões em `en.ts`, `fr.ts` e `src/index.html`

Mesma lógica do PT: o travessão vira vírgula, `·` ou preposição.

| Chave | EN | FR-CA |
|---|---|---|
| `meta.title` (+ `<title>` do `index.html`) | Leno Borges, Full-Stack Software Developer & Tech Educator \| Barrie & GTA, Ontario | Leno Borges, développeur logiciel full stack et formateur techno \| Barrie et RGT, Ontario |
| `header.home` (sr-only) | Leno Borges home page | Page d’accueil de Leno Borges |
| `hero.tagline` | reescrita (ver Novo copy), sem travessão | reescrita (ver Novo copy), sem travessão |
| `period` em andamento | Since Apr 2026 | Depuis avr. 2026 |
| `period` encerrado | Oct 2025 to Nov 2025 | D’oct. 2025 à nov. 2025 |
| Módulo "Mentoria e Excelência Técnica" | …hands-on projects, which led to an invitation… | …projets pratiques, ce qui a mené à une invitation… |
| `languages.title` | 05 · Languages | 05 · Langues |

Os períodos seguem a tabela do PT (Liga Dev "Since 2026" / "Depuis 2026", e assim por diante).

## Escopo

### Dentro
- Remover "FinOps" de todo texto visível, das tags e do meta description, nos 3 idiomas.
- Trocar o jargão por **fatos concretos e verbos simples** (ver o guia de vocabulário).
- Remover a métrica "≈ 0%"; a seção Sobre fica com 2 métricas (as de IA) e o grid passa para `sm:grid-cols-2`.
- Corrigir o rótulo da métrica "3 h → 1 min" para Matriz do DNA.
- Registrar na BF Academy a migração **Cloud Run → Vercel** e adicionar a tag `Vercel` (o ícone já existe em `tech-icons.ts`).
- Remover todos os travessões de `pt.ts`, `en.ts`, `fr.ts` e do `src/index.html`.
- Registrar no `CLAUDE.md` as duas regras de copy (sem FinOps, sem travessão em nenhum idioma), para não voltarem.

### Fora
- Comentários HTML (`<!-- 01 — About -->`), que não aparecem para o leitor.
- As métricas de IA ("5 dias → 2 min" e "3 h → 1 min"). A seta `→` não é travessão e fica.
- Editar o `resume.md` da spec 001 (ver a recomendação no fim).

## Guia de vocabulário (substitui FinOps)

Regra: **descrever o que foi feito, não o nome da disciplina.** Sempre que possível, citar o fato concreto (o que foi migrado, de onde para onde) em vez de prometer um número.

| Evitar | Usar (PT) | EN | FR-CA |
|---|---|---|---|
| FinOps, estratégia de FinOps | atenção ao custo nas decisões de arquitetura | cost-aware architecture decisions | choix d’architecture attentifs aux coûts |
| custo próximo de 0% / perto de zero | infraestrutura enxuta | lean infrastructure | infrastructure légère |
| custo zero de ociosidade | *(omitir: é característica do Serverless)* | *(omit)* | *(omettre)* |
| otimização de custos de nuvem | redução do custo de hospedagem | lower hosting costs | réduction des coûts d’hébergement |

A spec 002 tinha a linha "FinOps, Serverless → Cloud cost optimization (FinOps)" na tabela de palavras-chave. Ela é substituída por "Serverless → serverless, cloud-native / sans serveur, infonuagique".

## Novo copy

### Meta description
- PT: "Leno Borges, Software Developer Fullstack (TypeScript, Angular, Node.js/NestJS, Java/Spring Boot) e Tech Educator em Barrie & GTA, Ontário, Canadá e Blumenau, SC, Brasil. Plataformas SaaS e EdTech, REST APIs, IA Generativa e arquitetura Serverless."
- EN: "…SaaS and EdTech platforms, REST APIs, generative AI and serverless, cloud-native architecture." (o `src/index.html` recebe o mesmo texto)
- FR: "…Plateformes SaaS et EdTech, API REST, IA générative et architecture infonuagique sans serveur."

### Hero (`tagline`)
A infraestrutura sai do destaque. O hero fica com o que diferencia o Leno: produto de ponta a ponta e IA.
- PT: "Plataformas SaaS e EdTech de ponta a ponta com Angular, NestJS e Java/Spring, usando IA Generativa para automatizar o operacional."
- EN: "End-to-end SaaS and EdTech platforms with TypeScript, Angular, NestJS and Java/Spring, using generative AI to automate operations."
- FR: "Plateformes SaaS et EdTech de bout en bout avec TypeScript, Angular, NestJS et Java/Spring, où l’IA générative automatise l’opérationnel."

### Sobre (`summaryExtra`)
- PT: "Forte vivência prática na integração de Inteligência Artificial para automatizar processos operacionais, com atenção ao custo nas decisões de arquitetura, como a migração de monólito para Serverless e a troca de provedor de hospedagem. Perfil hands-on e com histórico de mentoria técnica, combinando a entrega ágil de código com a preocupação real sobre o produto e o cliente final."
- EN: "Strong hands-on experience integrating generative AI to automate operational processes, with cost-aware architecture decisions such as moving a monolith to serverless and switching hosting providers. Hands-on profile with a track record of technical mentoring, pairing agile delivery with real care for the product and the end user."
- FR: tradução fiel da versão PT, com o vocabulário da tabela.

### Métricas
- Remover o item "≈ 0%".
- "3 h → 1 min": PT "Criação de material personalizado com IA Generativa na Matriz do DNA" / EN "Personalized material creation with generative AI at Matriz do DNA" / FR "Création de matériel personnalisé par l’IA générative chez Matriz do DNA".

### Cards da timeline

| Card | Mudança |
|---|---|
| **BF Academy** | Tags: `['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'Vercel', 'CI/CD']`. O path **FinOps** vira **Cloud Run → Vercel**: "Migração de um serviço do Cloud Run para a Vercel para reduzir o custo de hospedagem, em uma arquitetura modular Serverless com esteiras de CI/CD." |
| **Liga Dev** | Tags sem `FinOps`. O path **IA Generativa & FinOps** vira **IA Generativa & Serverless**: "Geração de material personalizado com IA sobre infraestrutura Serverless, com esteiras de CI/CD." |
| **Matriz do DNA** | "Mesma arquitetura modular Serverless da BF Academy, com alta disponibilidade e esteiras de CI/CD." (sai "custo zero de ociosidade") |
| **Delcastanher** | "Arquitetura Serverless com alta disponibilidade." (sai "sem custo de servidor ocioso") |
| **Sistema de Agendamento** | **Mantido.** Ali a economia é consequência de uma decisão (migrar o monólito), que é um fato relevante |

EN e FR seguem as mesmas mudanças, traduzidas fielmente com o vocabulário da tabela.

## Recomendação fora do código

O `resume.md` (spec 001) diz "aplicação de estratégias de FinOps… custo próximo a zero" e "Estratégia de FinOps" na BF Academy. Vale ajustar o currículo (PDF/LinkedIn) da mesma forma e citar a migração Cloud Run → Vercel, para o site e o currículo não se contradizerem numa entrevista. Esta spec não altera o `resume.md`: só registra que, a partir de agora, o site diverge dele nesse ponto **de propósito**.

## Decisões técnicas
- Mudança só de conteúdo (dicionários e `index.html`), mais uma classe de grid em `home.html` e uma nota no `CLAUDE.md`. Sem componentes novos e sem dependências.
- Sem TDD no front (padrão das specs anteriores). `app.spec.ts` continua passando e a validação é feita no Chrome.

## Critérios de aceite
- `grep -ri finops src` vazio.
- Nenhuma ocorrência de "próximo de 0%", "perto de zero", "close to zero", "near-zero", "quasi nul" ou "custo zero de ociosidade" nos dicionários.
- `grep -rn "—" src/app/i18n src/index.html` vazio.
- Períodos no formato "Desde Mmm AAAA" / "Mmm AAAA a Mmm AAAA" (EN "Since…" / "… to …"; FR "Depuis…" / "De… à…").
- A seção Sobre mostra 2 métricas, em 2 colunas a partir de `sm`; o rótulo de "3 h → 1 min" cita a Matriz do DNA nos 3 idiomas.
- O card da BF Academy mostra o path "Cloud Run → Vercel" e a tag Vercel com logo.
- Meta description atualizada nos 3 idiomas e no `index.html`; `<title>` sem travessão nos 3 idiomas e no `index.html`.
- `npm run build` e `npm test` passam; verificado no Chrome em `localhost:4200`, nos 3 idiomas e em 375/768/1440px.
