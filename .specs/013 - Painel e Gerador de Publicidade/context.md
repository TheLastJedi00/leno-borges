# 013 - Painel e Gerador de Publicidade

## Objetivo

Criar uma **área restrita** do portfólio, de acesso único (só o dono), com:

1. **Login** acessado por um botão discreto no header e no rodapé.
2. **Dashboard** de entrada, pensado como o início de um pequeno CRM pessoal. Nesta spec ele só tem um módulo ativo.
3. **Gerador de publicidade**, o primeiro módulo: o Gemini escreve a copy de peças para Instagram e LinkedIn a partir de um tema e da identidade visual da marca; o front monta a arte em HTML com os tokens da marca e exporta em PNG. Uma imagem de fundo gerada pelo Gemini é opcional.

O **Supabase** é o backend da área: auth, banco de dados, storage e Edge Functions. O site continua no Firebase Hosting.

## Decisões

| Tema | Decisão | Por quê |
|---|---|---|
| SDK no front | `@supabase/supabase-js` direto no Angular. O prompt citava "SDK firebase", mas o mesmo prompt define o Supabase como auth, banco e storage | Um só backend para a área restrita |
| Projeto Supabase | `Leno Borges` (ref `jhipjjtfyzjnezwyzfgq`, `us-west-2`), já criado | |
| Chave do Gemini | Fica em secret de uma **Supabase Edge Function**; nunca no bundle | O site é público: chave no JS seria usada por qualquer um |
| Saída do gerador | Gemini gera **copy estruturada (JSON)**; a arte é um **template HTML** com os tokens da marca, exportado em PNG. Fundo gerado por IA é **opcional** | Fidelidade total à marca (cores, fontes, logo); texto em imagem gerada por IA sai torto |
| Entrada | Tema/briefing + formato + rede; **3 variações** por geração | |
| Idioma da área restrita | Só **PT-BR** (confirmado pelo dono), textos num arquivo local `admin.strings.ts`, fora dos dicionários | Economiza trabalho: só o dono usa. É uma exceção à regra do CLAUDE.md, que precisa ser anotada lá. O botão de acesso nas páginas públicas segue a regra (`aria-label` nos três dicionários) |
| Idioma das peças | Opcional na geração, entre os três do projeto: EN, FR-CA ou PT-BR (padrão EN, mercado Barrie/GTA) | As peças vão para o público do portfólio |
| Modelo | `GEMINI_MODEL=gemini-flash-latest`, raciocínio em **médio** (`GEMINI_THINKING_LEVEL=medium`) | Definido pelo dono |
| Secrets | Ficam em `supabase/functions/.env` (fora do git), que o dono cria a partir do `.env.example`. Vão para a função com `supabase secrets set --env-file supabase/functions/.env` | A função roda no Supabase, não no Firebase: o prompt dizia "env file para o firebase", mas o Firebase só hospeda o front e não recebe secret nenhum |
| Direção de arte | Templates desenhados com as skills `frontend-design` e `modern-web-design`, um tratamento por rede e formato. Paleta e neomorfismo da marca são o ponto de partida, não uma prisão | Pedido do dono: peças mais impactantes sem perder a marca |

## Escopo

### Dentro

- Login por e-mail e senha (`signInWithPassword`), logout e sessão persistida pelo SDK.
- Botão de acesso discreto no header e no rodapé.
- Rotas `/admin/**` lazy, protegidas por guard, com `noindex`.
- Dashboard com o card do gerador e espaço para módulos futuros.
- Gerador: formulário, Edge Function, 3 variações, preview, export PNG, fundo opcional por IA, histórico.
- Tabela, bucket e RLS no Supabase, versionados em `supabase/migrations`.

### Fora

- Cadastro, recuperação de senha pela UI e login social (o usuário é criado no painel do Supabase).
- Módulos de CRM (contatos, leads, propostas): só o espaço reservado no dashboard.
- Publicar direto nas redes (APIs da Meta/LinkedIn) e agendar posts.
- Export em PDF (formato de "documento" do LinkedIn) e ZIP do carrossel inteiro.
- Tradução da área restrita.
- Vídeo (Stories e Reels animados).

