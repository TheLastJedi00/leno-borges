# 013, Painel e Gerador de Publicidade, tarefas da especificação

Uma branch `feat/<fase>` por fase, com um commit por tarefa. Ao final, merge na branch `release/013-painel-publicidade`, criada a partir da `main`.

## Antes de começar (dono)
- [ ] Criar o usuário no Supabase Auth e anotar o UUID
- [ ] Preencher `supabase/functions/.env` (já criado a partir do `.env.example`, fora do git): `GEMINI_API_KEY` e `OWNER_USER_ID`

## Fase 1, `feat/admin-infra`, Supabase
- [ ] 1.1 Supabase CLI no projeto (`supabase init`, `supabase link --project-ref jhipjjtfyzjnezwyzfgq`) e `supabase/functions/.env.example` versionado
- [ ] 1.2 Migration `ad_generations` com `check`s, RLS e policies por operação (`owner_id = auth.uid()`)
- [ ] 1.3 Migration do bucket privado `ads` e das policies em `storage.objects`
- [ ] 1.4 Cadastro de novos usuários desligado no Auth; `get_advisors` (security) sem alerta nas tabelas novas
- [ ] 1.5 `@supabase/supabase-js`, `src/environments/environment.ts` (URL e publishable key) e o provider do cliente, carregado só no chunk de `/admin`

## Fase 2, `feat/admin-auth`, login e acesso
- [ ] 2.1 Serviço `Auth` (signals `session` e `user`, `signIn`, `signOut`, `onAuthStateChange`), com testes
- [ ] 2.2 `adminGuard` que espera a sessão inicial, e o guard inverso do login, com testes
- [ ] 2.3 Rotas `/admin`, `/admin/login` e `/admin/publicidade` lazy, antes do `**`
- [ ] 2.4 Tela de login (PT-BR, `admin.strings.ts`), erro genérico
- [ ] 2.5 Cadeado no header e link "Área restrita" no rodapé; `header.admin` e `footer.admin` nos três dicionários; teste do link
- [ ] 2.6 `noindex` nas páginas de `/admin`, `Disallow: /admin` no `robots.txt`, fora do `sitemap.xml`

## Fase 3, `feat/admin-dashboard`, dashboard
- [ ] 3.1 Layout da área restrita (barra com logo, e-mail e "Sair")
- [ ] 3.2 Cards de módulo: Gerador de publicidade (com o total de peças) e "Em breve"

## Fase 4, `feat/admin-generate-ad`, Edge Function (TDD: testes antes do código)
- [ ] 4.1 Suíte `deno test` da função com o Gemini mockado: entrada, dono (401/403), prompt, schema, retry, nível de raciocínio, verificador, correção das peças e `warnings`
- [ ] 4.2 `_shared/brand.ts` condensado de `.specs/brand/identidade-visual.md`
- [ ] 4.3 `_shared/networks.ts`: moldes de texto do LinkedIn e do Instagram (voz, abertura, corpo, fecho, hashtags, emojis)
- [ ] 4.4 `_shared/cliches.ts` (três idiomas) e `_shared/copy-lint.ts`: travessão, meia-risca, hífen solto, emojis (zero nas peças, limite no texto sugerido), clichês
- [ ] 4.5 Montagem do prompt: identidade, guia da rede, regras de texto com todas as letras, idioma escolhido, formato e nº de slides
- [ ] 4.6 Chamada ao `GEMINI_MODEL` (`gemini-flash-latest`) com `responseSchema` e `thinkingLevel` vindo de `GEMINI_THINKING_LEVEL` (`medium`), com a conversão para `thinkingBudget` se o modelo exigir
- [ ] 4.7 Fundo opcional com o `GEMINI_IMAGE_MODEL` na proporção do formato e upload em `ads/backgrounds/`; conferir com `models.list` se há modelo de imagem mais novo
- [ ] 4.8 Gravação em `ad_generations`, CORS (`localhost:4200`, `lenoborges.com.br`, `www.lenoborges.com.br`) e erros em PT
- [ ] 4.9 Secrets com `supabase secrets set --env-file supabase/functions/.env` e deploy da função; teste real com um tema em cada formato

## Fase 5, `feat/admin-ad-generator`, gerador
- [ ] 5.1 Formulário (tema, formato, rede, idioma EN/FR-CA/PT-BR, nº de slides, fundo com IA) e chamada à função com estado de carregando e erro
- [ ] 5.2 Direção de arte com as skills `frontend-design` e `modern-web-design`, a partir do plano do `context.md`: tokens de peça, placa em relevo, campos azuis, tratamento por rede
- [ ] 5.3 Template `ad-story` (9:16, faixas seguras de 250 px) nas duas redes
- [ ] 5.4 Template `ad-carousel-slide` (1:1): capa, meio em grade fixa, CTA; forma contínua no Instagram, barra de progresso e `n/N` no LinkedIn
- [ ] 5.5 Template `ad-post` (3:4) nas duas redes
- [ ] 5.6 Título que se ajusta ao espaço e limpeza final de emoji e travessão antes de renderizar, com testes
- [ ] 5.7 Fundo de IA com véu `ink` em degradê e contraste AA
- [ ] 5.8 Preview em escala, texto sugerido e hashtags com "Copiar", `warnings` visíveis
- [ ] 5.9 Export PNG (`html-to-image`, fontes embutidas, fundo como data URL) no tamanho certo e upload em `ads/exports/`
- [ ] 5.10 Revisão visual por screenshot dos 3 formatos × 2 redes, com e sem fundo, e ajustes

## Fase 6, `feat/admin-historico`, histórico e documentação
- [ ] 6.1 Lista das gerações, reabrir sem chamar o Gemini, excluir com os arquivos do Storage
- [ ] 6.2 CLAUDE.md: área restrita, Supabase (cliente, migrations, função, secrets via `--env-file`), exceção de i18n do `/admin`, regras de texto das peças

## Encerramento
- [ ] Merge das fases na branch `release/013-painel-publicidade`
- [ ] `npm run build` e `npm test` sem falhas; `deno test` da função sem falhas; bundle inicial da home sem o `supabase-js`
- [ ] Subir em `localhost:4200` e homologar no Chrome: cadeado e link do rodapé, guard sem sessão, login com erro e com sucesso, dashboard, gerar os 3 formatos nas 2 redes e nos 3 idiomas, conferir que nenhuma peça tem emoji nem travessão, fundo com IA, baixar PNG (dimensões certas), histórico, excluir, logout

## Decisões tomadas na execução
