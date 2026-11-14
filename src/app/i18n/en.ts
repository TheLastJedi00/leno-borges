import type { Dictionary } from './dictionary';
import { kitPaths, partners, projectUrls } from '../pages/home/home.data';

// Inglês canadense; termos de mercado de Barrie/GTA (ver .specs/002 - Ajustes/context.md)
export const en: Dictionary = {
  meta: {
    htmlLang: 'en',
    title: 'Leno Borges, Full-Stack Software Developer & Tech Educator | Barrie & GTA, Ontario',
    description:
      'Leno Borges, Full-Stack Software Developer (TypeScript, Angular, Node.js/NestJS, Java/Spring Boot) and Tech Educator in Barrie & GTA, Ontario, Canada and Blumenau, Brazil. SaaS and EdTech platforms, REST APIs, generative AI and serverless, cloud-native architecture.',
  },
  header: {
    navLabel: 'Main',
    home: 'Leno Borges home page',
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
      'End-to-end SaaS and EdTech platforms with TypeScript, Angular, NestJS and Java/Spring, using generative AI to automate operations.',
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
      'Strong hands-on experience integrating generative AI to automate operational processes, with cost-aware architecture decisions such as moving a monolith to serverless and switching hosting providers. Hands-on profile with a track record of technical mentoring, combining agile delivery with genuine care for the product and the end user.',
    metrics: [
      {
        value: '5 days → 2 min',
        label: 'Course material production with generative AI at BF Academy',
      },
      {
        value: '3 h → 1 min',
        label: 'Personalized material creation with generative AI at Matriz do DNA',
      },
    ],
  },
  experience: {
    title: 'Experience',
    lead: 'Technical leadership and end-to-end engineering of SaaS and EdTech solutions, AI automation and developer training.',
    techsLabel: 'Technologies',
    visit: 'Visit',
    newTab: '(opens in a new tab)',
    items: [
      {
        title: 'Liga Dev',
        subtitle: 'Own Coding Course',
        role: 'Founder',
        period: 'Since 2026',
        location: 'Remote',
        badge: 'In progress',
        url: projectUrls.ligaDev,
        techs: ['Angular', 'NestJS', 'Serverless', 'Generative AI', 'CI/CD'],
        paths: [
          {
            path: 'Coding course',
            description:
              'Creating my own programming course, combining my technical instructor experience with a proprietary platform.',
          },
          {
            path: 'Platform',
            description:
              'Built on the same architecture as BF Academy, with Angular on the front end and NestJS on the back end.',
          },
          {
            path: 'Generative AI & Serverless',
            description:
              'AI-generated personalized material on serverless infrastructure, with CI/CD pipelines.',
          },
        ],
      },
      {
        title: 'Delcastanher',
        partners: [partners.lidianeDelcastanher],
        subtitle: 'Administrative Services · Freelance project',
        role: 'Full-Stack Developer',
        period: 'Since Sep 2026',
        location: 'Remote',
        badge: 'Current',
        url: projectUrls.delcastanher,
        techs: ['Angular', 'NestJS', 'Serverless', 'PostgreSQL'],
        paths: [
          {
            path: 'Platform',
            description:
              'Full-stack development of the Imersão RH Estratégico (strategic HR programme) platform, with Angular on the front end and NestJS on the back end.',
          },
          {
            path: 'Data',
            description: 'Data modelling and persistence with PostgreSQL.',
          },
          {
            path: 'Serverless',
            description: 'Serverless architecture with high availability.',
          },
        ],
      },
      {
        title: 'Tichr',
        subtitle: 'Multi-plan educational SaaS platform',
        role: 'Full-Stack Developer',
        period: 'Since Apr 2026',
        location: 'Remote',
        url: projectUrls.tichr,
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
        partners: [partners.proway],
        kitPath: kitPaths.root,
        subtitle: 'Education, Developer Training & Consulting',
        role: 'Technical Instructor',
        period: 'Since Jan 2026',
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
        title: 'Matriz do DNA',
        partners: [partners.paulaMarjorie],
        subtitle: 'Training Platform for Women Entrepreneurs · Freelance',
        role: 'Developer',
        period: 'Since Jan 2026',
        location: 'Remote',
        badge: 'In progress',
        techs: ['Angular', 'NestJS', 'Gemini', 'Serverless', 'CI/CD'],
        paths: [
          {
            path: 'Platform',
            description:
              'Built, with Angular and NestJS, the platform of an entrepreneur who trains other women entrepreneurs.',
          },
          {
            path: 'Content with Gemini',
            description:
              'Generative AI module using Gemini that personalizes each student’s material, cutting production time from 3 hours to 1 minute.',
          },
          {
            path: 'Serverless & CI/CD',
            description:
              'Same modular serverless architecture as BF Academy, with high availability and CI/CD pipelines.',
          },
        ],
      },
      {
        title: 'BF Academy',
        partners: [partners.barbaraFarias],
        subtitle: 'EdTech & proprietary LMS',
        role: 'Co-founder · Software Developer',
        period: 'Since Oct 2025',
        location: 'Remote',
        url: projectUrls.bfAcademy,
        badge: 'Co-founder',
        techs: ['Angular', 'NestJS', 'Serverless', 'Generative AI', 'Vercel', 'CI/CD'],
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
            path: 'Cloud Run → Vercel',
            description:
              'Moved a service from Cloud Run to Vercel to lower hosting costs, within a modular serverless architecture with CI/CD pipelines.',
          },
        ],
      },
      {
        title: 'Scheduling System',
        subtitle: 'Independent project',
        role: 'Developer',
        period: 'Oct 2025 to Nov 2025',
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
  partners: {
    label: 'Partner',
    linkedin: 'LinkedIn profile',
  },
  education: {
    title: 'Education',
    items: [
      {
        title: 'AMS Support Bootcamp',
        institution: 'T-Systems / ProWay',
        partners: [partners.tsystems, partners.proway],
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
              'Technical reference and mentor to classmates during hands-on projects, which led to an invitation to join ProWay’s instructor team.',
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
    title: '05 · Languages',
    items: [
      { name: 'Portuguese', level: 'Native' },
      { name: 'English', level: 'Intermediate (B1)' },
      { name: 'French', level: 'Beginner (A1)' },
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
  kit: {
    cardButton: 'Teaching kit',
    meta: {
      title: 'Teaching kit · Leno Borges',
      description:
        'Free interactive programming presentations, no login: programming logic with examples in JavaScript, TypeScript and Java.',
      lessonSuffix: ' · Teaching kit · Leno Borges',
    },
    ptOnly: 'Lesson content is available in Portuguese.',
    catalog: {
      eyebrow: 'Teaching material',
      title: 'Teaching kit',
      intro:
        'Interactive presentations I use in my classes, open for anyone to watch, no login required. Pick the class language and the outline, from a quick review to a full lesson.',
      back: 'Back to portfolio',
      duration: 'Duration',
      slides: 'Slides',
      essentialSlides: 'essential',
      totalSlides: 'in total',
      syntax: 'Syntax',
      mode: 'Outline',
      present: 'Present',
    },
    modes: { essencial: 'Essential', completo: 'Full' },
    modeHints: {
      essencial: 'Just what closes the topic, about 10 min',
      completo: 'With deep dives, fun facts and exercises',
    },
    tracks: {
      'logica-de-programacao': {
        title: 'Programming Logic',
        description: 'The foundation to start programming in any language.',
        lessons: {
          'variaveis-e-tipos': {
            title: 'Variables and Data Types',
            summary:
              'How a program stores, names and recognizes information, explained with chests, labels and items.',
            duration: '10 min to 4 h',
          },
          'operadores-aritmeticos': {
            title: 'Arithmetic Operators',
            summary:
              'How to do math with stored values: the five operators, the order of operations and assignment shortcuts.',
            duration: '10 min to 3 h',
          },
          'operadores-relacionais': {
            title: 'Relational Operators',
            summary:
              'How to compare values and get a true or false answer, explained with a balance scale.',
            duration: '10 min to 3 h',
          },
        },
      },
    },
    player: {
      loading: 'Loading lesson…',
      controls: 'Presentation controls',
      back: 'Back to kit',
      prev: 'Previous',
      next: 'Next',
      fullscreen: 'Full screen',
      exitFullscreen: 'Exit full screen',
      presenter: 'Open presenter window',
      syntax: 'Syntax',
      mode: 'Outline',
      slide: 'Slide',
      of: 'of',
      slideRole: 'slide',
      progress: 'Presentation progress',
      end: {
        badge: 'End of lesson',
        question: 'Continue to the next lesson?',
        nextLabel: 'Next lesson',
        follow: 'Continue',
        stay: 'Stay on this lesson',
        hint: '→ or Enter to continue · Esc to stay',
      },
    },
    presenter: {
      title: 'Presenter',
      current: 'Now',
      next: 'Next',
      end: 'End of lesson',
      notes: 'Talking points',
      noNotes: 'No talking points on this slide.',
      timer: 'Time',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      hint: 'This window controls the presentation. The class only sees the main window.',
    },
    exercise: {
      correct: 'Correct!',
      wrong: 'Not yet. Try another one.',
      reset: 'Reset',
      sortHint: 'Drag each item to the right chest, or click the item and then the chest.',
      items: 'Items',
      placedIn: 'stored in',
      done: 'Every item is in place!',
      choose: 'Pick an answer',
      reveal: 'Show the execution',
      answer: 'Answer',
    },
  },
};