## Acesso

- **Header:** um botão só com ícone de cadeado (`h-8`, `text-faint`, hover `text-paper`), à esquerda do toggle de idioma. Sem texto visível; `aria-label` e `title` vêm dos dicionários (`header.admin`).
- **Rodapé:** um link "Área restrita" em `text-xs text-faint`, ao lado do copyright (texto em `footer.admin`, nos três dicionários).
- Os dois vão para `/admin`. Com sessão ativa, o guard deixa passar; sem sessão, redireciona para `/admin/login`.
- Nenhum indício de "admin" para robôs: `/admin` fica fora do `sitemap.xml`, entra como `Disallow` no `robots.txt` e as páginas recebem `<meta name="robots" content="noindex">`.

## Autenticação

- **Só um usuário.** O cadastro fica desligado no Supabase (Auth → *Allow new users to sign up* = off); o usuário do dono é criado à mão no painel.
- **Defesa em profundidade:** o RLS de todas as tabelas e do bucket compara `auth.uid()` com o dono, e a Edge Function confere que o JWT é do dono (secret `OWNER_USER_ID`). Se o cadastro for ligado por engano, um usuário novo não vê nem gera nada.
- **Configuração no front:** `src/environments/environment.ts` com `supabaseUrl` e `supabasePublishableKey`. As duas são públicas por desenho; a segurança vem do RLS.
- **Serviço `Auth`** (`providedIn: 'root'`): signals `session` e `user`, `signIn(email, senha)`, `signOut()`, ouvindo `onAuthStateChange`.
- **Guard `adminGuard`:** espera a sessão inicial carregar antes de decidir (sem piscar o login em quem já está logado).
- **Tela de login:** card `surface` com `shadow-raised` centralizado, logo, e-mail, senha e botão `accent-deep`. Erro genérico ("E-mail ou senha inválidos"), sem dizer qual dos dois.

## Rotas

| Rota | Componente | Guard |
|---|---|---|
| `/admin/login` | `AdminLogin` | Redireciona para `/admin` se já logado |
| `/admin` | `Dashboard` | `adminGuard` |
| `/admin/publicidade` | `AdGenerator` | `adminGuard` |

Tudo com `loadComponent`, antes do `**`, para não pesar o bundle da home. O SDK do Supabase só entra no chunk da área restrita: os botões de acesso são links simples e não importam o SDK.

## Dashboard

- Layout próprio, sem header/rodapé públicos: barra com logo, e-mail do dono e botão "Sair".
- Grade de cards de módulo (`surface`, `shadow-raised`, hover `shadow-raised-lg`):
  - **Gerador de publicidade**: ativo, leva a `/admin/publicidade`. Mostra o total de peças geradas.
  - **Em breve**: um card apagado reservado para os módulos do CRM.

## Gerador de publicidade

### Formatos

| Formato | Proporção | Tamanho do PNG | Redes | Peças por variação |
|---|---|---|---|---|
| **Stories** | 9:16 (retrato) | 1080×1920 | Instagram, LinkedIn | 1 |
| **Carrossel** | 1:1 (quadrado) | 1080×1080 | Instagram, LinkedIn | 3 a 10 slides (capa, conteúdo, fechamento com CTA) |
| **Post** | 3:4 (retrato) | 1080×1440 | Instagram, LinkedIn | 1 |

- **Stories:** o texto fica fora das faixas seguras de 250 px no topo e embaixo (lá ficam a interface do app e o campo de resposta).
- **Carrossel:** o primeiro slide é a capa com o gancho e o último é o CTA; os do meio levam um ponto cada.

### Formulário

- **Tema / briefing:** texto livre, obrigatório (ex.: "Kit de Ensino, aula de funções no ar").
- **Formato:** Stories, Carrossel ou Post.
- **Rede:** Instagram ou LinkedIn. Muda o texto sugerido e a direção de arte (ver "Texto por rede" e "Direção de arte").
- **Idioma:** EN, FR-CA ou PT-BR (padrão EN).
- **Nº de slides:** só no carrossel, de 3 a 10 (padrão 5).
- **Gerar fundo com IA:** checkbox, desligado por padrão.

