import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Header } from "../../shared/header/header";
import { Gradient } from "../../shared/gradient/gradient";
import { NgOptimizedImage } from "@angular/common";

interface EngineeringNote {
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Gradient, NgOptimizedImage],
  templateUrl: './home.html',
})
export class Home {
  readonly currentYear = new Date().getFullYear();

  engineeringNotes = signal<EngineeringNote[]>([
    {
      title: 'Escalando Angular em Monorepos com Nx',
      description: 'Estratégias para gerenciar grandes codebases e otimizar o build de aplicações complexas.',
      link: '#'
    },
    {
      title: 'Spring Boot vs. NestJS em 2025: Uma Análise Arquitetural',
      description: 'Comparativo de performance, ecossistema e padrões para microsserviços de alta performance.',
      link: '#'
    },
    {
      title: 'Clean Architecture na Prática com Ports & Adapters',
      description: 'Um guia aprofundado para construir sistemas desacoplados, testáveis e fáceis de manter.',
      link: '#'
    }
  ]);
}
