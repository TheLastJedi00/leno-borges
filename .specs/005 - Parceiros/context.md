# 005 - Parceiros: referência às parcerias de cada projeto, com nome e LinkedIn

## Objetivo

Mostrar, em cada projeto que teve uma parceria, **quem foi o parceiro (pessoa ou empresa) com link para o LinkedIn dele**. Isso funciona como prova social: o recrutador pode checar o vínculo direto com a pessoa ou a empresa envolvida.

## Escopo

### Dentro

| Parceiro | Tipo | Onde aparece | LinkedIn (URL canônica) |
|---|---|---|---|
| Bárbara Farias | Pessoa | Card de experiência **BF Academy** | `https://www.linkedin.com/in/b%C3%A1rbara-farias-490041186/` |
| Lidiane Delcastanher | Pessoa | Card de experiência **Delcastanher** | `https://www.linkedin.com/in/lidiane-delcastanher-5b2861153/` |
| Paula Marjorie | Pessoa | Card de experiência **Matriz do DNA** | `https://www.linkedin.com/in/paula-marjorie/` |
| ProWay | Empresa | Card de experiência **ProWay** e item de formação **Bootcamp de Suporte AMS** | `https://www.linkedin.com/company/prowayinfo/` |
| T-Systems | Empresa | Item de formação **Bootcamp de Suporte AMS** (instituição "T-Systems / ProWay") | `https://www.linkedin.com/company/tsystems-brasil/` |

- As URLs perdem os parâmetros de rastreio do compartilhamento (`utm_source`, `utm_content`, `utm_medium`) e ganham `https://www.` e barra final.
- O `á` de "bárbara" vai **codificado** (`b%C3%A1rbara`) para o `href` ser válido em qualquer navegador e no build.
- Rótulo único **"Parceria"** para todos (EN "Partner", FR "Partenaire"), sem diferenciar cliente, cofundadora ou empresa.

### Fora
- Liga Dev, Tichr, Sistema de Agendamento e Análise e Desenvolvimento de Sistemas: nenhum parceiro informado. Os cards ficam como estão.
- Foto ou avatar do parceiro, depoimentos, recomendações do LinkedIn.
- Rótulos diferentes por tipo de vínculo (descartado pelo Leno em favor de "Parceria" para todos).

## Dados

- Nova interface em `home.data.ts`:
  ```ts
  export interface Partner {
    name: string;
    linkedin: string;
  }
  ```
- Novo mapa neutro de idioma `partners` em `home.data.ts` (mesmo padrão de `projectUrls`), com uma chave por parceiro: `barbaraFarias`, `lidianeDelcastanher`, `paulaMarjorie`, `proway`, `tsystems`. Nomes próprios não se traduzem, então nome e URL ficam fora dos dicionários.
- `Experience` e `Education` ganham `partners?: Partner[]` (lista, porque o Bootcamp tem dois parceiros). Nos dicionários `en`, `fr` e `pt`, o item referencia a constante: `partners: [partners.barbaraFarias]`. Assim a URL fica num só lugar e o tipo garante a paridade entre idiomas.

## Textos (dicionários)

Nova chave de topo `partners` no `Dictionary`, compartilhada por experiência e formação:

| Chave | EN | FR-CA | PT |
|---|---|---|---|
| `label` | Partner | Partenaire | Parceria |
| `linkedin` (sr-only, depois do nome) | LinkedIn profile | profil LinkedIn | perfil no LinkedIn |

O aviso de nova aba reaproveita `experience.newTab`. Leitor de tela anuncia, por exemplo: "Parceria: Bárbara Farias, perfil no LinkedIn (abre em nova aba)".

## UI

### Componente novo `partner-links` (`src/app/shared/partner-links/`)
- Inputs: `partners` (obrigatório), `label`, `linkedinLabel`, `newTabLabel`. Usado por `ExperienceCard` e `EducationItem` para não duplicar markup.
- Uma linha `font-mono text-xs`: rótulo `text-faint` ("Parceria") seguido de um link por parceiro, separados por `·`.
- Cada link: ícone do LinkedIn (o mesmo SVG já usado em `links.html`, extraído ou copiado, `aria-hidden`), nome em `text-accent-soft`, hover em `paper`, `target="_blank"`, `rel="noopener noreferrer"`, foco visível azul. O ícone **não** vem do `simple-icons` (a marca LinkedIn foi removida da biblioteca).
- Sem `partners` (ou lista vazia), nada é renderizado.

### Posição
- **ExperienceCard**: logo abaixo da linha "cargo · subtítulo", no cabeçalho do card. O parceiro é contexto do projeto, então fica junto da identificação e não compete com o botão "Visitar ↗" do fim do card.
- **EducationItem**: logo abaixo da instituição.
- Em 375px, a linha quebra entre parceiros sem scroll horizontal (`flex-wrap`).

## Decisões técnicas
- Mantém o padrão das specs 002/003: dados neutros em `home.data.ts`, só texto traduzível no `Dictionary`.
- Sem dependências novas. Sem TDD no front (padrão das specs anteriores): `app.spec.ts` continua passando e a validação é feita no Chrome.
- Regras de copy do `CLAUDE.md` valem: sem travessão nos textos novos.

## Critérios de aceite
- BF Academy, Delcastanher, Matriz do DNA e ProWay mostram "Parceria" com o nome do parceiro e o ícone do LinkedIn, nos 3 idiomas.
- O Bootcamp de Suporte AMS mostra "Parceria: T-Systems · ProWay" abaixo da instituição.
- Cada link abre o LinkedIn correto em nova aba com `rel="noopener noreferrer"`; o perfil da Bárbara abre apesar do acento.
- Liga Dev, Tichr, Sistema de Agendamento e a graduação não mostram linha de parceria nem espaço vazio.
- O leitor de tela anuncia rótulo, nome, "perfil no LinkedIn" e o aviso de nova aba no idioma ativo; o ícone não é lido.
- Foco visível, contraste AA e nenhum scroll horizontal em 375/768/1440px.
- `npm run build` e `npm test` passam.
- Verificado no Chrome em `localhost:4200`, nos três idiomas.