### Fluxo

1. O front chama a Edge Function `generate-ad` com o JWT da sessão.
2. A função valida o dono, monta o prompt com a identidade visual, o guia da rede e as regras de texto, e chama o `GEMINI_MODEL` com **saída estruturada** (`responseSchema`) e raciocínio médio. Ele devolve 3 variações, cada uma com o texto das peças e o texto sugerido da publicação.
3. A função passa as variações pelo **verificador de texto** (ver "Regras de texto"). Se houver violação, pede uma nova resposta ao Gemini uma vez, listando o que violou.
4. Se o fundo com IA estiver marcado, a função chama o `GEMINI_IMAGE_MODEL` **uma vez por geração**, na proporção do formato, sem texto na imagem. A imagem vai para o Storage e todas as variações usam o mesmo fundo.
5. A função grava a geração em `ad_generations` e devolve o registro.
6. O front renderiza cada variação no template HTML do formato e mostra o preview em escala (`transform: scale`), lado a lado.
7. Cada variação mostra o texto sugerido e as hashtags com um botão **Copiar**, e cada peça tem **Baixar PNG**. O PNG também é salvo no Storage. Avisos do verificador (se sobrarem) aparecem acima do texto.
8. **Gerar de novo** com o mesmo formulário cria outra geração; o histórico guarda todas.

### Saída do Gemini (contrato)

```ts
interface AdVariation {
  angle: string;            // a ideia da variação, em uma frase (para escolher entre as 3)
  slides: AdSlide[];        // 1 para stories e post; N para carrossel
  caption: string;          // texto sugerido da publicação, no molde da rede
  hashtags: string[];       // 3 a 8 no Instagram, 0 a 3 no LinkedIn
  warnings?: string[];      // preenchido pela função, não pelo Gemini
}

interface AdSlide {
  kicker?: string;          // contexto curto acima do título, em caixa normal, opcional
  title: string;            // até ~8 palavras
  body?: string;            // até ~30 palavras
  cta?: string;             // só no último slide / no stories
}
```

A função valida o JSON contra o schema antes de gravar. Se não bater, tenta uma vez e depois devolve erro.

### Texto por rede

O Gemini escreve o texto sugerido da publicação (`caption`) num molde diferente para cada rede. Os moldes ficam em `supabase/functions/_shared/networks.ts` e vão no prompt.

| | LinkedIn | Instagram |
|---|---|---|
| Voz | Profissional e direta, primeira pessoa, de quem fez o trabalho | Conversa, mais leve, frases curtas |
| Abertura | Uma linha de até ~150 caracteres (o que aparece antes do "ver mais") com um fato, um resultado ou uma tensão concreta | Uma linha de até ~125 caracteres que faz parar de rolar |
| Corpo | 600 a 1.300 caracteres em parágrafos de 1 a 3 linhas: contexto, o que foi feito, o que se aprendeu, um dado ou decisão concreta | 150 a 500 caracteres; o detalhe fica na arte, o texto complementa |
| Fecho | Pergunta para comentar ou CTA direto (ver o projeto, falar comigo) | CTA de ação da rede (salvar, comentar, link na bio) |
| Hashtags | 0 a 3, no fim | 3 a 8, no fim, mistura de nicho e local (Barrie/GTA no EN/FR) |
| Emojis | No máximo 1 | No máximo 2 |
| Arte | Mais densa: o carrossel ensina ou prova algo | Mais impacto: uma ideia por peça, título grande |

### Regras de texto (anti "AI slop")

O prompt diz as regras com todas as letras, e a função as confere antes de devolver o resultado (verificador em `supabase/functions/_shared/copy-lint.ts`, com testes).

