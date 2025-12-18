import { Component, inject, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Gradient } from "../../shared/gradient/gradient";
import { NgOptimizedImage } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-bfacademy',
  imports: [ Header, Gradient, NgOptimizedImage],
  templateUrl: './bfacademy.html',
})
export class Bfacademy {
  private sanitizer = inject(DomSanitizer)
  readonly videoId = signal<string>('meO3Z8a_6QQ');
  getSafeUrl(): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${this.videoId()}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
