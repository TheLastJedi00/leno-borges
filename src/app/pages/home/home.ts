import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Links } from '../../shared/links/links';
import { Owner } from '../../shared/owner/owner';
import { ExperienceCard } from '../../shared/experience-card/experience-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Links, Owner, ExperienceCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  readonly currentYear = new Date().getFullYear();

  experiences = [
    {
      title: 'Tichr',
      subtitle: 'Plataforma SaaS Educacional Multiplano',
      role: 'Desenvolvedor Fullstack',
      period: 'Abril 2026 – Presente',
      location: 'Remoto',
      badge: 'Atual',
      techs: [
        'Angular 20 (Signals)',
        'NestJS 11',
        'Firebase',
        'Firestore',
        'Gemini AI',
        'CQRS',
        'JWT',
      ],
      path: [
        {
          path: 'Motor de Agendamento Dinâmico',
          description:
            'Engenharia de um motor algorítmico orientado a regras que projeta e recalcula grades escolares dinamicamente, eliminando 100% do retrabalho manual de reposicionamento de datas frente a imprevistos.',
        },
        {
          path: 'Arquitetura CQRS & Tempo Real',
          description:
            'Arquitetura híbrida com separação estrita Smart/Dumb Components, sincronizando comandos REST API com streaming em tempo real (Cloud Firestore) para sustentar jogos multiplayer educativos com baixa latência.',
        },
        {
          path: 'IA Generativa & Segurança',
          description:
            'Integração de Google Gemini para automação da geração de conteúdo didático e implementação de sistema customizado de autenticação por PIN via JWT focado em segurança e isolamento para o portal do aluno.',
        },
      ],
    },
    {
      title: 'ProWay IT Training',
      subtitle: 'Educação, Formação de Devs & Consultoria',
      role: 'Instrutor Técnico & Consultor em Tecnologia',
      period: 'Janeiro 2026 – Atual',
      location: 'Blumenau, SC (Part-Time)',
      badge: 'Atual',
      techs: [
        'Java',
        'Spring Boot',
        'POO',
        'Node.js',
        'Angular',
        'TypeScript',
        'SQL',
        'Git/GitHub',
      ],
      path: [
        {
          path: 'Entra 21 & Especialização',
          description:
            'Treinamento técnico intensivo para jovens e adultos em transição de carreira ou especialização (Java/Spring Boot, Node.js, Angular, TypeScript, SQL e Git), preparando alunos de forma pragmática para os desafios reais da engenharia de software.',
        },
        {
          path: 'Treinamentos VIPs Corporativos',
          description:
            'Consultoria e capacitação sob medida para empresas, empresários e executivos. Tradução de complexidade técnica em soluções estratégicas de negócio, nivelando equipes e fornecendo visão arquitetural.',
        },
        {
          path: 'Tech Explorers',
          description:
            'Introdução à programação e pensamento computacional para adolescentes, desenvolvendo base sólida de lógica e resolução de problemas desde cedo.',
        },
      ],
    },
    {
      title: 'Plataforma de Consultoria',
      subtitle: 'Soluções Corporativas B2B',
      role: 'Desenvolvedor Fullstack Freelancer',
      period: 'Janeiro 2026 – Março 2026',
      location: 'Remoto',
      techs: ['Angular', 'NestJS', 'Serverless', 'Generative AI', 'CI/CD Pipelines', 'TypeScript'],
      path: [
        {
          path: 'Automação com IA Generativa',
          description:
            'Implementação de pipeline de IA Generativa para criação automatizada de material e diagnósticos personalizados, reduzindo o tempo de produção por cliente de 3 horas para apenas 1 minuto (~99% de ganho de eficiência).',
        },
        {
          path: 'Arquitetura Serverless',
          description:
            'Estruturação modular baseada em serviços Serverless com Angular e NestJS, garantindo alta disponibilidade e custo zero de infraestrutura ociosa.',
        },
        {
          path: 'Esteiras de CI/CD',
          description:
            'Configuração de pipelines automatizados de CI/CD para deploy contínuo, validação de tipagem e gestão de qualidade de código em produção.',
        },
      ],
    },
    {
      title: 'BF Academy',
      subtitle: 'EdTech Platform & LMS Proprietário',
      role: 'Cofundador & Engenheiro de Software',
      period: 'Outubro 2025 – Atual',
      location: 'Remoto',
      badge: 'Cofundador',
      techs: [
        'Angular',
        'NestJS',
        'FinOps',
        'Serverless',
        'Gemini API',
        'CI/CD',
        'Clean Architecture',
      ],
      path: [
        {
          path: 'LMS End-to-End',
          description:
            'Liderança técnica e desenvolvimento de ponta a ponta de uma plataforma LMS proprietária, integrando frontend reativo em Angular com serviços modulares em NestJS sob princípios de Clean Architecture.',
        },
        {
          path: 'IA Generativa no Conteúdo',
          description:
            'Criação de motor com Gemini API para estruturação automatizada de material didático e exercícios, derrubando o ciclo de produção de 5 dias úteis para apenas 2 minutos.',
        },
        {
          path: 'Estratégia FinOps',
          description:
            'Arquitetura modular orientada a microsserviços Serverless sob demanda, viabilizando o crescimento acelerado da plataforma com custo de infraestrutura próximo a 0%.',
        },
      ],
    },
    {
      title: 'Sistema de Agendamento',
      subtitle: 'Modernização Arquitetural & Web App',
      role: 'Desenvolvedor Fullstack Autônomo',
      period: 'Outubro 2025 – Novembro 2025',
      location: 'Blumenau, SC',
      techs: ['Angular', 'Serverless', 'Cloud Functions', 'TypeScript'],
      path: [
        {
          path: 'Desenvolvimento Reativo',
          description:
            'Desenvolvimento de sistema responsivo de agendamento online com interface moderna, reativa e intuitiva em Angular.',
        },
        {
          path: 'Migração Monólito para Serverless',
          description:
            'Migração da arquitetura monolítica para Serverless em nuvem, eliminando custos de servidores ociosos e maximizando a disponibilidade e resiliência operacional.',
        },
      ],
    },
  ];
}

