import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { AdVariation, Generation } from '../ads/ad.types';
import { AdAssets } from '../core/ad-assets';
import { AdVariationCard } from './ad-variation';

const generation = (variation: AdVariation): Generation => ({
  id: 'g1',
  created_at: '2026-11-24T10:00:00Z',
  theme: 'Tema',
  format: 'post',
  network: 'linkedin',
  lang: 'en',
  slide_count: 1,
  variations: [variation],
  background_path: null,
  model: 'm',
});

function render(variation: AdVariation) {
  TestBed.configureTestingModule({
    imports: [AdVariationCard],
    providers: [provideZonelessChangeDetection(), { provide: AdAssets, useValue: {} }],
  });
  const fixture = TestBed.createComponent(AdVariationCard);
  fixture.componentRef.setInput('generation', generation(variation));
  fixture.componentRef.setInput('variation', variation);
  fixture.componentRef.setInput('number', 1);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AdVariationCard', () => {
  it('com html, mostra a arte criada pelo Gemini', () => {
    const el = render({
      angle: 'a',
      slides: [{ title: 'T', html: '<div style="width:1080px;height:1440px"><h1>Arte do Gemini</h1></div>' }],
      caption: 'c',
      hashtags: [],
    });
    expect(el.querySelector('app-ad-html-piece')).toBeTruthy();
    expect(el.querySelector('app-ad-post')).toBeNull();
    expect(el.textContent).toContain('Arte do Gemini');
  });

  it('sem html (geracao antiga), cai no template fixo', () => {
    const el = render({ angle: 'a', slides: [{ title: 'Titulo antigo' }], caption: 'c', hashtags: [] });
    expect(el.querySelector('app-ad-html-piece')).toBeNull();
    expect(el.querySelector('app-ad-post')).toBeTruthy();
  });
});