| Regra | Texto sugerido (`caption`, `hashtags`) | Peças (`kicker`, `title`, `body`, `cta`) |
|---|---|---|
| Travessão (`—`), meia-risca (`–`) e hífen solto entre espaços (` - `) | Proibido | **Estritamente proibido** |
| Emojis | No máximo 1 (LinkedIn) ou 2 (Instagram), nunca em sequência | **Estritamente proibido** |
| Clichês | Proibidos | Proibidos |
| Regras de copy do projeto | Sem "FinOps", sem prometer custo zero, FR no uso canadense, palavras-chave Barrie/GTA no EN/FR | Idem |

- **Lista de clichês** (`_shared/cliches.ts`, nos três idiomas, ampliável): "o jogo virou", "virar o jogo", "mudar o jogo", "game changer", "próximo nível", "next level", "no mundo de hoje", "em um mundo cada vez mais", "in today's fast-paced world", "à l'ère du numérique", "não é sobre X, é sobre Y" (e "it's not about X, it's about Y"), "spoiler:", "bora", "vamos juntos", "jornada", "mergulhe", "let's dive in", "delve", "unlock", "desbloqueie", "revolucionar", "transformador", "sem mais delongas", "a verdade é que", "e o melhor:", "think outside the box".
- O prompt também pede: frases concretas em vez de adjetivos, um dado ou fato real por peça quando o tema permitir, nada de pergunta retórica na abertura, nada de três adjetivos em sequência.
- **Se a resposta violar:** a função pede de novo uma vez, listando as violações. Se ainda sobrar violação, nas **peças** ela corrige sozinha (remove emojis e troca travessões por vírgula) e no **texto sugerido** ela só marca em `warnings`, para o dono decidir.
- **Última barreira no front:** os templates passam o texto pela mesma limpeza (sem emoji e sem travessão) antes de renderizar. Uma peça nunca sai com emoji nem com travessão.

### Identidade visual enviada ao Gemini

- A fonte é `.specs/brand/identidade-visual.md`. Uma versão condensada (essência, tom de voz, paleta com papéis, tipografia, fazer/não fazer) vira `supabase/functions/_shared/brand.ts`, importado pela função. Os dois arquivos têm de andar juntos: uma mudança de marca altera ambos na mesma spec.
- O prompt também leva o guia da rede escolhida e as regras de texto (seções acima).
- O prompt da imagem de fundo pede: abstrato/técnico, base grafite `#1C1C1E`, acento azul `#3986FF` com parcimônia, sem texto, sem letras, sem emojis, sem logos, sem pessoas, área calma onde o template põe o texto (o centro no post e no carrossel, o terço do meio no stories).

### Direção de arte

Os templates são desenhados na fase 5 com as skills **`frontend-design`** e **`modern-web-design`**, partindo deste plano. Paleta, fontes e neomorfismo leve são o ponto de partida, não uma prisão: vale sair deles quando a peça ganha impacto, desde que a peça continue sendo reconhecida como da marca.

**Base de tokens**

- **Cores:** `ink` `#1C1C1E` (fundo), `surface` `#232326` (placas), `paper` `#F2F3F5` (título), `muted` `#A3A7AD` (corpo), `accent` `#3986FF` e `accent-deep` `#2563D9` (campos e formas de cor). Fora da paleta, só um degradê do azul da logo (`#488FFF` → `#3986FF`) em formas grandes.
- **Tipos:** `Outfit` no título, tratado como forma da peça (escala grande, peso 600 a 700, entrelinha apertada, pode sangrar a borda no Instagram); `DM Sans` no corpo; `JetBrains Mono` só onde há dado ou sequência (o `n/N` do carrossel, um trecho de código real).
- **Neomorfismo:** a placa `surface` com `shadow-raised` em escala de peça (sombras maiores que as do site, para ler no celular) segura o CTA ou um dado. No máximo uma placa por peça.

**Princípios**

