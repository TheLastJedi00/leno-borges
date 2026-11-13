# 006 - Kit de Ensino: apresentações interativas de programação, sem login

## Objetivo

Criar no site uma área pública, **sem login**, que reúne o material de ensino do Leno: apresentações de slides feitas na web (Angular, HTML, animações), organizadas por trilha e aula. A entrada principal é um botão no card de experiência da **ProWay**, no mesmo lugar onde os outros cards mostram "Visitar ↗": em vez de levar a um sistema, leva ao kit.

A primeira entrega é **uma trilha (Lógica de Programação) com uma aula (Variáveis e Tipos de Dados)**. A estrutura precisa aceitar novas trilhas e aulas sem retrabalho.

Princípios da apresentação:
- **Visual primeiro.** Slide limpo, pouco texto, a imagem explica. A metáfora central é o **baú**: a variável é um baú, o nome é a **etiqueta** colada nele, o valor é o **item** guardado dentro.
- **Sintaxe escolhida pelo apresentador.** A mesma aula serve para uma turma de JavaScript, TypeScript ou Java; o código de cada slide segue a sintaxe correta da linguagem escolhida.
- **Identidade do site.** Mesma paleta grafite + azul, mesmo neumorfismo, mesmas fontes, só que mais interativo.

## Escopo

### Dentro
- Página de catálogo do kit (`/kit`), com trilhas e aulas.
- Player de slides reutilizável (navegação, etapas, notas, tela cheia, seletor de sintaxe).
- Aula **Variáveis e Tipos de Dados** completa, com ilustrações animadas e exercícios interativos.
- Botão "Kit de ensino" no card da ProWay (EN, FR, PT).
- Rotas indexáveis com `title` e `meta description` próprios, `sitemap.xml` e `robots.txt`.

### Fora
- Login, progresso do aluno, ranking, backend ou banco de dados. Tudo é estático e roda no navegador.
- Tradução do **conteúdo** das aulas para EN e FR (a estrutura já prevê, mas fica para outra spec).
- Outras aulas da trilha (operadores, condicionais, laços etc.).
- Exportar para PDF ou PPTX.
- Modo "aluno acompanha no celular" sincronizado com o apresentador.

## Decisões

| Tema | Decisão |
|---|---|
| Idioma | Interface do kit (catálogo, controles, `aria-label`) trilíngue pelos dicionários. Conteúdo das aulas só em **PT**. Com o site em EN ou FR, o catálogo e o player mostram um aviso curto: "Conteúdo disponível em português" (texto do dicionário). |
| Sintaxes | **JavaScript, TypeScript e Java.** Sem pseudocódigo. Cada aula declara quais sintaxes suporta. |
| Visibilidade | Público e indexável, linkado no card da ProWay. |
| Recursos do player | Navegação por teclado, animações em etapas, notas do apresentador e exercícios interativos. |
| Duração | A mesma aula serve de **10 min a 4 h**. Os slides se dividem em **essenciais** (fecham o tema de forma sucinta, cerca de 10 min) e **aprofundamentos** (detalhes, curiosidades, exercícios extras). O apresentador escolhe o roteiro `Essencial` ou `Completo`; aulas longas se estendem com prática ao vivo, não com mais slides. |
| Notas do apresentador | **Tópicos** da fala (lembretes curtos em lista), não roteiro completo. |
| Exemplos | **Genéricos.** As turmas variam e a abordagem muda na prática; o slide mostra exemplos do dia a dia sem contexto de uma turma específica, e o apresentador adapta na fala. |

## Rotas

Todas carregadas com `loadComponent` (lazy), para não pesar o bundle da home.

| Rota | Conteúdo |
|---|---|
| `/kit` | Catálogo: trilhas e aulas. |
| `/kit/:trilha/:aula` | Player, abre no slide 1. |
| `/kit/:trilha/:aula/:slide` | Player no slide N (base 1). Permite retomar ou mandar o link de um slide específico. |

