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
  },
} as const;
