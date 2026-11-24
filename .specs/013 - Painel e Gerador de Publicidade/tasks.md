# 013, Painel e Gerador de Publicidade, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/013-painel-publicidade`, criada a partir da `main`.

## Antes de começar (dono)
- [x] Criar o usuário no Supabase Auth e anotar o UUID
- [x] Preencher `supabase/functions/.env` (já criado a partir do `.env.example`, fora do git): `GEMINI_API_KEY` e `OWNER_USER_ID`
- [x] Desligar o cadastro público no Auth (conferido: `disable_signup = true`)

## Fase 1, `feat/admin-infra`, Supabase
- [x] 1.1 Estrutura `supabase/` (`config.toml` com `enable_signup = false` e `verify_jwt` na função) e `supabase/functions/.env.example` versionado
- [x] 1.2 Migration `ad_generations` com `check`s, RLS e policies por operação (`owner_id = auth.uid()`)
- [x] 1.3 Migration do bucket privado `ads` e das policies em `storage.objects` (por pasta do dono)
- [x] 1.4 Cadastro de novos usuários desligado no Auth; `get_advisors` (security) sem alerta nas tabelas novas
- [x] 1.5 `@supabase/supabase-js`, `src/environments/environment.ts` (URL e publishable key) e o cliente, carregado só no chunk de `/admin`

## Fase 2, `feat/admin-auth`, login e acesso
- [x] 2.1 Serviço `Auth` (signals `session` e `user`, `signIn`, `signOut`, `onAuthStateChange`), com testes
- [x] 2.2 `adminGuard` que espera a sessão inicial, e o guard inverso do login (`guestGuard`), com testes
- [x] 2.3 Rotas `/admin`, `/admin/login` e `/admin/publicidade` lazy, antes do `**`
- [x] 2.4 Tela de login (PT-BR, `admin.strings.ts`), erro genérico, com testes
- [x] 2.5 Cadeado no header e link "Área restrita" no rodapé; `header.admin` e `footer.admin` nos três dicionários; testes dos dois links
- [x] 2.6 `noindex` nas páginas de `/admin`, `Disallow: /admin` no `robots.txt`, fora do `sitemap.xml`

## Fase 3, `feat/admin-dashboard`, dashboard
- [x] 3.1 Layout da área restrita (barra com logo, e-mail e "Sair")
- [x] 3.2 Cards de módulo: Gerador de publicidade (com o total de gerações) e "Em breve"

## Fase 4, `feat/admin-generate-ad`, Edge Function (TDD: testes antes do código)
- [x] 4.1 Suíte `deno test` da função com o Gemini mockado: entrada, dono (401/403), prompt, schema, retry, nível de raciocínio, verificador, correção das peças e `warnings`
- [x] 4.2 `_shared/brand.ts` condensado de `.specs/brand/identidade-visual.md`
- [x] 4.3 `_shared/networks.ts`: moldes de texto do LinkedIn e do Instagram (voz, abertura, corpo, fecho, hashtags, emojis)
- [x] 4.4 `_shared/cliches.ts` (três idiomas) e `_shared/copy-lint.ts`: travessão, meia-risca, hífen solto, emojis (zero nas peças, limite no texto sugerido), clichês
- [x] 4.5 Montagem do prompt: identidade, guia da rede, regras de texto com todas as letras, idioma escolhido, formato e nº de slides
- [x] 4.6 Chamada ao `GEMINI_MODEL` (`gemini-flash-latest`) com `responseSchema` e `thinkingLevel` vindo de `GEMINI_THINKING_LEVEL` (`medium`), com a conversão para `thinkingBudget` se o modelo exigir
- [x] 4.7 Fundo opcional com o `GEMINI_IMAGE_MODEL` na proporção do formato e upload em `<dono>/backgrounds/`; conferido com `models.list`: `gemini-3.1-flash-image`
- [x] 4.8 Gravação em `ad_generations`, CORS (`localhost:4200`, `lenoborges.com.br`, `www.lenoborges.com.br`) e erros em PT
- [x] 4.9 Secrets cadastrados e deploy da função (versão 1, ativa); teste de fumaça em produção: preflight 204, origem estranha 403, sem token 401, token que não é usuário 401
- [x] 4.9 (resto) Teste real com um tema em cada formato: o mesmo `handler` rodado localmente com o Gemini de verdade (só autenticação e gravação simuladas, chave lida do `.env`). Stories/Instagram/PT com fundo (25 s, fundo JPEG de 439 KB), Carrossel/LinkedIn/EN com 5 slides (34 s) e Post/LinkedIn/FR (18 s): todos HTTP 200, 3 variações com o número certo de slides, nenhuma peça com emoji ou travessão, nenhum `warning`, texto sugerido no tamanho da rede (Instagram 313 a 321 caracteres, LinkedIn 614 a 898)

