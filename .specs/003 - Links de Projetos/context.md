# 003 - Links de Projetos — botões para os sistemas em produção, Matriz do DNA e Liga Dev

## Objetivo

Adicionar aos cards da timeline de experiência um **botão que leva o leitor à página oficial do sistema** desenvolvido, como prova de trabalho em produção. A spec também **renomeia a experiência "Plataforma de Consultoria" para "Matriz do DNA"**, reescreve a descrição dela e **adiciona a experiência Liga Dev** no topo da timeline.

## Escopo

### Dentro
- Botão "Visitar `<domínio>` ↗" nos cards de experiência que têm sistema público:

| Experiência | URL | Rótulo exibido |
|---|---|---|
| Liga Dev | `https://liga.lenoborges.com.br/comunidade` | Visitar liga.lenoborges.com.br/comunidade ↗ |
| Tichr | `https://www.tichr.com.br` | Visitar tichr.com.br ↗ |
| BF Academy | `https://www.barbarafarias.com.br/academy` | Visitar barbarafarias.com.br/academy ↗ |
| Delcastanher | `https://www.delcastanher.srv.br` | Visitar delcastanher.srv.br ↗ |

- Renomear "Plataforma de Consultoria" para **Matriz do DNA** e reescrever o texto nos 3 idiomas.
- Nova experiência **Liga Dev** como primeiro item da timeline, nos 3 idiomas.
- Nova experiência **Delcastanher Serviços Administrativos** como segundo item da timeline, nos 3 idiomas.
- Textos novos (verbo do botão, aviso de nova aba) nos dicionários `en`, `fr` e `pt`.

### Fora
- Link para a Matriz do DNA: nenhuma URL foi informada. O card fica sem botão.
- Links nas demais experiências (ProWay, Sistema de Agendamento).
- Preview/miniatura dos sites, analytics de clique.

## Botão de link

### Dados
- `home.data.ts` ganha um mapa neutro de idioma `projectUrls`, com as URLs completas (`https://www.…`), por exemplo `projectUrls.tichr`.
- A interface `Experience` ganha `url?: string` (opcional). Em `en.ts`, `fr.ts` e `pt.ts`, o item usa a constante (`url: projectUrls.tichr`), sem repetir a string. Assim a URL é definida num só lugar e o tipo garante a paridade entre os idiomas.
- O domínio exibido é **derivado da URL**: sem protocolo, sem `www.` e sem barra final, mantendo o caminho (`barbarafarias.com.br/academy`). Pode ser um helper `displayUrl(url)` em `home.data.ts`.

### Textos (dicionários)
Novo em `experience` no `Dictionary`:

| Chave | EN | FR-CA | PT |
|---|---|---|---|
| `visit` | Visit | Visiter | Visitar |
| `newTab` (sr-only) | (opens in a new tab) | (s'ouvre dans un nouvel onglet) | (abre em nova aba) |

Rótulo final: `{{ visit }} {{ displayUrl(url) }}`, seguido do `↗` com `aria-hidden="true"` e do `newTab` em `sr-only`.

### Componente `ExperienceCard`
- Novos inputs opcionais: `url`, `visitLabel` e `newTabLabel`. Sem `url`, nada é renderizado.
- O botão é um `<a href target="_blank" rel="noopener noreferrer">` posicionado **ao fim do card**, depois das tags de stack.
- **Estilo secundário**, para não competir com o CTA principal do Hero (`accent-deep`): `rounded-full`, `bg-raised`, `shadow-raised`, texto `accent-soft` em `font-mono text-xs`, `active:shadow-inset` e foco visível azul. No hover, o texto vai para `paper` e a seta se desloca sutilmente (respeitando `prefers-reduced-motion`).
- Em telas estreitas, domínios longos (`barbarafarias.com.br/academy`) quebram linha sem gerar scroll horizontal (`break-all` ou `max-w-full`).

## Matriz do DNA (ex-"Plataforma de Consultoria")

**Contexto passado pelo Leno:** é a plataforma de uma empresária que forma outras empresárias. A arquitetura e o modo de customizar o material são **idênticos aos da BF Academy**. A stack é Angular, NestJS e Gemini, este último usado na criação de conteúdo personalizado.

**Mantidos:** cargo (Desenvolvedor), período (Jan 2026 — Mar 2026), local (Remoto) e a métrica "3 horas → 1 minuto" (fato do currículo).

**Proposta de copy (PT, fonte para EN/FR):**
- `title`: Matriz do DNA (nome próprio, sem tradução)
- `subtitle`: Plataforma de Formação de Empresárias · Freelancer
- `badge`: PT "Em construção" / EN "In progress" / FR "En cours" (mesmo texto da Liga Dev)
- ⚠️ **A confirmar:** o período atual (Jan 2026 — Mar 2026) tem data de fim, o que não combina com o badge "Em construção". Se o projeto continua em andamento, o período passa a ser "Jan 2026 — Atual".
- `techs`: `['Angular', 'NestJS', 'Gemini', 'Serverless', 'CI/CD']`. "IA Generativa" vira o logo do **Gemini**; Serverless e CI/CD ficam porque a arquitetura é a mesma da BF Academy.
- `paths`:
  - **Plataforma**: desenvolvimento, com Angular e NestJS, da plataforma de uma empresária que forma outras empresárias.
  - **Conteúdo com Gemini**: módulo de IA generativa com Gemini que personaliza o material de cada aluna, reduzindo o tempo de produção de 3 horas para 1 minuto.
  - **Serverless & CI/CD**: mesma arquitetura modular Serverless da BF Academy, com alta disponibilidade, custo zero de ociosidade e esteiras de CI/CD.
- EN e FR são traduções fiéis aplicando a tabela de palavras-chave da spec 002 (*Generative AI / IA générative*, *serverless / sans serveur*, *CI/CD pipelines*). FR em vocabulário canadense.

## Liga Dev (nova experiência)

**Contexto passado pelo Leno:** é o curso particular de programação dele, em criação neste momento, e usa a mesma stack da BF Academy.

- **Posição:** primeiro item de `experience.items`, antes da Tichr, porque é o projeto atual em andamento.
- `title`: Liga Dev (nome próprio, sem tradução)
- `subtitle`: PT "Curso de Programação Próprio" / EN "Own Coding Course" / FR "Cours de programmation personnel"
- `role`: PT "Fundador" / EN "Founder" / FR "Fondateur"
- `period`: PT "2026 — Atual" / EN "2026 — Present" / FR "2026 — aujourd'hui"
- `location`: Remoto / Remote / À distance
- `badge`: PT "Em construção" / EN "In progress" / FR "En cours"
- `url`: `projectUrls.ligaDev` → `https://liga.lenoborges.com.br/comunidade`
- `techs`: os mesmos da BF Academy, `['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'FinOps', 'CI/CD']`, com os termos traduzíveis já existentes em cada dicionário.
- `paths` (proposta em PT, fonte para EN/FR). Como o curso ainda está em criação, o texto **não inclui métricas de resultado**:
  - **Curso de programação**: criação de um curso próprio de programação, unindo a experiência de instrutor técnico a uma plataforma própria.
  - **Plataforma**: construída sobre a mesma arquitetura da BF Academy, com Angular no front-end e NestJS no back-end.
  - **IA Generativa & FinOps**: geração de material personalizado com IA e infraestrutura Serverless de custo próximo de zero, com esteiras de CI/CD.
- O Leno revisa o texto antes do merge, porque o fato é novo e não está no `resume.md` da spec 001.

## Delcastanher Serviços Administrativos (nova experiência)

**Contexto:** o site oficial (`delcastanher.srv.br`, Angular 20) vende a **Imersão RH Estratégico**, um programa para estruturar o RH de empresas do zero. O Leno atua como desenvolvedor fullstack desde setembro de 2026.

- **Posição:** segundo item de `experience.items`, logo depois da Liga Dev e antes da Tichr (início mais recente entre os projetos em andamento).
- `title`: Delcastanher (nome próprio, sem tradução)
- `subtitle`: PT "Serviços Administrativos · Projeto Freelancer" / EN "Administrative Services · Freelance project" / FR "Services administratifs · Projet à la pige"
- `role`: PT "Desenvolvedor Fullstack" / EN "Full-Stack Developer" / FR "Développeur full stack"
- `period`: PT "Set 2026 — Atual" / EN "Sep 2026 — Present" / FR "sept. 2026 — aujourd'hui"
- `location`: Remoto / Remote / À distance
- Sem badge.
- `url`: `projectUrls.delcastanher` → `https://www.delcastanher.srv.br`
- `techs`: `['Angular', 'NestJS', 'Serverless', 'PostgreSQL']`. O `PostgreSQL` já tem ícone em `tech-icons.ts`.
- `paths` (proposta em PT, fonte para EN/FR), **sem métricas**, para o Leno revisar:
  - **Plataforma**: desenvolvimento fullstack da plataforma da Imersão RH Estratégico, com Angular no front-end e NestJS no back-end.
  - **Dados**: modelagem e persistência em PostgreSQL.
  - **Serverless**: arquitetura Serverless, com alta disponibilidade e sem custo de servidor ocioso.

## Decisões técnicas
- Mantém o padrão da spec 002: a URL fica neutra de idioma em `home.data.ts`, e a `Dictionary` só recebe textos traduzíveis.
- Sem dependências novas. Sem TDD no front (padrão das specs 001/002): `app.spec.ts` continua passando e a validação é feita no Chrome.
- URLs verificadas em 02/11/2026: as quatro respondem 200 em HTTPS.

## Critérios de aceite
- A Liga Dev aparece como primeiro card da timeline nos 3 idiomas, com o badge "Em construção" e a mesma stack da BF Academy.
- A Delcastanher aparece como segundo card, com as tags Angular, NestJS, Serverless e PostgreSQL.
- Os cards Liga Dev, Delcastanher, Tichr e BF Academy mostram o botão "Visitar `<domínio>` ↗" (EN "Visit…", FR "Visiter…"), que abre o site oficial em nova aba com `rel="noopener noreferrer"`.
- Os cards sem `url` (ProWay, Matriz do DNA, Sistema de Agendamento) não mostram botão nem espaço vazio.
- O leitor de tela anuncia "Visitar tichr.com.br (abre em nova aba)" no idioma ativo, e a seta não é lida.
- O card "Matriz do DNA" tem o badge "Em construção" e substitui "Plataforma de Consultoria" nos 3 idiomas, com o logo do Gemini nas tags. Não resta nenhuma ocorrência de "Plataforma de Consultoria", "Consulting Platform" ou "Plateforme de consultation".
- Foco visível, contraste AA e nenhum scroll horizontal em 375/768/1440px.
- `npm run build` e `npm test` passam.
- Verificado no Chrome em `localhost:4200`, nos três idiomas.
