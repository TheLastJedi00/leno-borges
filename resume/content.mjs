// Conteúdo dos currículos em PDF (EN e FR no padrão canadense, PT no padrão brasileiro).
// Fonte de verdade dos fatos: .specs/001 - Rebuild/resume.md
// Regras de copy (CLAUDE.md): sem travessão e sem "FinOps"/"custo zero". O hífen das datas é intencional (formato mais lido pelos ATS).

const contact = {
  email: 'lenoborges.dev@gmail.com',
  linkedin: 'linkedin.com/in/jediaelborges00',
  github: 'github.com/TheLastJedi00',
  portfolio: 'lenoborges.com.br',
};

export const resumes = {
  en: {
    file: 'Leno-Borges-Resume-EN.pdf',
    htmlLang: 'en-CA',
    page: 'Letter',
    docTitle: 'Leno Borges, Full-Stack Software Developer, Resume',
    name: 'Leno Borges',
    headline: 'Full-Stack Software Developer | TypeScript, Angular, Node.js/NestJS, Java/Spring Boot',
    contactLines: [
      'Relocating to Barrie & GTA, ON, Canada | Currently in Blumenau, SC, Brazil',
      `+55 47 99247-8232 | ${contact.email}`,
      `${contact.linkedin} | ${contact.github} | ${contact.portfolio}`,
    ],
    contact,
    qrCaption: 'Portfolio',
    sections: {
      summary: 'Summary',
      skills: 'Technical Skills',
      experience: 'Professional Experience',
      education: 'Education',
      languages: 'Languages',
    },
    summary:
      'Full-Stack Software Developer building SaaS platforms and EdTech solutions end to end with TypeScript, Angular, Node.js/NestJS and Java/Spring Boot. Experienced in REST APIs, serverless and cloud-native architecture (GCP, Firebase, Vercel), CI/CD pipelines and generative AI/LLM integration (Gemini) that automates operational work, cutting content production from 5 days to 2 minutes. Technical instructor and mentor who pairs agile delivery with real care for the product and the end user.',
    skills: [
      ['Languages', 'TypeScript, Java, JavaScript, SQL'],
      ['Frameworks and Libraries', 'Angular (Signals, RxJS), Node.js, NestJS, Spring Boot'],
      ['Architecture', 'REST APIs, Clean Architecture, Serverless, SOLID, Design Patterns, CQRS'],
      ['Cloud and DevOps', 'Google Cloud Platform (GCP), Firebase, Vercel, Docker, CI/CD pipelines, Git/GitHub'],
      ['Artificial Intelligence', 'Generative AI, LLM integration, Gemini, AI Studio'],
      ['Databases', 'PostgreSQL, MySQL, Firestore'],
    ],
    experience: [
      {
        role: 'Full-Stack Developer',
        company: 'Delcastanher Serviços Administrativos (freelance)',
        location: 'Remote',
        dates: 'September 2026 - Present',
        bullets: [
          'Develop the full-stack platform for the Imersão RH Estratégico (strategic HR programme) with Angular on the front end and NestJS on the back end.',
          'Model and persist application data in PostgreSQL and deliver it on a highly available serverless architecture.',
        ],
      },
      {
        role: 'Founder',
        company: 'Liga Dev',
        location: 'Remote',
        dates: '2026 - Present',
        bullets: [
          'Create a proprietary programming course, combining technical instruction experience with an in-house learning platform.',
          'Build the platform on the BF Academy architecture (Angular, NestJS, serverless) with generative AI for personalized material and CI/CD pipelines.',
        ],
      },
      {
        role: 'Full-Stack Developer',
        company: 'Tichr',
        location: 'Remote',
        dates: 'April 2026 - Present',
        bullets: [
          'Build a multi-plan educational SaaS platform end to end with Angular 20 (Signals, Standalone) and NestJS 11 with Firebase.',
          'Engineered a rule-based scheduling engine that projects and recalculates school timetables, eliminating manual rescheduling when disruptions occur.',
          'Designed a hybrid CQRS architecture with Smart/Dumb components, REST API commands and real-time Firestore reads powering multiplayer educational games.',
          'Integrated Gemini for automated course content creation and built custom PIN authentication with JWT to secure and isolate the student portal.',
        ],
      },
      {
        role: 'Technical Instructor (part-time)',
        company: 'ProWay',
        location: 'Blumenau, SC, Brazil',
        dates: 'January 2026 - Present',
        bullets: [
          'Teach Java, OOP, Node.js, SQL, Angular, JavaScript, TypeScript and Git to teenagers and to adults changing careers or specializing.',
          'Deliver tailored technical consulting and training for companies, business owners and executives.',
        ],
      },
      {
        role: 'Developer (freelance)',
        company: 'Matriz do DNA',
        location: 'Remote',
        dates: 'January 2026 - Present',
        bullets: [
          'Develop with Angular and NestJS the platform of an entrepreneur who trains other women entrepreneurs.',
          'Built a generative AI module with Gemini that personalizes each student’s material, cutting production time from 3 hours to 1 minute.',
          'Run it on a modular serverless architecture with CI/CD pipelines for automated deployment and code quality.',
        ],
      },
      {
        role: 'Co-founder and Software Developer',
        company: 'BF Academy',
        location: 'Remote',
        dates: 'October 2025 - Present',
        bullets: [
          'Lead the technical side and end-to-end development of a proprietary LMS with Angular and NestJS.',
          'Built a generative AI module that automated course material creation, cutting production time from 5 days to 2 minutes.',
          'Moved a service from Google Cloud Run to Vercel to lower hosting costs, within a modular serverless architecture with CI/CD pipelines.',
        ],
      },
      {
        role: 'Developer (independent project)',
        company: 'Online Scheduling System',
        location: 'Blumenau, SC, Brazil',
        dates: 'October 2025 - November 2025',
        bullets: [
          'Built an online scheduling system with Angular and migrated it from a monolith to serverless, removing idle server costs and increasing availability.',
        ],
      },
    ],
    education: [
      {
        title: 'Systems Analysis and Development (Technologist Degree, in progress)',
        institution: 'Uniasselvi',
        dates: 'Expected June 2027',
      },
      {
        title: 'AMS Support Bootcamp (200+ hours)',
        institution: 'T-Systems / ProWay',
        dates: 'December 2025',
        bullets: [
          'ITIL and ITSM (44h), Cloud, DevOps and Networking (36h), Soft Skills and Communication (24h), Java, APIs and Databases (100h+).',
          'Recognized as the technical reference and mentor of the cohort, which led to an invitation to join ProWay’s instructor team.',
        ],
      },
    ],
    languages: 'Portuguese: Native | English: Intermediate (B1) | French: Beginner (A1)',
  },

  fr: {
    file: 'Leno-Borges-CV-FR.pdf',
    htmlLang: 'fr-CA',
    page: 'Letter',
    docTitle: 'Leno Borges, Développeur logiciel full stack, CV',
    name: 'Leno Borges',
    headline: 'Développeur logiciel full stack | TypeScript, Angular, Node.js/NestJS, Java/Spring Boot',
    contactLines: [
      'Déménagement prévu à Barrie et dans la RGT (Ontario), Canada | Actuellement à Blumenau (SC), Brésil',
      `Téléphone : +55 47 99247-8232 | Courriel : ${contact.email}`,
      `${contact.linkedin} | ${contact.github} | ${contact.portfolio}`,
    ],
    contact,
    qrCaption: 'Portfolio',
    sections: {
      summary: 'Profil',
      skills: 'Compétences techniques',
      experience: 'Expérience professionnelle',
      education: 'Formation',
      languages: 'Langues',
    },
    summary:
      'Développeur logiciel full stack qui conçoit des plateformes SaaS et des solutions EdTech de bout en bout avec TypeScript, Angular, Node.js/NestJS et Java/Spring Boot. Expérience en API REST, architecture infonuagique sans serveur (GCP, Firebase, Vercel), pipelines CI/CD et intégration d’IA générative et de LLM (Gemini) pour automatiser le travail opérationnel, avec une production de contenu passée de 5 jours à 2 minutes. Formateur technique et mentor, alliant livraison agile et souci réel du produit et de l’utilisateur final.',
    skills: [
      ['Langages', 'TypeScript, Java, JavaScript, SQL'],
      ['Cadriciels et bibliothèques', 'Angular (Signals, RxJS), Node.js, NestJS, Spring Boot'],
      ['Architecture', 'API REST, Clean Architecture, sans serveur (Serverless), SOLID, patrons de conception, CQRS'],
      ['Infonuagique et DevOps', 'Google Cloud Platform (GCP), Firebase, Vercel, Docker, pipelines CI/CD, Git/GitHub'],
      ['Intelligence artificielle', 'IA générative, intégration de LLM, Gemini, AI Studio'],
      ['Bases de données', 'PostgreSQL, MySQL, Firestore'],
    ],
    experience: [
      {
        role: 'Développeur full stack',
        company: 'Delcastanher Serviços Administrativos (à la pige)',
        location: 'À distance',
        dates: 'Septembre 2026 - Aujourd’hui',
        bullets: [
          'Développement full stack de la plateforme de l’Imersão RH Estratégico (programme de RH stratégique) avec Angular au frontal et NestJS en arrière-plan.',
          'Modélisation et persistance des données avec PostgreSQL, sur une architecture sans serveur à haute disponibilité.',
        ],
      },
      {
        role: 'Fondateur',
        company: 'Liga Dev',
        location: 'À distance',
        dates: '2026 - Aujourd’hui',
        bullets: [
          'Création d’un cours de programmation propriétaire, alliant mon expérience de formateur technique à une plateforme d’apprentissage maison.',
          'Plateforme bâtie sur l’architecture de BF Academy (Angular, NestJS, sans serveur), avec IA générative pour le matériel personnalisé et pipelines CI/CD.',
        ],
      },
      {
        role: 'Développeur full stack',
        company: 'Tichr',
        location: 'À distance',
        dates: 'Avril 2026 - Aujourd’hui',
        bullets: [
          'Développement de bout en bout d’une plateforme SaaS éducative multiforfait avec Angular 20 (Signals, Standalone) et NestJS 11 avec Firebase.',
          'Conception d’un moteur de planification à base de règles qui projette et recalcule les horaires scolaires, éliminant le report manuel des dates en cas d’imprévu.',
          'Architecture hybride CQRS avec composants Smart et Dumb, commandes par API REST et lecture en temps réel (Firestore) pour des jeux éducatifs multijoueurs.',
          'Intégration de Gemini pour la création automatisée de contenu pédagogique et authentification par NIP avec JWT pour sécuriser et isoler le portail étudiant.',
        ],
      },
      {
        role: 'Formateur technique (temps partiel)',
        company: 'ProWay',
        location: 'Blumenau (SC), Brésil',
        dates: 'Janvier 2026 - Aujourd’hui',
        bullets: [
          'Enseignement de Java, POO, Node.js, SQL, Angular, JavaScript, TypeScript et Git à des adolescents et à des adultes en réorientation de carrière ou en spécialisation.',
          'Consultation et formation technique sur mesure pour les entreprises, les entrepreneurs et les cadres.',
        ],
      },
      {
        role: 'Développeur (à la pige)',
        company: 'Matriz do DNA',
        location: 'À distance',
        dates: 'Janvier 2026 - Aujourd’hui',
        bullets: [
          'Développement, avec Angular et NestJS, de la plateforme d’une entrepreneure qui forme d’autres entrepreneures.',
          'Module d’IA générative avec Gemini qui personnalise le matériel de chaque élève, réduisant le temps de production de 3 heures à 1 minute.',
          'Architecture modulaire sans serveur avec pipelines CI/CD pour le déploiement automatisé et la qualité du code.',
        ],
      },
      {
        role: 'Cofondateur et développeur logiciel',
        company: 'BF Academy',
        location: 'À distance',
        dates: 'Octobre 2025 - Aujourd’hui',
        bullets: [
          'Leadership technique et développement de bout en bout d’un LMS propriétaire avec Angular et NestJS.',
          'Module d’IA générative qui a automatisé la création de matériel pédagogique, réduisant le temps de production de 5 jours à 2 minutes.',
          'Migration d’un service de Google Cloud Run vers Vercel pour réduire les coûts d’hébergement, dans une architecture modulaire sans serveur avec pipelines CI/CD.',
        ],
      },
      {
        role: 'Développeur (projet autonome)',
        company: 'Système de prise de rendez-vous en ligne',
        location: 'Blumenau (SC), Brésil',
        dates: 'Octobre 2025 - Novembre 2025',
        bullets: [
          'Développement d’un système de prise de rendez-vous en ligne avec Angular et migration d’un monolithe vers le sans serveur, éliminant les coûts de serveurs inactifs et augmentant la disponibilité.',
        ],
      },
    ],
    education: [
      {
        title: 'Analyse et développement de systèmes (diplôme de technologue, en cours)',
        institution: 'Uniasselvi',
        dates: 'Fin prévue en juin 2027',
      },
      {
        title: 'Bootcamp en soutien AMS (plus de 200 heures)',
        institution: 'T-Systems / ProWay',
        dates: 'Décembre 2025',
        bullets: [
          'ITIL et ITSM (44 h), infonuagique, DevOps et réseaux (36 h), compétences humaines et communication (24 h), Java, API et bases de données (100 h et plus).',
          'Reconnu comme référence technique et mentor de la cohorte, ce qui a mené à une invitation à se joindre à l’équipe de formateurs de ProWay.',
        ],
      },
    ],
    languages: 'Portugais : langue maternelle | Anglais : intermédiaire (B1) | Français : débutant (A1)',
  },

  pt: {
    file: 'Leno-Borges-Curriculo-PT.pdf',
    htmlLang: 'pt-BR',
    page: 'A4',
    docTitle: 'Leno Borges, Desenvolvedor Fullstack, Currículo',
    name: 'Leno Borges',
    headline: 'Desenvolvedor de Software Fullstack | TypeScript, Angular, Node.js/NestJS, Java/Spring Boot',
    contactLines: [
      'Blumenau, SC | Disponível para trabalho remoto',
      `(47) 99247-8232 | ${contact.email}`,
      `${contact.linkedin} | ${contact.github} | ${contact.portfolio}`,
    ],
    contact,
    qrCaption: 'Portfólio',
    objective: ['Objetivo', 'Atuar como Desenvolvedor de Software Fullstack em plataformas SaaS, com Angular, NestJS e Java/Spring Boot.'],
    sections: {
      summary: 'Resumo Profissional',
      skills: 'Competências Técnicas',
      experience: 'Experiência Profissional',
      education: 'Formação Acadêmica',
      languages: 'Idiomas',
    },
    summary:
      'Desenvolvedor de Software Fullstack com experiência na construção de plataformas SaaS e soluções EdTech de ponta a ponta com TypeScript, Angular, Node.js/NestJS e Java/Spring Boot. Vivência em REST APIs, arquitetura Serverless em nuvem (GCP, Firebase, Vercel), esteiras de CI/CD e integração de IA Generativa e LLMs (Gemini) para automatizar processos operacionais, reduzindo a produção de conteúdo de 5 dias para 2 minutos. Instrutor técnico e mentor, combinando entrega ágil de código com preocupação real com o produto e o cliente final.',
    skills: [
      ['Linguagens', 'TypeScript, Java, JavaScript, SQL'],
      ['Frameworks e Bibliotecas', 'Angular (Signals, RxJS), Node.js, NestJS, Spring Boot'],
      ['Arquitetura', 'REST APIs, Clean Architecture, Serverless, SOLID, Design Patterns, CQRS'],
      ['Cloud e DevOps', 'Google Cloud Platform (GCP), Firebase, Vercel, Docker, CI/CD, Git/GitHub'],
      ['Inteligência Artificial', 'IA Generativa, integração de LLMs, Gemini, AI Studio'],
      ['Banco de Dados', 'PostgreSQL, MySQL, Firestore'],
    ],
    experience: [
      {
        role: 'Desenvolvedor Fullstack',
        company: 'Delcastanher Serviços Administrativos (freelancer)',
        location: 'Remoto',
        dates: 'Setembro 2026 - Atual',
        bullets: [
          'Desenvolvimento fullstack da plataforma da Imersão RH Estratégico, com Angular no front-end e NestJS no back-end.',
          'Modelagem e persistência de dados em PostgreSQL, sobre arquitetura Serverless com alta disponibilidade.',
        ],
      },
      {
        role: 'Fundador',
        company: 'Liga Dev',
        location: 'Remoto',
        dates: '2026 - Atual',
        bullets: [
          'Criação de um curso próprio de programação, unindo a experiência de instrutor técnico a uma plataforma de ensino própria.',
          'Plataforma construída sobre a arquitetura da BF Academy (Angular, NestJS, Serverless), com IA Generativa para material personalizado e esteiras de CI/CD.',
        ],
      },
      {
        role: 'Desenvolvedor Fullstack',
        company: 'Tichr',
        location: 'Remoto',
        dates: 'Abril 2026 - Atual',
        bullets: [
          'Desenvolvimento de ponta a ponta de uma plataforma SaaS educacional multiplano com Angular 20 (Signals, Standalone) e NestJS 11 com Firebase.',
          'Engenharia de um motor de agendamento orientado a regras que projeta e recalcula grades escolares, eliminando o reposicionamento manual de datas em caso de imprevistos.',
          'Arquitetura híbrida com CQRS e componentes Smart e Dumb, comandos via REST API e leitura em tempo real (Firestore) para jogos educativos multiplayer.',
          'Integração do Gemini para criação automatizada de conteúdo didático e autenticação por PIN via JWT para segurança e isolamento do portal do aluno.',
        ],
      },
      {
        role: 'Instrutor Técnico (meio período)',
        company: 'ProWay',
        location: 'Blumenau, SC',
        dates: 'Janeiro 2026 - Atual',
        bullets: [
          'Ensino de Java, POO, Node.js, SQL, Angular, JavaScript, TypeScript e versionamento de código para adolescentes e para jovens e adultos em transição de carreira ou especialização.',
          'Consultoria e capacitação técnica sob medida para empresas, empresários e executivos.',
        ],
      },
      {
        role: 'Desenvolvedor (freelancer)',
        company: 'Matriz do DNA',
        location: 'Remoto',
        dates: 'Janeiro 2026 - Atual',
        bullets: [
          'Desenvolvimento, com Angular e NestJS, da plataforma de uma empresária que forma outras empresárias.',
          'Módulo de IA Generativa com Gemini que personaliza o material de cada aluna, reduzindo o tempo de produção de 3 horas para 1 minuto.',
          'Arquitetura modular Serverless com esteiras de CI/CD para deploy automatizado e gestão de qualidade de código.',
        ],
      },
      {
        role: 'Cofundador e Software Developer',
        company: 'BF Academy',
        location: 'Remoto',
        dates: 'Outubro 2025 - Atual',
        bullets: [
          'Liderança técnica e desenvolvimento de ponta a ponta de um LMS proprietário com Angular e NestJS.',
          'Módulo de IA Generativa que automatizou a criação de material didático, reduzindo o tempo de produção de 5 dias para 2 minutos.',
          'Migração de um serviço do Google Cloud Run para a Vercel para reduzir o custo de hospedagem, em uma arquitetura modular Serverless com esteiras de CI/CD.',
        ],
      },
      {
        role: 'Desenvolvedor (projeto autônomo)',
        company: 'Sistema de Agendamento Online',
        location: 'Blumenau, SC',
        dates: 'Outubro 2025 - Novembro 2025',
        bullets: [
          'Desenvolvimento de sistema de agendamento online com Angular e migração da arquitetura monolítica para Serverless, eliminando custos de servidor ocioso e aumentando a disponibilidade.',
        ],
      },
    ],
    education: [
      {
        title: 'Tecnólogo em Análise e Desenvolvimento de Sistemas (cursando)',
        institution: 'Uniasselvi',
        dates: 'Conclusão prevista em junho de 2027',
      },
      {
        title: 'Bootcamp de Suporte AMS (mais de 200 horas)',
        institution: 'T-Systems / ProWay',
        dates: 'Dezembro 2025',
        bullets: [
          'ITIL e ITSM (44h), Cloud, DevOps e Redes (36h), Soft Skills e Comunicação (24h), Java, APIs e Banco de Dados (100h+).',
          'Referência técnica e mentor da turma nos projetos práticos, o que resultou no convite para integrar o quadro de instrutores da ProWay.',
        ],
      },
    ],
    languages: 'Português: Nativo | Inglês: Intermediário (B1) | Francês: Básico (A1)',
  },
};