- Slugs em PT, sem acento: `/kit/logica-de-programacao/variaveis-e-tipos`.
- Sintaxe na query: `?sintaxe=js|ts|java`. Ordem de prioridade: query, depois `localStorage` (`kit-sintaxe`), depois a primeira sintaxe da aula. Trocar a sintaxe atualiza a query sem recarregar.
- Roteiro na query: `?roteiro=essencial|completo`, com a mesma prioridade (`localStorage` `kit-roteiro`, padrão `completo`). O número do slide na URL conta só os slides do roteiro ativo; ao trocar de roteiro, o player fica no mesmo slide se ele existir no novo roteiro, ou no essencial anterior mais próximo.
- Etapa interna do slide **não** entra na URL (abrir um link sempre mostra o slide no estado inicial).
- Slug ou slide inexistente redireciona para `/kit` (ou para o último slide válido).
- O `**` atual continua redirecionando para `''`; as rotas `kit` entram antes dele em `app.routes.ts`.

## Dados

Novo diretório `src/app/kit/`:

```
kit/
  kit.data.ts            # interfaces + catálogo (trilhas, aulas)
  catalog/               # página /kit
  player/                # player de slides
  ui/                    # baú, etiqueta, item, bloco de código, exercícios
  decks/
    variaveis-e-tipos/
      deck.pt.ts         # slides, textos e notas em PT
      code.ts            # trechos de código por sintaxe
```

Interfaces (esboço):

```ts
export type Syntax = 'js' | 'ts' | 'java';

export interface Track {
  slug: string;
  lessons: Lesson[];
}

export interface Lesson {
  slug: string;
  syntaxes: Syntax[];
  /** Carrega o deck sob demanda (um chunk por aula). */
  load: () => Promise<Deck>;
}

export interface Deck {
  title: string;
  summary: string;
  slides: Slide[];
}

export interface Slide {
  /** Componente visual do slide (capa, baú, código, exercício...). */
  kind: SlideKind;
  /** `core` aparece em todos os roteiros; `extra` só no roteiro Completo. */
  depth: 'core' | 'extra';
  /** Sem valor, vale para todas as sintaxes da aula; com valor, só aparece nelas. */
  syntaxes?: Syntax[];
  /** Quantas etapas o slide tem; avançar percorre as etapas antes de trocar de slide. */
  steps: number;
  /** Tópicos da fala (lembretes curtos). */
  notes: string[];
  /** Dados específicos do tipo de slide (textos, trechos de código). */
  data: unknown; // tipado por `kind` via union discriminada
}
```

- Títulos e resumos das trilhas e aulas **no catálogo** saem do dicionário (chave `kit.tracks`), para o catálogo ficar trilíngue mesmo com o conteúdo em PT. O conteúdo de cada slide fica em `deck.pt.ts`, fora do `Dictionary` (carregado sob demanda, não pesa no bundle inicial).
- Trechos de código: `Record<Syntax, CodeLine[]>`, com **tokens marcados por papel** (`keyword`, `type`, `name`, `value`, `operator`, `punct`, `comment`), escritos à mão. Sem biblioteca de highlight. O papel do token define a cor e liga o código à metáfora: `name` = cor da etiqueta, `value` = cor do item, `type` = cor do baú.
- Uma aula que não suporta uma sintaxe não mostra essa opção. Um slide sem código não muda com a sintaxe.

## Card da ProWay

- `Experience` ganha `kitPath?: string` (rota interna, ex.: `'/kit'`). Constante neutra `kitPaths` em `home.data.ts`, no mesmo padrão de `projectUrls`; os três dicionários usam `kitPath: kitPaths.root` no item ProWay.
- O botão reaproveita o visual do botão "Visitar" (pílula `bg-raised`, `shadow-raised`, `font-mono`), mas:
  - usa `routerLink` (navegação interna, **mesma aba**, sem `target="_blank"` e sem o sr-only de nova aba);
  - rótulo do dicionário em vez de `displayUrl()`: EN "Teaching kit", FR "Trousse pédagogique", PT "Kit de ensino";
  - seta `→` em vez de `↗` (indica navegação interna).
- Card com `url` e `kitPath` mostra os dois botões lado a lado (não é o caso da ProWay hoje, mas o componente aceita).

