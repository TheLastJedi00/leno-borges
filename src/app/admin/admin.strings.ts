/**
 * Textos da area restrita. Fixos em PT-BR de proposito (so o dono usa), por isso ficam fora
 * dos dicionarios trilingues. Excecao registrada no CLAUDE.md.
 */
export const adminStrings = {
  title: 'Painel',
  brand: 'Leno Borges',
  signOut: 'Sair',
  login: {
    heading: 'Entrar',
    email: 'E-mail',
    password: 'Senha',
    submit: 'Entrar',
    submitting: 'Entrando',
    invalid: 'E-mail ou senha inválidos.',
    back: 'Voltar ao site',
  },
  dashboard: {
    heading: 'Painel',
    lead: 'Escolha um módulo.',
    comingSoon: 'Em breve',
    comingSoonText: 'Contatos, leads e propostas.',
    generated: (n: number) => (n === 1 ? '1 geração' : `${n} gerações`),
  },
  adGenerator: {
    cardTitle: 'Gerador de publicidade',
    cardText: 'Stories, carrossel e post para Instagram e LinkedIn com a identidade da marca.',
    heading: 'Gerador de publicidade',
    lead: 'Escreva o tema, escolha o formato e a rede. Saem 3 variações com a identidade da marca.',
    back: 'Painel',
    theme: 'Tema',
    themeHint: 'O que a peça precisa contar. Ex.: aula de funções no ar no Kit de Ensino.',
    format: 'Formato',
    formats: { story: 'Stories', carousel: 'Carrossel', post: 'Post' },
    formatRatio: { story: '9:16', carousel: '1:1', post: '3:4' },
    network: 'Rede',
    networks: { instagram: 'Instagram', linkedin: 'LinkedIn' },
    lang: 'Idioma das peças',
    langs: { en: 'Inglês', fr: 'Francês (Canadá)', pt: 'Português' },
    slides: 'Slides',
    background: 'Gerar fundo com IA',
    backgroundHint: 'Uma imagem abstrata atrás das 3 variações. Leva mais tempo.',
    submit: 'Gerar 3 variações',
    submitting: 'Gerando',
    empty: 'As variações aparecem aqui.',
  },
} as const;
