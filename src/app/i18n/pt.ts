import type { Dictionary } from './dictionary';
import { partners, projectUrls } from '../pages/home/home.data';

export const pt: Dictionary = {
  meta: {
    htmlLang: 'pt-BR',
    title: 'Leno Borges, Software Developer Fullstack & Tech Educator | Barrie & GTA, Canadá',
    description:
      'Leno Borges, Software Developer Fullstack (TypeScript, Angular, Node.js/NestJS, Java/Spring Boot) e Tech Educator em Barrie & GTA, Ontário, Canadá e Blumenau, SC, Brasil. Plataformas SaaS e EdTech, REST APIs, IA Generativa e arquitetura Serverless.',
  },
  header: {
    navLabel: 'Principal',
    home: 'Página inicial de Leno Borges',
    nav: { about: 'Sobre', experience: 'Experiência', skills: 'Competências', education: 'Formação' },
    contact: 'Contato',
    langLabel: 'Idioma',
    langNames: { en: 'English', fr: 'Français (Canada)', pt: 'Português (Brasil)' },
  },
  hero: {
    location: 'Barrie & GTA, Canadá · Blumenau, SC, Brasil',
    roleLead: 'Software Developer Fullstack',
    roleTail: 'Tech Educator',
    tagline:
      'Plataformas SaaS e EdTech de ponta a ponta com Angular, NestJS e Java/Spring, usando IA Generativa para automatizar o operacional.',
    ctaExperience: 'Ver experiência ↓',
    ctaContact: 'Contato',
  },
  owner: {
    alt: 'Leno Borges, de jaqueta de couro preta, explicando um conceito em sala de aula na ProWay',
    caption: 'Em aula · ProWay, Blumenau',
  },
  about: {
    title: 'Sobre',
    summary:
      'Software Developer Fullstack com experiência na construção de plataformas SaaS e soluções EdTech de ponta a ponta, utilizando Angular, NestJS e o ecossistema Java/Spring. Focado em traduzir regras de negócio complexas em arquiteturas modulares e eficientes.',
    summaryExtra:
      'Forte vivência prática na integração de Inteligência Artificial para automatizar processos operacionais, com atenção ao custo nas decisões de arquitetura, como a migração de monólito para Serverless e a troca de provedor de hospedagem. Perfil hands-on e com histórico de mentoria técnica, combinando a entrega ágil de código com a preocupação real sobre o produto e o cliente final.',
    metrics: [
      {
        value: '5 dias → 2 min',
        label: 'Produção de material didático com IA Generativa na BF Academy',
      },
      {
        value: '3 h → 1 min',
        label: 'Criação de material personalizado com IA Generativa na Matriz do DNA',
      },
    ],
  },
  experience: {
    title: 'Experiência',
    lead: 'Liderança técnica e engenharia ponta a ponta de soluções SaaS e EdTech, automação com IA e formação de novos devs.',
    techsLabel: 'Tecnologias',
    visit: 'Visitar',
    newTab: '(abre em nova aba)',
    items: [
      {
        title: 'Liga Dev',
        subtitle: 'Curso de Programação Próprio',
        role: 'Fundador',
        period: 'Desde 2026',
        location: 'Remoto',
        badge: 'Em construção',
        url: projectUrls.ligaDev,
        techs: ['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'CI/CD'],
        paths: [
          {
            path: 'Curso de programação',
            description:
              'Criação de um curso próprio de programação, unindo a experiência de instrutor técnico a uma plataforma própria.',
          },
          {
            path: 'Plataforma',
            description:
              'Construída sobre a mesma arquitetura da BF Academy, com Angular no front-end e NestJS no back-end.',
          },
          {
            path: 'IA Generativa & Serverless',
            description:
              'Geração de material personalizado com IA sobre infraestrutura Serverless, com esteiras de CI/CD.',
          },
        ],
      },
      {
        title: 'Delcastanher',
        partners: [partners.lidianeDelcastanher],
        subtitle: 'Serviços Administrativos · Projeto Freelancer',
        role: 'Desenvolvedor Fullstack',
        period: 'Desde Set 2026',
        location: 'Remoto',
        badge: 'Atual',
        url: projectUrls.delcastanher,
        techs: ['Angular', 'NestJS', 'Serverless', 'PostgreSQL'],
        paths: [
          {
            path: 'Plataforma',
            description:
              'Desenvolvimento fullstack da plataforma da Imersão RH Estratégico, com Angular no front-end e NestJS no back-end.',
          },
          {
            path: 'Dados',
            description: 'Modelagem e persistência de dados em PostgreSQL.',
          },
          {
            path: 'Serverless',
            description: 'Arquitetura Serverless com alta disponibilidade.',
          },
        ],
      },
      {
        title: 'Tichr',
        subtitle: 'Plataforma SaaS Educacional Multiplano',
        role: 'Desenvolvedor Fullstack',
        period: 'Desde Abr 2026',
        location: 'Remoto',
        url: projectUrls.tichr,
        badge: 'Atual',
        techs: [
          'Angular 20 (Signals)',
          'NestJS 11',
          'Firebase',
          'Firestore',
          'Gemini',
          'CQRS',
          'JWT',
        ],
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
              'Arquitetura híbrida baseada em CQRS e separação estrita entre componentes Smart e Dumb, integrando comandos via REST API com leitura de estado em tempo real (Firestore) para jogos multiplayer educativos.',
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
        partners: [partners.proway],
        subtitle: 'Educação, Formação de Devs & Consultoria',
        role: 'Instrutor Técnico',
        period: 'Desde Jan 2026',
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
        title: 'Matriz do DNA',
        partners: [partners.paulaMarjorie],
        subtitle: 'Plataforma de Formação de Empresárias · Freelancer',
        role: 'Desenvolvedor',
        period: 'Desde Jan 2026',
        location: 'Remoto',
        badge: 'Em construção',
        techs: ['Angular', 'NestJS', 'Gemini', 'Serverless', 'CI/CD'],
        paths: [
          {
            path: 'Plataforma',
            description:
              'Desenvolvimento, com Angular e NestJS, da plataforma de uma empresária que forma outras empresárias.',
          },
          {
            path: 'Conteúdo com Gemini',
            description:
              'Módulo de IA generativa com Gemini que personaliza o material de cada aluna, reduzindo o tempo de produção de 3 horas para 1 minuto.',
          },
          {
            path: 'Serverless & CI/CD',
            description:
              'Mesma arquitetura modular Serverless da BF Academy, com alta disponibilidade e esteiras de CI/CD.',
          },
        ],
      },
      {
        title: 'BF Academy',
        partners: [partners.barbaraFarias],
        subtitle: 'EdTech & LMS Proprietário',
        role: 'Cofundador · Software Developer',
        period: 'Desde Out 2025',
        location: 'Remoto',
        url: projectUrls.bfAcademy,
        badge: 'Cofundador',
        techs: ['Angular', 'NestJS', 'Serverless', 'IA Generativa', 'Vercel', 'CI/CD'],
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
            path: 'Cloud Run → Vercel',
            description:
              'Migração de um serviço do Cloud Run para a Vercel para reduzir o custo de hospedagem, em uma arquitetura modular Serverless com esteiras de CI/CD.',
          },
        ],
      },
      {
        title: 'Sistema de Agendamento',
        subtitle: 'Projeto Autônomo',
        role: 'Desenvolvedor',
        period: 'Out 2025 a Nov 2025',
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
    ],
  },
  skills: {
    title: 'Competências',
    groups: [
      { category: 'Linguagens', skills: ['TypeScript', 'Java', 'JavaScript', 'SQL'] },
      {
        category: 'Frameworks & Bibliotecas',
        skills: ['Angular', 'Node.js', 'NestJS', 'Spring Boot', 'RxJS', 'Signals'],
      },
      {
        category: 'Arquitetura & Padrões',
        skills: ['REST APIs', 'Clean Architecture', 'Serverless', 'SOLID', 'Design Patterns', 'CQRS'],
      },
      {
        category: 'Cloud & DevOps',
        skills: ['Docker', 'CI/CD', 'GCP', 'Firebase', 'Vercel', 'Git/GitHub'],
      },
      { category: 'Inteligência Artificial', skills: ['Integração de LLMs', 'AI Studio'] },
      { category: 'Banco de Dados', skills: ['PostgreSQL', 'MySQL', 'Firestore'] },
    ],
  },
  partners: {
    label: 'Parceria',
    linkedin: 'perfil no LinkedIn',
  },
  education: {
    title: 'Formação',
    items: [
      {
        title: 'Bootcamp de Suporte AMS',
        institution: 'T-Systems / ProWay',
        partners: [partners.tsystems, partners.proway],
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
              'Referência técnica e mentor da turma nos projetos práticos, o que resultou no convite para integrar o quadro de instrutores da ProWay.',
          },
        ],
      },
      {
        title: 'Análise e Desenvolvimento de Sistemas',
        institution: 'Uniasselvi',
        period: 'Conclusão prevista 06/2027',
      },
    ],
  },
  languages: {
    title: '05 · Idiomas',
    items: [
      { name: 'Português', level: 'Nativo' },
      { name: 'Inglês', level: 'Intermediário (B1)' },
      { name: 'Francês', level: 'Básico (A1)' },
    ],
  },
  contact: {
    eyebrow: 'Contato',
    titleLead: 'Vamos',
    titleAccent: 'conversar?',
    emailLabel: 'E-mail',
    whatsappMessage: 'Olá Leno, vi seu portfólio e gostaria de conversar!',
  },
  footer: {
    location: 'Barrie & GTA, Canadá · Blumenau, SC, Brasil',
    rights: 'Todos os direitos reservados.',
  },
};