## Fase 5, `feat/admin-ad-generator`, gerador
- [x] 5.1 Formulário (tema, formato, rede, idioma EN/FR-CA/PT-BR, nº de slides, fundo com IA) e chamada à função com estado de carregando e erro
- [x] 5.2 Direção de arte com a skill `frontend-design`, a partir do plano do `context.md`: placa em relevo em escala de peça (LinkedIn), campos `accent-deep` (Instagram), tipografia em escala de peça
- [x] 5.3 Template `ad-story` (9:16, faixas seguras de 250 px) nas duas redes
- [x] 5.4 Template `ad-carousel-slide` (1:1): capa, meio em grade fixa, CTA; horizonte contínuo no Instagram, barra de progresso e `n/N` no LinkedIn
- [x] 5.5 Template `ad-post` (3:4) nas duas redes
- [x] 5.6 Título em degraus de tamanho e limpeza final de emoji e travessão antes de renderizar, com testes
- [x] 5.7 Fundo de IA com véu `ink` em degradê (nos templates) e carregado do Storage como data URL
- [x] 5.8 Preview em escala, texto sugerido e hashtags com "Copiar", `warnings` visíveis
- [x] 5.9 Export PNG (`html-to-image`, espera `document.fonts.ready`, fundo como data URL) no tamanho certo e cópia em `<dono>/exports/<geração>/`
- [x] 5.10 Revisão visual por screenshot dos 3 formatos × 2 redes, com e sem fundo, e ajustes

## Fase 6, `feat/admin-historico`, histórico e documentação
- [x] 6.1 Lista das gerações, reabrir sem chamar o Gemini, excluir (dois cliques) com os arquivos do Storage, com testes
- [x] 6.2 CLAUDE.md: área restrita, Supabase (cliente, migrations, função, secrets via `--env-file`), exceção de i18n do `/admin`, regras de texto das peças

## Encerramento
- [x] Merge das fases na branch `release/013-painel-publicidade`
- [x] `npm run build` e `npm test` sem falhas (235 testes); `deno test` da função sem falhas (56 testes); `main` do bundle sem o `supabase-js` (bundle inicial 411,93 kB)
- [x] Homologado no Chrome (porta 4211, ver decisões): cadeado no header e link no rodapé, guard sem sessão leva ao login, `noindex` e título "Painel" no `/admin`, home restaura título e tira o `noindex`; as 3 peças × 2 redes × com/sem fundo na página de revisão

## Validação do dono (fora da execução)

Pedida pelo dono para o fim ("ao fim eu valido"); precisa do login dele, que não passa pelo agente. Roteiro: login com erro e com sucesso, dashboard, gerar os 3 formatos nas 2 redes e nos 3 idiomas, fundo com IA, baixar PNG (dimensões certas), histórico, excluir, sair. Subir com `npx ng serve --port 4211` (ou `npm start` se a 4200 estiver livre).

## Decisões tomadas na execução

