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
}