- **Uma coisa memorável por peça.** O título gigante, ou um campo azul, ou a placa em relevo. O resto fica quieto.
- **Cor em forma, não em palavra.** O azul aparece em blocos, linhas e campos, nunca destacando uma palavra solta do título.
- **Estrutura que informa.** Numeração só no carrossel (é uma sequência). Sem rótulo em caixa alta espaçada acima de tudo, sem seta `→` colada no CTA, sem `·` juntando metadados.
- **Logo** (`logo.svg`) sempre no mesmo canto, com a área de respiro da marca; no fundo azul, `logo-mono.svg` em `paper`.

**Por rede**

| | LinkedIn | Instagram |
|---|---|---|
| Composição | Editorial: alinhado à esquerda, margens largas (96 px), hierarquia clara título → corpo → dado | Pôster: título em escala máxima, pode sangrar a borda, contraste alto |
| Cor | Grafite dominante, azul em detalhes (linha, número, placa) | Campos de `accent-deep` ocupando parte da peça, alternando com grafite |
| Densidade | Corpo de até ~30 palavras por slide, legível a 1/3 do tamanho | Título e, no máximo, uma frase |

**Por formato**

| Formato | Plano |
|---|---|
| **Stories 9:16** | Pilha vertical: título no terço do meio, CTA numa placa em relevo logo acima da faixa segura de baixo. Nada de texto nas faixas de 250 px do topo e de baixo |
| **Carrossel 1:1** | Capa com o gancho em escala máxima; slides do meio numa grade fixa (mesma margem e mesma linha de base em todos); último slide com o CTA na placa. No Instagram, uma forma azul contínua atravessa a borda entre slides, para o deslize parecer uma peça só. No LinkedIn, uma barra de progresso fina embaixo, com o `n/N` |
| **Post 3:4** | Uma ideia: título grande no terço de cima e um elemento de apoio embaixo (dado, placa ou trecho de código real) |

**Com fundo de IA:** a imagem cobre a peça e recebe um véu `ink` em degradê (regra da marca: nada de imagem sem véu escuro), para o texto manter contraste AA. A placa e os campos azuis continuam por cima.

### Templates HTML

- Um componente por formato (`ad-story`, `ad-carousel-slide`, `ad-post`) com variação por rede (`network` como `input()`), renderizado no tamanho real (1080 px de largura) e reduzido só no preview.
- O título se ajusta ao espaço (reduz a fonte em passos até caber, com piso mínimo), para um título longo não estourar a peça.
- Revisão visual por screenshot de cada formato nas duas redes antes de fechar a fase (crítica da skill `frontend-design`).

### Export PNG

- Biblioteca `html-to-image` (`toPng`) no elemento em tamanho real, com `pixelRatio: 1`.
- Antes do export, espera `document.fonts.ready` e embute as fontes do Google Fonts. Sem isso o PNG sai com fonte de sistema.
- A imagem de fundo vem do Storage por URL assinada; o `fetch` como data URL evita canvas "tainted" por CORS.
- Nome do arquivo: `<formato>-<rede>-<aaaa-mm-dd>-v<n>[-<slide>].png`.

## Banco e Storage

### Tabela `ad_generations`

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `owner_id` | `uuid` | `references auth.users`, default `auth.uid()` |
| `created_at` | `timestamptz` | default `now()` |
| `theme` | `text` | briefing digitado |
| `format` | `text` | `check in ('story','carousel','post')` |
| `network` | `text` | `check in ('instagram','linkedin')` |
| `lang` | `text` | `check in ('en','fr','pt')` |
| `slide_count` | `int` | 1 ou 3 a 10 |
| `variations` | `jsonb` | `AdVariation[]` |
| `background_path` | `text` null | caminho no bucket |
| `model` | `text` | modelo usado, para comparar resultados depois |

RLS ligado, uma policy por operação: `owner_id = auth.uid()` (select, insert, delete; sem update).

### Bucket `ads` (privado)

- `<owner_id>/backgrounds/<generation_id>.png` e `<owner_id>/exports/<generation_id>/v<n>[-<slide>].png`: o primeiro nível é o UUID do dono, e as policies comparam essa pasta com `auth.uid()` (a função envia com a chave de serviço, e esses arquivos não teriam `owner_id`).
- Policies em `storage.objects`: só o dono lê, envia e apaga, e só no bucket `ads`.
- Leitura por URL assinada (expira em 1 h).