- **Supabase CLI não foi usada.** Ela não estava logada (o login abre o navegador). Migrations aplicadas e função publicada pelo MCP do Supabase; os arquivos ficam versionados em `supabase/migrations` e `supabase/functions`, e o `config.toml` foi escrito à mão em vez de `supabase init`. Os comandos da CLI ficam no CLAUDE.md para quando ela for logada
- **Secrets cadastrados pelo painel**, não pelo `--env-file`: a ferramenta do MCP pede o valor no painel do Supabase (a chave não passou pela conversa). O `.env` continua sendo a fonte local e o comando `--env-file` está no CLAUDE.md
- **Modelo de imagem `gemini-3.1-flash-image`** em vez de `gemini-2.5-flash-image`: conferido com `models.list`, é o estável mais novo. O `gemini-flash-latest` aponta hoje para `gemini-3.8-flash` e aceita `thinkingLevel: medium` (testado com a chave real); a conversão para `thinkingBudget` ficou como rede de segurança
- **O fundo vem em JPEG** da API (não PNG): o arquivo no Storage usa a extensão do tipo que vier
- **Storage por pasta do dono** (`<owner_id>/...`) em vez de checar `storage.objects.owner_id`: a função envia o fundo com a chave de serviço, e esses arquivos não teriam `owner_id`
- **Bug pego pelos testes do guard:** `inject()` depois de `await` falha fora do contexto de injeção. As dependências saem antes do primeiro `await`
- **Clichês em francês com inicial acentuada** ("À l'ère du numérique") não casavam com `\b`: usado `(?<![\p{L}])` com a flag `u`
- **Título por degraus de comprimento**, não medindo o DOM: preview e PNG saem iguais e o teste é determinístico
- **Carrossel do Instagram:** os círculos nas bordas (primeira versão) pareciam bolhas soltas e cruzavam o texto. Trocados por um horizonte azul inclinado na base, contínuo entre slides
- **Stories do LinkedIn:** o bloco de texto desceu (top 620 → 720) e o título subiu um degrau; a metade de baixo ficava vazia
- **Corpo do texto em `paper` no Instagram** (não `muted`): `muted` sobre `accent-deep` não passa AA
- **Excluir com dois cliques** (o botão vira "Confirmar exclusão") em vez de `confirm()` do navegador
- **`kicker` em vez de `eyebrow`** no contrato: em caixa normal, sem o rótulo em caixa alta espaçada (padrão genérico)
- **Porta 4211 na homologação:** a 4200 estava ocupada por outro projeto do dono (e a 4201 e a 4210 também). O servidor dele não foi derrubado
- **`deno.lock` fora do repositório:** o Deno é rodado via `npx`, sem versão fixa no projeto; os imports usam versões fixas (`jsr:@std/assert@1`, `npm:@supabase/supabase-js@2`)
- **Achado do teste real: o Gemini inventa detalhes** que não estão no tema ("OpenJDK 21", "repositório", "open source", "Link in comments", "challenge problems"), apesar da regra "não invente" no prompt. As peças passam no verificador (que só olha forma, não fatos). Não corrigido nesta spec: ver o ponto 7 abaixo
- **Hashtags locais em PT** (`#BarrieTech`, `#GTAtech`): a marca no prompt cita Barrie e GTA, então o modelo usa mesmo sem as palavras-chave de mercado (que só entram em EN e FR)
- **Avisos do Supabase fora do escopo, não mexidos:** a função `public.rls_auto_enable()` (SECURITY DEFINER) pode ser chamada por `anon` e por usuários logados; a proteção contra senhas vazadas está desligada

## Pontos para o dono decidir (solução tomada e alternativas)

### 1. Onde a arte é feita
- **Tomada:** Gemini escreve o texto (JSON); a arte é HTML com os tokens da marca, exportada em PNG.
  - Prós: marca fiel (cores, fontes, logo), texto sempre nítido e editável no código, custo baixo.
  - Contras: o layout é fixo por template; variação visual vem só do texto e do fundo.
- **Alternativa:** a arte inteira gerada pelo modelo de imagem.
  - Prós: mais variedade visual.
  - Contras: texto torto ou com erro na imagem, cores e logo fora da marca, custo e tempo maiores.

### 2. Export do PNG
- **Tomada:** `html-to-image` no navegador.
  - Prós: sem servidor, preview e PNG são o mesmo elemento.
  - Contras: depende das fontes carregarem no navegador; renderização pode variar um pouco entre navegadores.
