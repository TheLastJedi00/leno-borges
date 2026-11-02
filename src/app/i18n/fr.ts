import type { Dictionary } from './dictionary';
import { projectUrls } from '../pages/home/home.data';

// Français canadien (OQLF) : « courriel », « infonuagique », espace insécable avant « : » et
// espace fine avant « ? ». À faire relire par un locuteur natif avant publication.
export const fr: Dictionary = {
  meta: {
    htmlLang: 'fr-CA',
    title:
      'Leno Borges — Développeur logiciel full stack et formateur techno | Barrie et RGT, Ontario',
    description:
      'Leno Borges, développeur logiciel full stack (TypeScript, Angular, Node.js/NestJS, Java/Spring Boot) et formateur techno à Barrie et dans la RGT, Ontario, Canada, et à Blumenau, Brésil. Plateformes SaaS et EdTech, API REST, IA générative et architecture infonuagique sans serveur.',
  },
  header: {
    navLabel: 'Principale',
    home: 'Leno Borges — accueil',
    nav: { about: 'À propos', experience: 'Expérience', skills: 'Compétences', education: 'Formation' },
    contact: 'Me joindre',
    langLabel: 'Langue',
    langNames: { en: 'English', fr: 'Français (Canada)', pt: 'Português (Brasil)' },
  },
  hero: {
    location: 'Barrie et RGT, Canada · Blumenau, SC, Brésil',
    roleLead: 'Développeur logiciel full stack',
    roleTail: 'formateur techno',
    tagline:
      'Plateformes SaaS et EdTech de bout en bout avec TypeScript, Angular, NestJS et Java/Spring, où l’IA générative automatise l’opérationnel.',
    ctaExperience: 'Voir l’expérience ↓',
    ctaContact: 'Me joindre',
  },
  owner: {
    alt: 'Leno Borges, en blouson de cuir noir, expliquant un concept en classe chez ProWay',
    caption: 'En classe · ProWay, Blumenau',
  },
  about: {
    title: 'À propos',
    summary:
      'Développeur logiciel full stack expérimenté dans la conception de plateformes SaaS et de solutions EdTech de bout en bout avec Angular, NestJS et l’écosystème Java/Spring. Axé sur la traduction de règles d’affaires complexes en architectures modulaires et efficaces.',
    summaryExtra:
      'Solide expérience pratique de l’intégration de l’IA générative pour automatiser les processus opérationnels, avec des choix d’architecture attentifs aux coûts, comme la migration d’un monolithe vers le sans serveur et le changement d’hébergeur. Profil pratique avec un historique de mentorat technique, alliant livraison agile et souci réel du produit et de l’utilisateur final.',
    metrics: [
      {
        value: '5 jours → 2 min',
        label: 'Production de matériel pédagogique avec l’IA générative chez BF Academy',
      },
      {
        value: '3 h → 1 min',
        label: 'Création de matériel personnalisé par l’IA générative chez Matriz do DNA',
      },
    ],
  },
  experience: {
    title: 'Expérience',
    lead: 'Leadership technique et ingénierie de bout en bout de solutions SaaS et EdTech, automatisation par l’IA et formation de développeurs.',
    techsLabel: 'Technologies',
    visit: 'Visiter',
    newTab: '(s’ouvre dans un nouvel onglet)',
    items: [
      {
        title: 'Liga Dev',
        subtitle: 'Cours de programmation personnel',
        role: 'Fondateur',
        period: '2026 — aujourd’hui',
        location: 'À distance',
        badge: 'En cours',
        url: projectUrls.ligaDev,
        techs: ['Angular', 'NestJS', 'Serverless', 'IA générative', 'FinOps', 'CI/CD'],
        paths: [
          {
            path: 'Cours de programmation',
            description:
              'Création de mon propre cours de programmation, alliant mon expérience de formateur technique à une plateforme maison.',
          },
          {
            path: 'Plateforme',
            description:
              'Bâtie sur la même architecture que BF Academy, avec Angular au frontal et NestJS en arrière-plan.',
          },
          {
            path: 'IA générative et FinOps',
            description:
              'Matériel personnalisé généré par l’IA et infrastructure sans serveur au coût quasi nul, avec des pipelines CI/CD.',
          },
        ],
      },
      {
        title: 'Delcastanher',
        subtitle: 'Services administratifs · Projet à la pige',
        role: 'Développeur full stack',
        period: 'sept. 2026 — aujourd’hui',
        location: 'À distance',
        badge: 'Actuel',
        url: projectUrls.delcastanher,
        techs: ['Angular', 'NestJS', 'Serverless', 'PostgreSQL'],
        paths: [
          {
            path: 'Plateforme',
            description:
              'Développement full stack de la plateforme de l’Imersão RH Estratégico (programme de RH stratégique), avec Angular au frontal et NestJS en arrière-plan.',
          },
          {
            path: 'Données',
            description: 'Modélisation et persistance des données avec PostgreSQL.',
          },
          {
            path: 'Sans serveur',
            description: 'Architecture sans serveur à haute disponibilité, sans coût de serveur inactif.',
          },
        ],
      },
      {
        title: 'Tichr',
        subtitle: 'Plateforme SaaS éducative multiforfait',
        role: 'Développeur full stack',
        period: 'avr. 2026 — aujourd’hui',
        location: 'À distance',
        url: projectUrls.tichr,
        badge: 'Actuel',
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
            path: 'Plateforme de bout en bout',
            description:
              'Développement d’une plateforme SaaS éducative multiforfait avec Angular 20 (Signals, Standalone) au frontal et NestJS 11 avec Firebase en arrière-plan.',
          },
          {
            path: 'Moteur de planification',
            description:
              'Moteur à base de règles qui projette et recalcule dynamiquement les horaires scolaires, éliminant le travail manuel de report des dates en cas d’imprévu.',
          },
          {
            path: 'CQRS et temps réel',
            description:
              'Architecture hybride fondée sur le CQRS et une séparation stricte des composants Smart et Dumb, combinant des commandes par API REST et la lecture d’état en temps réel (Firestore) pour des jeux éducatifs multijoueurs.',
          },
          {
            path: 'IA générative et sécurité',
            description:
              'Intégration de Gemini pour la création automatisée de contenu pédagogique et authentification personnalisée par NIP avec JWT, axée sur la sécurité et l’isolement du portail étudiant.',
          },
        ],
      },
      {
        title: 'ProWay',
        subtitle: 'Éducation, formation de développeurs et consultation',
        role: 'Formateur technique',
        period: 'janv. 2026 — aujourd’hui',
        location: 'Blumenau, SC, Brésil · Temps partiel',
        badge: 'Actuel',
        techs: ['Java', 'POO', 'Node.js', 'SQL', 'Angular', 'JavaScript', 'TypeScript', 'Git'],
        paths: [
          {
            path: 'Tech Explorers',
            description:
              'Initiation à la programmation et à la pensée informatique pour les adolescents.',
          },
          {
            path: 'Formation et spécialisation',
            description:
              'Formation technique intensive pour jeunes et adultes en réorientation de carrière ou en spécialisation.',
          },
          {
            path: 'Entreprises',
            description:
              'Consultation et formation sur mesure pour les entreprises, les entrepreneurs et les cadres.',
          },
        ],
      },
      {
        title: 'Matriz do DNA',
        subtitle: 'Plateforme de formation pour entrepreneures · Pige',
        role: 'Développeur',
        period: 'janv. 2026 — aujourd’hui',
        location: 'À distance',
        badge: 'En cours',
        techs: ['Angular', 'NestJS', 'Gemini', 'Serverless', 'CI/CD'],
        paths: [
          {
            path: 'Plateforme',
            description:
              'Développement, avec Angular et NestJS, de la plateforme d’une entrepreneure qui forme d’autres entrepreneures.',
          },
          {
            path: 'Contenu avec Gemini',
            description:
              'Module d’IA générative avec Gemini qui personnalise le matériel de chaque élève, réduisant le temps de production de 3 heures à 1 minute.',
          },
          {
            path: 'Sans serveur et CI/CD',
            description:
              'Même architecture modulaire sans serveur que BF Academy, à haute disponibilité, sans coût d’inactivité et avec des pipelines CI/CD.',
          },
        ],
      },
      {
        title: 'BF Academy',
        subtitle: 'EdTech et LMS propriétaire',
        role: 'Cofondateur · Développeur logiciel',
        period: 'oct. 2025 — aujourd’hui',
        location: 'À distance',
        url: projectUrls.bfAcademy,
        badge: 'Cofondateur',
        techs: ['Angular', 'NestJS', 'Serverless', 'IA générative', 'FinOps', 'CI/CD'],
        paths: [
          {
            path: 'LMS de bout en bout',
            description:
              'Leadership technique et développement de bout en bout d’un LMS, avec Angular au frontal et NestJS en arrière-plan.',
          },
          {
            path: 'IA générative',
            description:
              'Module qui a automatisé la création de matériel pédagogique, réduisant le temps de production de 5 jours à 2 minutes.',
          },
          {
            path: 'FinOps',
            description:
              'Architecture modulaire fondée sur des services sans serveur, maintenant les coûts d’infrastructure près de 0 %, avec des pipelines CI/CD pour le déploiement automatisé.',
          },
        ],
      },
      {
        title: 'Système de prise de rendez-vous',
        subtitle: 'Projet autonome',
        role: 'Développeur',
        period: 'oct. 2025 — nov. 2025',
        location: 'Blumenau, SC, Brésil',
        techs: ['Angular', 'Serverless'],
        paths: [
          {
            path: 'Rendez-vous en ligne',
            description: 'Développement d’un système de prise de rendez-vous en ligne avec Angular.',
          },
          {
            path: 'Monolithe → sans serveur',
            description:
              'Migration d’une architecture monolithique vers le sans serveur, éliminant les coûts de serveurs inactifs et augmentant la disponibilité.',
          },
        ],
      },
    ],
  },
  skills: {
    title: 'Compétences',
    groups: [
      { category: 'Langages', skills: ['TypeScript', 'Java', 'JavaScript', 'SQL'] },
      {
        category: 'Cadriciels et bibliothèques',
        skills: ['Angular', 'Node.js', 'NestJS', 'Spring Boot', 'RxJS', 'Signals'],
      },
      {
        category: 'Architecture et patrons',
        skills: ['API REST', 'Clean Architecture', 'Serverless', 'SOLID', 'Design Patterns', 'CQRS'],
      },
      {
        category: 'Infonuagique et DevOps',
        skills: ['Docker', 'CI/CD', 'GCP', 'Firebase', 'Vercel', 'Git/GitHub'],
      },
      { category: 'Intelligence artificielle', skills: ['Intégration de LLM', 'AI Studio'] },
      { category: 'Bases de données', skills: ['PostgreSQL', 'MySQL', 'Firestore'] },
    ],
  },
  education: {
    title: 'Formation',
    items: [
      {
        title: 'Bootcamp en soutien AMS',
        institution: 'T-Systems / ProWay',
        period: 'déc. 2025',
        modules: [
          {
            name: 'Gestion des services et des processus',
            hours: 'ITIL et ITSM · 44 h',
            description:
              'Approche axée sur les services et les SLA pour organiser le travail des équipes et assurer des livraisons constantes.',
          },
          {
            name: 'Leadership d’équipes diversifiées',
            hours: 'Compétences humaines et communication · 24 h',
            description:
              'Intelligence émotionnelle et service à la clientèle pour gérer les parties prenantes et harmoniser les attentes entre équipes techniques et secteurs d’affaires.',
          },
          {
            name: 'Vision globale de l’architecture',
            hours: 'Infonuagique, DevOps et réseaux · 36 h',
            description:
              'Compréhension de l’infrastructure qui soutient le code, pour diriger des déploiements critiques et des discussions d’architecture.',
          },
          {
            name: 'Mentorat et excellence technique',
            hours: 'Java, API et BD · 100 h+',
            description:
              'Référence technique et mentor pour les collègues de classe pendant les projets pratiques — ce qui a mené à une invitation à se joindre à l’équipe de formateurs de ProWay.',
          },
        ],
      },
      {
        title: 'Analyse et développement de systèmes',
        institution: 'Uniasselvi',
        period: 'Fin prévue 06/2027',
      },
    ],
  },
  languages: {
    title: '05 — Langues',
    items: [
      { name: 'Portugais', level: 'Langue maternelle' },
      { name: 'Anglais', level: 'Intermédiaire (B1)' },
    ],
  },
  contact: {
    eyebrow: 'Me joindre',
    titleLead: 'On se',
    titleAccent: 'parle ?',
    emailLabel: 'Courriel',
    whatsappMessage: 'Bonjour Leno, j’ai vu votre portfolio et j’aimerais discuter avec vous !',
  },
  footer: {
    location: 'Barrie et RGT, Canada · Blumenau, SC, Brésil',
    rights: 'Tous droits réservés.',
  },
};
