import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { GrowUp } from '../../shared/grow-up/grow-up';
import { Card } from '../../shared/card/card';
import { Cards } from '../../core/models/interfaces';

@Component({
  selector: 'app-landing',
  imports: [Header, GrowUp, Card],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  boldFont = `text-green font-semibold text-lg`
  
  cards: Cards[] = [
    {
      icon: 'sparkles',
      title: 'IA e Automação de Entregáveis',
      description: `Esqueça processos manuais demorados. Implementação de motores de Inteligência Artificial para gerar relatórios, documentos e materiais ultra-personalizados em segundos.`,
    },
    {
      icon: 'cog',
      title: 'Sistemas Orientados a Regras',
      description: `Automação de fluxos complexos. De agendamentos dinâmicos a alocação de recursos, construo motores que tomam decisões e se auto-reorganizam sem intervenção humana.`,
    },
    {
      icon: 'cloud',
      title: 'FinOps e Arquitetura',
      description: `O fim da conta de servidor ocioso. Sua plataforma escalando automaticamente para milhares de acessos, mas cobrando apenas pelo que você efetivamente usa. Alta disponibilidade com custo de infraestrutura próximo a zero.`,
    },
  ];

  testimonials: Cards[] = [
    {
      icon: 'edu',
      title: 'Plataforma de cursos B2C',
      description: `Desenvolvimento de módulo de IA Generativa que eliminou gargalos operacionais, reduzindo o tempo de produção de materiais personalizados <b class="${this.boldFont}">de 5 dias para apenas 2 minutos.</b>`
    },
    {
      icon: 'clipboard',
      title: 'CRM de Consultoria B2B',
      description: ` Automação na criação e entrega de análises sob medida, derrubando o tempo de processamento por cliente <b class="${this.boldFont}">de 3 horas para 1 minuto</b>.`
    },
    {
      icon: 'trending-up',
      title: 'Escala Serverless',
      description: `Implementação de arquitetura modular Serverless para um sistema com crescimento de demanda, garantindo alta disponibilidade e mantendo o <b class="${this.boldFont}">custo de infraestrutura próximo a 0%.</b>`
    }
  ]
}
