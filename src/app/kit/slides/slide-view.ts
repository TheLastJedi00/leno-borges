import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Slide, Syntax } from '../kit.data';
import { CoverView } from './cover-view';
import { SceneView } from './scene-view';
import { CardsView } from './cards-view';
import { TableView } from './table-view';
import { SortView } from './sort-view';
import { PredictView } from './predict-view';
import { ExprView } from './expr-view';
import { TruthView } from './truth-view';
import { CircuitView } from './circuit-view';

/** Moldura comum de um slide (título, selo de aprofundamento) e escolha do layout pelo `kind`. */
@Component({
  selector: 'kit-slide-view',
  imports: [
    CoverView,
    SceneView,
    CardsView,
    TableView,
    SortView,
    PredictView,
    ExprView,
    TruthView,
    CircuitView,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block' },
  template: `
    @let s = slide();
    @if (s.description) {
      <p class="sr-only">{{ s.description }}</p>
    }
    @if (s.tag) {
      <span
        class="absolute top-10 right-12 z-10 rounded-full bg-accent/10 px-4 py-1.5 font-mono text-[15px] uppercase tracking-wider text-accent-soft"
      >
        {{ s.tag }}
      </span>
    }
    @switch (s.kind) {
      @case ('cover') {
        <kit-cover-view [slide]="s" [syntax]="syntax()"></kit-cover-view>
      }
      @case ('scene') {
        <kit-scene-view [slide]="s" [step]="step()" [syntax]="syntax()"></kit-scene-view>
      }
      @case ('cards') {
        <kit-cards-view [slide]="s" [step]="step()" [syntax]="syntax()"></kit-cards-view>
      }
      @case ('table') {
        <kit-table-view [slide]="s" [syntax]="syntax()"></kit-table-view>
      }
      @case ('sort') {
        <kit-sort-view [slide]="s" [syntax]="syntax()"></kit-sort-view>
      }
      @case ('predict') {
        <kit-predict-view [slide]="s" [step]="step()" [syntax]="syntax()"></kit-predict-view>
      }
      @case ('expr') {
        <kit-expr-view [slide]="s" [step]="step()" [syntax]="syntax()"></kit-expr-view>
      }
      @case ('truth') {
        <kit-truth-view [slide]="s" [step]="step()" [syntax]="syntax()"></kit-truth-view>
      }
      @case ('circuit') {
        <kit-circuit-view [slide]="s" [syntax]="syntax()"></kit-circuit-view>
      }
    }
  `,
})
export class SlideView {
  slide = input.required<Slide>();
  step = input(0);
  syntax = input.required<Syntax>();
}