### Histórico

Lista das gerações (mais novas primeiro) abaixo do formulário: data, tema, formato e rede. Abrir uma geração recarrega as variações no preview, sem chamar o Gemini. Excluir uma geração remove também os arquivos dela no Storage.

## Edge Function `generate-ad`

- Deno/TypeScript em `supabase/functions/generate-ad/`, deploy pelo MCP/CLI do Supabase.
- **Secrets** (em `supabase/functions/.env`, enviados com `supabase secrets set --env-file supabase/functions/.env`):

  | Secret | Valor |
  |---|---|
  | `GEMINI_API_KEY` | O dono preenche (Google AI Studio) |
  | `GEMINI_MODEL` | `gemini-flash-latest` |
  | `GEMINI_THINKING_LEVEL` | `medium` |
  | `GEMINI_IMAGE_MODEL` | `gemini-2.5-flash-image` (conferir na execução com `models.list` se há versão mais nova) |
  | `OWNER_USER_ID` | UUID do usuário criado no Supabase Auth |

  Os modelos vêm de secret para trocar sem novo deploy. `GEMINI_THINKING_LEVEL` vai em `generationConfig.thinkingConfig.thinkingLevel`. Se o alias `gemini-flash-latest` apontar para um modelo que só aceita `thinkingBudget`, a função converte `medium` para um orçamento médio. Os dois caminhos têm teste. `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já vêm na função e não entram no `.env`.
- **Entrada:** `{ theme, format, network, lang, slideCount?, withBackground }`, validada (tema de 3 a 500 caracteres; `slideCount` só no carrossel).
- **Erros:** 401 sem JWT válido, 403 se não for o dono, 422 entrada inválida, 502 se o Gemini falhar ou devolver JSON fora do schema. Mensagens em PT.
- **CORS:** só `http://localhost:4200`, `https://lenoborges.com.br` e `https://www.lenoborges.com.br`.
- **TDD** (regra do backend): a suíte `deno test` vem antes da implementação e cobre validação de entrada, checagem do dono, montagem do prompt (identidade, guia da rede e regras de texto), conversão do nível de raciocínio, validação do schema, verificador de texto (travessões, emojis, clichês nos três idiomas), retry com as violações, correção das peças e `warnings` do texto sugerido. O Gemini é mockado.

## Testes do front

- `Auth` e `adminGuard` com o cliente Supabase mockado (com sessão, sem sessão, carregando).
- Templates: cada formato renderiza no tamanho certo (1080×1920, 1080×1080, 1080×1440) e mostra o `n/N` no carrossel.
- Header e rodapé: o botão de acesso existe e aponta para `/admin`.
- Teste manual no Chrome (regra do projeto): login, guard, gerar os três formatos, fundo com IA, baixar PNG, histórico e logout.

## Fases

As tarefas de cada fase estão em `tasks.md`.

1. **Infra Supabase:** migration da tabela, bucket e policies, cadastro desligado, `.env` da função, `environment.ts` e `supabase-js`.
2. **Auth e acesso:** serviço `Auth`, `adminGuard`, tela de login, botões no header e no rodapé, `robots.txt` e `noindex`.
3. **Dashboard:** layout da área restrita, cards e logout.
4. **Edge Function (TDD):** testes primeiro, depois `brand.ts`, guias por rede, verificador de texto, prompt, Gemini texto e imagem, gravação, secrets e deploy.
5. **Gerador:** formulário, direção de arte e templates dos três formatos nas duas redes, preview, export PNG e upload.
6. **Histórico** e atualização do CLAUDE.md (área restrita, Supabase, exceção de i18n, comandos da função).

## Pendências para o dono

- Criar o usuário no painel do Supabase e informar o `OWNER_USER_ID`.
- Criar `supabase/functions/.env` a partir do `.env.example` e preencher `GEMINI_API_KEY` (Google AI Studio).
