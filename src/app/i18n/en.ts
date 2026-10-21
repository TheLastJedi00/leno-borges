import type { Dictionary } from './dictionary';

// Inglês canadense; termos de mercado de Barrie/GTA (ver .specs/002 - Ajustes/context.md)
export const en: Dictionary = {
  meta: {
    htmlLang: 'en',
    title: 'Leno Borges — Full-Stack Software Developer & Tech Educator | Barrie & GTA, Ontario',
    description:
      'Leno Borges, Full-Stack Software Developer (TypeScript, Angular, Node.js/NestJS, Java/Spring Boot) and Tech Educator in Barrie & GTA, Ontario, Canada and Blumenau, Brazil. SaaS and EdTech platforms, REST APIs, generative AI and cloud cost optimization (FinOps).',
  },
  header: {
    navLabel: 'Main',
    home: 'Leno Borges — home',
    nav: { about: 'About', experience: 'Experience', skills: 'Skills', education: 'Education' },
    contact: 'Contact',
    langLabel: 'Language',
    langNames: { en: 'English', fr: 'Français (Canada)', pt: 'Português (Brasil)' },
  },
  hero: {
    location: 'Barrie & GTA, Canada · Blumenau, SC, Brazil',
    roleLead: 'Full-Stack Software Developer',
    roleTail: 'Tech Educator',
    tagline:
      'End-to-end SaaS and EdTech platforms with TypeScript, Angular, NestJS and Java/Spring — using generative AI to automate operations and FinOps to keep cloud costs close to zero.',
    ctaExperience: 'See experience ↓',
    ctaContact: 'Contact',
  },
  owner: {
    alt: 'Leno Borges, wearing a black leather jacket, explaining a concept in a classroom at ProWay',
    caption: 'Teaching · ProWay, Blumenau',
  },
  about: {
    title: 'About',
    summary:
      'Full-Stack Software Developer experienced in building SaaS platforms and EdTech solutions end to end with Angular, NestJS and the Java/Spring ecosystem. Focused on translating complex business rules into modular, efficient architectures.',
    summaryExtra:
      'Strong hands-on experience integrating generative AI to automate operational processes and applying FinOps (cloud cost optimization) strategies to scale products while keeping infrastructure costs close to zero. Hands-on profile with a track record of technical mentoring, combining agile delivery with genuine care for the product and the end user.',
    metrics: [
      {
        value: '5 days → 2 min',
        label: 'Course material production with generative AI at BF Academy',
      },
      {
        value: '3 h → 1 min',
        label: 'Personalized material creation on a consulting platform',
      },
      {
        value: '≈ 0%',
        label: 'Idle infrastructure cost with FinOps and a serverless architecture',
      },
    ],
  },
  experience: {
    title: 'Experience',
    lead: 'Technical leadership and end-to-end engineering of SaaS and EdTech solutions, AI automation and developer training.',
    techsLabel: 'Technologies',
    items: [
      {
        title: 'Tichr',
        subtitle: 'Multi-plan educational SaaS platform',
        role: 'Full-Stack Developer',
        period: 'Apr 2026 — Present',
        location: 'Remote',
        badge: 'Current',
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
            path: 'End-to-end platform',
            description:
              'Building a multi-plan educational SaaS platform with Angular 20 (Signals, Standalone) on the front end and NestJS 11 with Firebase on the back end.',
          },
          {
            path: 'Scheduling engine',
            description:
              'Rule-based engine that projects and dynamically recalculates school timetables, eliminating the manual work of rescheduling dates when disruptions occur.',
          },
          {
            path: 'CQRS & real time',
            description:
              'Hybrid CQRS-based architecture with strict Smart/Dumb component separation, combining commands through a REST API with real-time state reads (Firestore) to power multiplayer educational games.',
          },
          {
            path: 'Generative AI & security',
            description:
              'Gemini integration for automated course content creation, plus custom PIN authentication with JWT focused on security and isolation of the student portal.',
          },
        ],
      },
      {
        title: 'ProWay',
        subtitle: 'Education, Developer Training & Consulting',
        role: 'Technical Instructor',
        period: 'Jan 2026 — Present',
        location: 'Blumenau, SC, Brazil · Part-time',
        badge: 'Current',
        techs: ['Java', 'OOP', 'Node.js', 'SQL', 'Angular', 'JavaScript', 'TypeScript', 'Git'],
        paths: [
          {
            path: 'Tech Explorers',
            description: 'Introduction to programming and computational thinking for teenagers.',
          },
          {
            path: 'Training & upskilling',
            description:
              'Intensive technical training for young people and adults changing careers or specializing.',
          },
          {
            path: 'Corporate',
            description:
              'Tailored consulting and training for companies, business owners and executives.',
          },
        ],
      },
      {
        title: 'Consulting Platform',
        subtitle: 'Freelance project',
        role: 'Developer',
        period: 'Jan 2026 — Mar 2026',
        location: 'Remote',
        techs: ['Angular', 'NestJS', 'Serverless', 'Generative AI', 'CI/CD'],
        paths: [
          {
            path: 'Platform',
            description: 'Built a consulting platform with Angular and NestJS.',
          },
          {
            path: 'Generative AI',
            description:
              'Module that automated personalized material creation, cutting production time from 3 hours to 1 minute.',
          },
          {
            path: 'Serverless & CI/CD',
            description:
              'Modular serverless architecture with high availability and zero idle cost, plus CI/CD pipelines for automated deployment and code quality management.',
          },
        ],
      },
      {
        title: 'BF Academy',
        subtitle: 'EdTech & proprietary LMS',
        role: 'Co-founder · Software Developer',
        period: 'Oct 2025 — Present',
        location: 'Remote',
        badge: 'Co-founder',
        techs: ['Angular', 'NestJS', 'Serverless', 'Generative AI', 'FinOps', 'CI/CD'],
        paths: [
          {
            path: 'End-to-end LMS',
            description:
              'Technical leadership and end-to-end development of an LMS, with Angular on the front end and NestJS on the back end.',
          },
          {
            path: 'Generative AI',
            description:
              'Module that automated course material creation, cutting production time from 5 days to 2 minutes.',
          },
          {
            path: 'FinOps',
            description:
              'Modular architecture built on serverless services, keeping infrastructure costs close to 0%, with CI/CD pipelines for automated deployment.',
          },
        ],
      },
      {
        title: 'Scheduling System',
        subtitle: 'Independent project',
        role: 'Developer',
        period: 'Oct 2025 — Nov 2025',
        location: 'Blumenau, SC, Brazil',
        techs: ['Angular', 'Serverless'],
        paths: [
          {
            path: 'Online booking',
            description: 'Built an online scheduling system with Angular.',
          },
          {
            path: 'Monolith → Serverless',
            description:
              'Migrated a monolithic architecture to serverless, eliminating idle server costs and increasing availability.',
          },
        ],
      },
    ],
  },
  skills: {
    title: 'Skills',
    groups: [
      { category: 'Languages', skills: ['TypeScript', 'Java', 'JavaScript', 'SQL'] },
      {
        category: 'Frameworks & Libraries',
        skills: ['Angular', 'Node.js', 'NestJS', 'Spring Boot', 'RxJS', 'Signals'],
      },
      {
        category: 'Architecture & Patterns',
        skills: ['REST APIs', 'Clean Architecture', 'Serverless', 'SOLID', 'Design Patterns', 'CQRS'],
      },
      {
        category: 'Cloud & DevOps',
        skills: ['Docker', 'CI/CD', 'GCP', 'Firebase', 'Vercel', 'Git/GitHub'],
      },
      { category: 'Artificial Intelligence', skills: ['LLM integration', 'AI Studio'] },
      { category: 'Databases', skills: ['PostgreSQL', 'MySQL', 'Firestore'] },
    ],
  },
  education: {
    title: 'Education',
    items: [
      {
        title: 'AMS Support Bootcamp',
        institution: 'T-Systems / ProWay',
        period: 'Dec 2025',
        modules: [
          {
            name: 'Service & Process Management',
            hours: 'ITIL & ITSM · 44h',
            description:
              'Service- and SLA-oriented mindset to organize team workflows and ensure consistent delivery.',
          },
          {
            name: 'Leading Diverse Teams',
            hours: 'Soft Skills & Communication · 24h',
            description:
              'Emotional intelligence and client service to manage stakeholders and align expectations between technical teams and the business.',
          },
          {
            name: 'Holistic Architecture View',
            hours: 'Cloud, DevOps & Networking · 36h',
            description:
              'Understanding of the infrastructure behind the code, to lead critical deployments and architecture discussions.',
          },
          {
            name: 'Mentoring & Technical Excellence',
            hours: 'Java, APIs & DB · 100h+',
            description:
              'Technical reference and mentor to classmates during hands-on projects — which led to an invitation to join ProWay’s instructor team.',
          },
        ],
      },
      {
        title: 'Systems Analysis and Development',
        institution: 'Uniasselvi',
        period: 'Expected 06/2027',
      },
    ],
  },
  languages: {
    title: '05 — Languages',
    items: [
      { name: 'Portuguese', level: 'Native' },
      { name: 'English', level: 'Intermediate (B1)' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    titleLead: 'Let’s',
    titleAccent: 'talk.',
    emailLabel: 'Email',
    whatsappMessage: 'Hi Leno, I saw your portfolio and would like to connect!',
  },
  footer: {
    location: 'Barrie & GTA, Canada · Blumenau, SC, Brazil',
    rights: 'All rights reserved.',
  },
};