## Catálogo (`/kit`)

- Header do site mantido (logo leva para a home, toggle `EN | FR | PT` funciona).
- Título e introdução curta do kit, link "voltar ao portfólio".
- Uma seção por trilha; cada aula é um card neumórfico com título, resumo, faixa de duração ("10 min a 4 h"), quantidade de slides de cada roteiro (ex.: "10 essenciais · 25 no total") e as sintaxes disponíveis (chips com o `tech-icon` de JavaScript, TypeScript e Java).
- O card da aula tem seletores de sintaxe e de roteiro e o botão "Apresentar", que abre o player já com `?sintaxe=` e `?roteiro=`.
- Só aparecem aulas publicadas (sem "em breve").

## Player

### Layout
- Página própria, **sem** o header do site: o slide ocupa a tela. Palco 16:9 centralizado em fundo `ink`, escalado para caber na janela (mesmo layout em projetor e notebook). No celular, o palco ocupa a largura e os controles ficam abaixo.
- Barra inferior discreta (some após 3 s sem mouse, volta ao mover): voltar ao kit, título da aula, seletor de sintaxe `JS | TS | Java`, seletor de roteiro `Essencial | Completo`, contador `3 / 25`, botão tela cheia, botão notas.
- Barra de progresso fina no topo, em `accent`.
- Slides `extra` têm um selo discreto no canto ("Aprofundamento" ou "Curiosidade", texto do deck), para o apresentador saber que pode pular.

### Navegação
| Tecla | Ação |
|---|---|
| `→`, `Espaço`, `PageDown`, clique no palco | Próxima etapa; na última etapa, próximo slide |
| `←`, `PageUp` | Etapa anterior; na primeira, slide anterior (abre na última etapa) |
| `Home` / `End` | Primeiro / último slide |
| `F` | Tela cheia (Fullscreen API) |
| `N` | Abre a janela do apresentador |
| `1`, `2`, `3` | Troca a sintaxe para JS, TS, Java |
| `R` | Alterna o roteiro Essencial / Completo |
| `Esc` | Sai da tela cheia |

- Swipe horizontal no toque.
- Teclas ignoradas quando o foco está num exercício (para não avançar ao interagir).

### Etapas e animações
- Cada slide tem N etapas; o componente do slide recebe `step` (signal) e decide o que mostrar. Ex.: etapa 1 o baú aparece, etapa 2 o item entra no baú, etapa 3 a etiqueta é colada.
- Troca de slide com transição suave (View Transitions, já habilitado no router, ou CSS). Animações dentro do slide em CSS (`transition`, `@keyframes`) com `animate.enter` / `animate.leave` do Angular 20, **sem** `@angular/animations`.
- `prefers-reduced-motion`: sem movimento, só fade curto; o conteúdo de cada etapa aparece igual.
- Ilustrações em **SVG inline** como componentes (`kit-chest`, `kit-label`, `kit-item`), nas cores do tema. Baú com tampa que abre, etiqueta que "cola" com leve rotação, item que cai dentro.

### Notas do apresentador
- `N` abre uma janela separada (`/kit/:trilha/:aula/apresentador`) com: slide atual em miniatura, próximo slide, notas do slide em tópicos, cronômetro e os mesmos controles.
- Essa rota é declarada **antes** de `/kit/:trilha/:aula/:slide` para `apresentador` não ser lido como número de slide.
- Janela principal e janela do apresentador sincronizadas por `BroadcastChannel` (slide, etapa e sintaxe). Navegar em qualquer uma move as duas.
- A turma nunca vê as notas na tela principal.

### Exercícios interativos
- Slides do tipo exercício, sem nota nem pontuação salva: feedback imediato no próprio slide (certo/errado com explicação curta).
- Arrastar e soltar **com alternativa por teclado e clique**: selecionar o item, depois o baú de destino. `aria-live` anuncia o resultado.
- Botão "reiniciar" no slide.

## Aula 1: Variáveis e Tipos de Dados (roteiro)

