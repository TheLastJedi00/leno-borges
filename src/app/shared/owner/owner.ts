import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-owner',
  imports: [NgOptimizedImage],
  templateUrl: './owner.html',
  styleUrl: './owner.css',
})
export class Owner {
  readonly t = inject(I18n).t;
}
