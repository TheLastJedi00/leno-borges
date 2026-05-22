import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Links } from '../../shared/links/links';
import { Owner } from '../../shared/owner/owner';
import { ExperienceCard } from '../../shared/experience-card/experience-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Links, Owner, ExperienceCard],
  templateUrl: './home.html',
})
export class Home {
  readonly currentYear = new Date().getFullYear();

  experiences = [
    {
      title: 'ProWay IT Training',
      subtitle: 'Educação e Formação de novos Devs',
      path: [
        {
          path: 'Tech Explorers',
          description: `Introdução à programação e pensamento computacional para adolescentes. O foco é criar uma
        fundação sólida de lógica antes que tenham contato com os vícios do mercado, desenvolvendo a
        capacidade de resolução de problemas desde cedo.`,
        },
        {
          path: 'Entra 21',
          description: `Treinamento técnico intensivo para jovens e adultos em transição de carreira ou
        especialização. Ensino tecnologias e ferramentas de mercado de forma pragmática, preparando
        os alunos para os desafios reais da engenharia de software e da vivência em equipes de
        desenvolvimento.`,
        },
        {
          path: 'Treinamentos VIPs Corporativos',
          description: `Consultoria e capacitação sob medida para empresas, empresários e executivos. Traduzo a
        complexidade técnica em soluções de negócio, nivelando equipes e fornecendo a visão
        arquitetural necessária para que as empresas não fiquem reféns de tecnologias ou processos
        ineficientes.`,
        },
      ],
    },
    {
      title: 'BF Academy',
      subtitle: 'EdTech Platform',
      path: [
        {
          path: 'Desafio',
          description: `Escalar a produção de conteúdo educacional e criar uma experiência de aprendizado
                  fluida para alunos de vários estados do país.`,
        },
        {
          path: 'Solução',
          description: `Desenvolvimento de uma plataforma LMS proprietária, integrando IA Generativa
                  (Gemini API) para automação na criação e personalização de conteúdo.`,
        },
        {
          path: 'Resultado',
          description: `Automação de mais de 75% dos processos de criação de conteúdo e garantia de alta
                  disponibilidade.`,
        },
      ],
    },
  ];
}