Texto curto em cada slide; a explicação vem da animação e dos tópicos das notas. Exemplos genéricos do dia a dia (placar, nome, preço, idade), sem contexto de turma.

- **Essencial (E):** 10 slides, cerca de 10 min. Fecha o tema sozinho: o que é variável, nome, valor, tipo e como se escreve na linguagem escolhida.
- **Completo (E + A):** 26 slides. Os aprofundamentos (A) entram entre os essenciais, no ponto em que o assunto pede, e trazem detalhes, curiosidades e exercícios. Uma aula de 4 h usa o roteiro Completo como espinha e preenche o tempo com prática ao vivo nos exercícios e no editor.
- Slides marcados com uma sintaxe só aparecem quando ela está ativa (campo `syntaxes?: Syntax[]` no `Slide`); os demais valem para as três.

| # | Roteiro | Slide | Etapas (o que a animação mostra) |
|---|---|---|---|
| 1 | E | Capa: "Lógica de Programação · Variáveis e Tipos de Dados" | Título entra, baú fechado ao fundo |
| 2 | E | Por que guardar coisas? | Placar de um jogo, nome de quem entrou, preço no carrinho: o programa precisa lembrar |
| 3 | A | A memória é um depósito de baús | Fileira de baús vazios, cada um com um número de endereço |
| 4 | E | Guardar um valor | Baú abre, item `25` cai dentro, tampa fecha |
| 5 | E | Dar um nome: a etiqueta | Etiqueta `idade` é colada no baú |
| 6 | A | Curiosidade: a etiqueta é um apelido | O número do endereço some atrás da etiqueta: o nome existe para pessoas, a máquina usa o endereço |
| 7 | E | Do baú para o código | Código da declaração aparece; cada parte acende junto da sua parte no baú (etiqueta = nome, item = valor, formato do baú = tipo) |
| 8 | A | Ler o valor | Abrir o baú pela etiqueta e usar o item (`console.log` / `System.out.println`) |
| 9 | E | Trocar o conteúdo | Item antigo sai, item novo entra, etiqueta continua a mesma |
| 10 | A | Usar o próprio valor para mudar | `pontos = pontos + 10`: o item sai, ganha 10, volta ao mesmo baú; atalhos `+=` e `++` |
| 11 | A | Baú trancado: constantes | Cadeado; tentar trocar o item gera aviso (`const` / `final`) |
| 12 | A | Baú sem nada dentro | Declarar sem valor: `undefined` (JS/TS), erro de "não inicializada" para variável local (Java) |
| 13 | E | Tipos: cada baú tem um formato | Baús para texto, número inteiro, número decimal, verdadeiro/falso |
| 14 | E | Tipos na linguagem escolhida | Tabela com os tipos da sintaxe ativa |
| 15 | A | Exercício: cada item no seu baú | Arrastar `"Ana"`, `42`, `3.14`, `true` para o baú certo |
| 16 | A | Item errado no baú errado | Texto num baú de número: erro de compilação (TS, Java) ou o tipo muda em tempo de execução (JS) |
| 17 | A | Curiosidade: `"5"` não é `5` | Aspas transformam o item em texto: `"5" + 5` vira `"55"` (JS/TS) ou concatenação em Java |
| 18 | A | Curiosidade: `0.1 + 0.2` | Resultado `0.30000000000000004` nas três linguagens; decimal guardado em binário não é exato |
| 19 | A | Curiosidade: o baú tem tamanho | Java: `int` estoura em 2.147.483.647 e volta para negativo. JS/TS: `Number.MAX_SAFE_INTEGER` e o `BigInt` |
| 20 | A | Curiosidade: `typeof null` (só JS/TS) | `typeof null` responde `"object"`, um erro histórico mantido por compatibilidade |
| 21 | A | Curiosidade: `char` e `String` (só Java) | Aspas simples guardam um caractere, aspas duplas guardam texto |
| 22 | E | Boas etiquetas | Nomes descritivos, camelCase, regras de nome; exemplos bons e ruins |
| 23 | A | Convenções pelo mundo | camelCase (JS, TS, Java), `UPPER_CASE` para constantes, snake_case em outras linguagens; por que a convenção importa em equipe |
| 24 | A | Exercício: qual o valor final? | Sequência de atribuições; turma prevê, a animação revela passo a passo |
| 25 | A | Desafio: troque os itens de dois baús | Trocar valores de `a` e `b`; a animação mostra a necessidade de um terceiro baú auxiliar |
| 26 | E | Resumo | Baú = variável, etiqueta = nome, item = valor, formato = tipo |

