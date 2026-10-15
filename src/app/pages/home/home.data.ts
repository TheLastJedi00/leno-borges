// Conteúdo da Home. Fonte de verdade: .specs/001 - Rebuild/resume.md

export interface ExperiencePath {
  path: string;
  description: string;
}

export interface Experience {
  title: string;
  subtitle: string;
  role: string;
  period: string;
  location: string;
  badge?: string;
  techs: string[];
  paths: ExperiencePath[];
  caseLink?: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EducationModule {
  name: string;
  hours: string;
  description: string;
}

export interface Education {
  title: string;
  institution: string;
  period: string;
  modules?: EducationModule[];
}

export interface Language {
  name: string;
  level: string;
}

export interface Contact {
  label: string;
  value: string;
  href: string;
}

export const summary =
  'Engenheiro de Software Fullstack com experiência na construção de plataformas SaaS e soluções EdTech de ponta a ponta, utilizando Angular, NestJS e o ecossistema Java/Spring. Focado em traduzir regras de negócio complexas em arquiteturas modulares e eficientes.';

export const summaryExtra =
  'Forte vivência prática na integração de Inteligência Artificial para automatizar processos operacionais e na aplicação de estratégias de FinOps para escalar produtos mantendo o custo de infraestrutura próximo a zero. Perfil hands-on e com histórico de mentoria técnica, combinando a entrega ágil de código com a preocupação real sobre o produto e o cliente final.';

export const metrics: Metric[] = [
  { value: '5 dias → 2 min', label: 'Produção de material didático com IA Generativa na BF Academy' },
  { value: '3 h → 1 min', label: 'Criação de material personalizado em plataforma de consultoria' },
  { value: '≈ 0%', label: 'Custo de infraestrutura ociosa com FinOps e arquitetura Serverless' },
];

export const experiences: Experience[] = [
  {
    title: 'Tichr',
    subtitle: 'Plataforma SaaS Educacional Multiplano',
    role: 'Desenvolvedor Fullstack',
    period: 'Abr 2026 — Presente',
    location: 'Remoto',
    badge: 'Atual',
    techs: ['Angular 20 (Signals)', 'NestJS 11', 'Firebase', 'Firestore', 'Gemini', 'CQRS', 'JWT'],
    paths: [
      {
        path: 'Plataforma ponta a ponta',
        description:
          'Desenvolvimento de uma plataforma SaaS educacional multiplano com Angular 20 (Signals, Standalone) no frontend e NestJS 11 com Firebase no backend.',
      },
      {
        path: 'Motor de agendamento',
        description:
          'Motor orientado a regras que projeta e recalcula grades escolares dinamicamente, eliminando o trabalho manual de reposicionamento de datas em caso de imprevistos.',
      },
      {
        path: 'CQRS & tempo real',
        description:
          'Arquitetura híbrida baseada em CQRS e separação estrita entre componentes Smart e Dumb, integrando comandos via REST com leitura de estado em tempo real (Firestore) para jogos multiplayer educativos.',
      },
      {
        path: 'IA Generativa & segurança',
        description:
          'Integração do Gemini para criação automatizada de conteúdo didático e autenticação customizada por PIN via JWT, com foco em segurança e isolamento do portal do aluno.',
      },
    ],
  },
  {
    title: 'ProWay',
    subtitle: 'Educação, Formação de Devs & Consultoria',
    role: 'Instrutor Técnico',
    period: 'Jan 2026 — Atual',
    location: 'Blumenau, SC · Part-Time',
    badge: 'Atual',
    techs: ['Java', 'POO', 'Node.js', 'SQL', 'Angular', 'JavaScript', 'TypeScript', 'Git'],
    paths: [
      {
        path: 'Tech Explorers',
        description:
          'Introdução à programação e ao pensamento computacional para adolescentes.',
      },
      {
        path: 'Formação & especialização',
        description:
          'Treinamento técnico intensivo para jovens e adultos em transição de carreira ou especialização.',
      },
      {
        path: 'Corporativo',
        description:
          'Consultoria e capacitação sob medida para empresas, empresários e executivos.',
      },
    ],
  },
  {
    title: 'Plataforma de Consultoria',
    subtitle: 'Projeto Freelancer',
    role: 'Desenvolvedor',
    period: 'Jan 2026 — Mar 2026',
    location: 'Remoto',
    techs: ['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'CI/CD'],
    paths: [
      {
        path: 'Plataforma',
        description: 'Desenvolvimento de plataforma de consultoria utilizando Angular e NestJS.',
      },
      {
        path: 'IA Generativa',
        description:
          'Módulo que automatizou a criação de material personalizado, reduzindo o tempo de produção de 3 horas para 1 minuto.',
      },
      {
        path: 'Serverless & CI/CD',
        description:
          'Arquitetura modular Serverless com alta disponibilidade e custo zero de ociosidade, além de esteiras de CI/CD para deploy automatizado e gestão de qualidade de código.',
      },
    ],
  },
  {
    title: 'BF Academy',
    subtitle: 'EdTech & LMS Proprietário',
    role: 'Cofundador · Engenheiro de Software',
    period: 'Out 2025 — Atual',
    location: 'Remoto',
    badge: 'Cofundador',
    techs: ['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'FinOps', 'CI/CD'],
    caseLink: '/bfacademy',
    paths: [
      {
        path: 'LMS end-to-end',
        description:
          'Liderança técnica e desenvolvimento de ponta a ponta de um LMS, com Angular no front-end e NestJS no back-end.',
      },
      {
        path: 'IA Generativa',
        description:
          'Módulo que automatizou a criação de material didático, reduzindo o tempo de produção de 5 dias para 2 minutos.',
      },
      {
        path: 'FinOps',
        description:
          'Arquitetura modular baseada em serviços Serverless, mantendo o custo de infraestrutura próximo de 0%, com esteiras de CI/CD para deploy automatizado.',
      },
    ],
  },
  {
    title: 'Sistema de Agendamento',
    subtitle: 'Projeto Autônomo',
    role: 'Desenvolvedor',
    period: 'Out 2025 — Nov 2025',
    location: 'Blumenau, SC',
    techs: ['Angular', 'Serverless'],
    paths: [
      {
        path: 'Agendamento online',
        description: 'Desenvolvimento de sistema de agendamento online com Angular.',
      },
      {
        path: 'Monólito → Serverless',
        description:
          'Migração da arquitetura monolítica para Serverless, eliminando custos de servidor ocioso e aumentando a disponibilidade.',
      },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  { category: 'Linguagens', skills: ['Java', 'TypeScript', 'JavaScript', 'SQL'] },
  {
    category: 'Frameworks & Bibliotecas',
    skills: ['Spring Boot', 'NestJS', 'Angular', 'RxJS', 'Signals', 'Node.js'],
  },
  {
    category: 'Arquitetura & Padrões',
    skills: ['Clean Architecture', 'Serverless', 'SOLID', 'Design Patterns', 'CQRS'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['GCP', 'Firebase', 'Vercel', 'Docker', 'CI/CD', 'Git/GitHub'],
  },
  { category: 'Inteligência Artificial', skills: ['Integração de LLMs', 'AI Studio'] },
  { category: 'Banco de Dados', skills: ['PostgreSQL', 'MySQL', 'Firestore'] },
];

export const education: Education[] = [
  {
    title: 'Bootcamp de Suporte AMS',
    institution: 'T-Systems / ProWay',
    period: 'Dez 2025',
    modules: [
      {
        name: 'Gestão de Serviços e Processos',
        hours: 'ITIL & ITSM · 44h',
        description:
          'Mentalidade orientada a serviços e SLAs para organizar fluxos de trabalho de equipes e garantir entregas consistentes.',
      },
      {
        name: 'Liderança de Times Diversos',
        hours: 'Soft Skills & Comunicação · 24h',
        description:
          'Inteligência emocional e atendimento para gerenciar stakeholders e alinhar expectativas entre times técnicos e negócio.',
      },
      {
        name: 'Visão Holística de Arquitetura',
        hours: 'Cloud, DevOps & Redes · 36h',
        description:
          'Compreensão da infraestrutura que sustenta o código, para liderar deploys críticos e discussões de arquitetura.',
      },
      {
        name: 'Mentoria e Excelência Técnica',
        hours: 'Java, APIs & DB · 100h+',
        description:
          'Referência técnica e mentor da turma nos projetos práticos — o que resultou no convite para integrar o quadro de instrutores da ProWay.',
      },
    ],
  },
  {
    title: 'Análise e Desenvolvimento de Sistemas',
    institution: 'Uniasselvi',
    period: 'Conclusão prevista 06/2027',
  },
];

export const languages: Language[] = [
  { name: 'Português', level: 'Nativo' },
  { name: 'Inglês', level: 'Intermediário (B1)' },
];

export const contacts: Contact[] = [
  {
    label: 'E-mail',
    value: 'lenoborges.dev@gmail.com',
    href: 'mailto:lenoborges.dev@gmail.com',
  },
  {
    label: 'WhatsApp',
    value: '(47) 99247-8232',
    href: 'https://wa.me/5547992478232?text=Ol%C3%A1%20Leno,%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!',
  },
  {
    label: 'LinkedIn',
    value: 'in/jediaelborges00',
    href: 'https://www.linkedin.com/in/jediaelborges00/',
  },
  { label: 'GitHub', value: 'TheLastJedi00', href: 'https://github.com/TheLastJedi00' },
];