- **Alternativa:** renderizar no servidor (Edge Function com Satori ou um Chrome headless).
  - Prós: PNG idêntico sempre, permite gerar em lote.
  - Contras: mais infraestrutura e custo; Satori não suporta todo o CSS usado (sombras compostas).

### 3. Tamanho do título
- **Tomada:** degraus pelo número de caracteres.
  - Prós: determinístico e testável.
  - Contras: um título com palavras muito longas pode ficar maior que o ideal.
- **Alternativa:** medir o DOM e reduzir até caber.
  - Prós: ajuste exato.
  - Contras: depende das fontes já carregadas, mais difícil de testar, pode piscar no preview.

### 4. Quando o texto viola as regras depois da 2ª tentativa
- **Tomada:** as peças são corrigidas sozinhas; o texto sugerido só ganha `warnings`.
  - Prós: nunca sai peça com emoji ou travessão; o dono decide sobre o texto que vai publicar.
  - Contras: um clichê no texto sugerido pode passar se o dono ignorar o aviso.
- **Alternativa:** mais tentativas ou reescrever o texto sugerido automaticamente.
  - Prós: menos trabalho manual.
  - Contras: mais custo e tempo por geração; a reescrita automática pode mudar o sentido.

### 5. Idioma da área restrita
- **Tomada (confirmada pelo dono):** só PT-BR, fora dos dicionários.
  - Prós: menos trabalho de manutenção.
  - Contras: quebra a regra "todo texto nos dicionários"; precisa ser lembrada (anotada no CLAUDE.md).

### 6. Avisos de segurança do Supabase fora do escopo
- **Tomada:** não mexer (não são das tabelas desta spec).
- **Alternativa:** revogar `EXECUTE` de `rls_auto_enable()` para `anon` e `authenticated` e ligar a proteção de senhas vazadas.
  - Prós: fecha uma função SECURITY DEFINER exposta na API.
  - Contras: se algum fluxo do projeto chamar essa função pela API, ele para de funcionar (não foi encontrado nenhum).

### 7. Detalhes inventados pelo Gemini (achado do teste real)
- **Tomada:** nada além da regra já existente no prompt; o texto vai para revisão do dono antes de publicar.
  - Prós: nenhum custo a mais.
  - Contras: uma peça pode citar versão, link ou recurso que não existe.
- **Alternativa A:** endurecer o prompt ("não cite versões, repositórios, links, onde está o link nem números que não estejam no tema") e redeploy.
  - Prós: simples, reduz bastante o problema.
  - Contras: não garante; o modelo ainda pode inventar.
- **Alternativa B:** campo "fatos" no formulário (o que pode ser dito) e o verificador acusar números e nomes técnicos que não estejam no tema nem nos fatos.
  - Prós: controle real do que a peça afirma.
  - Contras: mais trabalho no formulário e falsos positivos no verificador.

## Fixes depois do merge

- **Senha pelo link do e-mail** (PR #17): o `/admin` lê a sessão do link (`detectSessionInUrl`) e manda recuperação, convite e link expirado para `/admin/redefinir-senha`.
- **Tema sem limite de caracteres** (PR #18): o mínimo de 3 continua.
- **Permissões da tabela** (PR #19): `GRANT` para `authenticated` e `service_role`; o projeto não expõe tabelas novas à API.
- **Arte criada pelo Gemini** (fix/gemini-html): o dono achou os templates fixos sem impacto ("texto simples com fundo em duas cores"). Agora o Gemini recebe a identidade visual e as regras de arte no prompt e devolve o HTML de cada slide (só estilos inline, logo e fundo por marcador). 3 chamadas em paralelo, uma por direção criativa (tipográfica, prova, pôster). A função recusa HTML inseguro e pede de novo; o front sanitiza com DOMPurify. Os templates fixos ficam só para gerações antigas. Teste real: carrossel de 5 slides em 43 s, stories em 17 s, post em 28 s; export PNG 1080x1080 em cerca de 1 s por peça. Segue inventando "repository" e não fez a forma contínua do carrossel do Instagram.