Os números são a ordem no roteiro Completo. No Essencial, o player numera de 1 a 10 só os slides E. Slides 20 e 21 dependem da sintaxe, então o total visível no Completo é 25.

### Diferenças por sintaxe (o que muda nos slides de código)

| Conceito | JavaScript | TypeScript | Java |
|---|---|---|---|
| Declarar | `let idade = 25;` | `let idade: number = 25;` | `int idade = 25;` |
| Constante | `const PI = 3.14;` | `const PI: number = 3.14;` | `final double PI = 3.14;` |
| Texto | `let nome = "Ana";` | `let nome: string = "Ana";` | `String nome = "Ana";` |
| Inteiro / decimal | `number` (um só tipo) | `number` (um só tipo) | `int` / `double` |
| Verdadeiro/falso | `let ativo = true;` | `let ativo: boolean = true;` | `boolean ativo = true;` |
| Exibir | `console.log(idade);` | `console.log(idade);` | `System.out.println(idade);` |
| Tipo errado | Aceita, o tipo muda (`typeof`) | Erro de compilação | Erro de compilação |

- Java: exemplos dentro de `main` só onde for indispensável; nos demais slides, a linha isolada (com uma nota explicando).
- JS: usar `let`/`const`; `var` só aparece como nota do apresentador ("por que não usar").
- TS: mostrar a anotação explícita nos slides 6 e 10; no 11 comentar a inferência (`let idade = 25` já é `number`).

## Textos (dicionários)

Nova chave de topo `kit` no `Dictionary` (EN, FR-CA, PT), com: rótulo do botão do card, título e introdução do catálogo, títulos e resumos de trilhas e aulas, rótulos dos controles do player e dos atalhos, `aria-label` de todos os botões, aviso "conteúdo em português", textos da janela do apresentador e mensagens dos exercícios que são do player (não da aula). Regras de copy do projeto valem: sem travessão, FR com uso canadense.

## SEO

- O `effect` do `I18n` hoje define `title` e `meta description` globais. Passa a respeitar um título/descrição por rota (ex.: serviço `PageMeta` ou `title` da rota + `Meta`), com fallback para os da home.
- `/kit`: "Kit de ensino · Leno Borges"; aula: "Variáveis e Tipos de Dados · Kit de ensino · Leno Borges".
- Criar `public/sitemap.xml` (home, `/kit`, cada aula) e `public/robots.txt` apontando para ele.
- Observação: o site é SPA sem SSR. O Google renderiza JS, então indexa; outros buscadores e prévias de link (WhatsApp, LinkedIn) só leem o `index.html`. Prerender das rotas do kit fica como melhoria futura.

## Acessibilidade

- Cada slide é uma região com `aria-roledescription="slide"` e rótulo "Slide 3 de 16: título". Troca de slide anunciada via `aria-live="polite"`.
- Ilustrações com descrição textual (vinda do deck) para leitor de tela.
- Foco visível em todos os controles; contraste segue as regras do site (`accent-soft` para texto pequeno em azul).

## Testes

- Unitários (Jasmine, zoneless): navegação do player (etapas, limites, slide na URL), prioridade de sintaxe e de roteiro (query > localStorage > padrão), filtro de slides por roteiro e sintaxe, posição ao trocar de roteiro, redirecionamento de slug inválido, paridade de sintaxes nos trechos de código (toda aula com `syntaxes: ['js','ts','java']` tem código nas três para cada slide de código).
- Manual no Chrome: botão do card, catálogo nos 3 idiomas, aula completa com teclado, tela cheia, janela do apresentador sincronizada, exercícios com mouse e teclado, `prefers-reduced-motion`.
