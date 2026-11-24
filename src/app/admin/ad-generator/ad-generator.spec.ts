import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdApi } from '../core/ad-api';
import { AdAssets } from '../core/ad-assets';
import { AdHistory } from '../core/ad-history';
import type { Generation } from '../ads/ad.types';
import { AdGenerator } from './ad-generator';

describe('AdGenerator (formulario)', () => {
  let fixture: ComponentFixture<AdGenerator>;
  let generate: jasmine.Spy;
  let history: { list: jasmine.Spy; remove: jasmine.Spy };
  const saved = { id: 'old', theme: 'Tema antigo', format: 'post', network: 'instagram', lang: 'pt', created_at: '2026-11-20T10:00:00Z', variations: [], background_path: null } as unknown as Generation;

  beforeEach(() => {
    generate = jasmine.createSpy('generate');
    history = {
      list: jasmine.createSpy('list').and.resolveTo([saved]),
      remove: jasmine.createSpy('remove').and.resolveTo(),
    };
    TestBed.configureTestingModule({
      imports: [AdGenerator],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AdApi, useValue: { generate } },
        { provide: AdHistory, useValue: history },
        { provide: AdAssets, useValue: { background: () => Promise.resolve('data:image/png;base64,AA==') } },
      ],
    });
    fixture = TestBed.createComponent(AdGenerator);
    fixture.detectChanges();
  });

  it('so manda slideCount no carrossel', () => {
    const c = fixture.componentInstance;
    c.theme.set('  Tema com folga  ');
    c.format.set('carousel');
    c.slideCount.set(7);
    expect(c.request()).toEqual({
      theme: 'Tema com folga',
      format: 'carousel',
      network: 'linkedin',
      lang: 'en',
      withBackground: false,
      slideCount: 7,
    });
    c.format.set('story');
    expect(c.request().slideCount).toBeUndefined();
  });

  it('nao deixa enviar com tema curto', () => {
    const c = fixture.componentInstance;
    c.theme.set('ab');
    expect(c.canSubmit()).toBeFalse();
    c.theme.set('abc');
    expect(c.canSubmit()).toBeTrue();
  });

  it('mostra a mensagem de erro da funcao', async () => {
    generate.and.rejectWith(new Error('Acesso negado.'));
    const c = fixture.componentInstance;
    c.theme.set('Um tema valido');
    await c.submit();
    fixture.detectChanges();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role=alert]');
    expect(alert?.textContent?.trim()).toBe('Acesso negado.');
    expect(c.loading()).toBeFalse();
  });

  it('guarda a geracao e o aviso do fundo', async () => {
    generate.and.resolveTo({
      generation: { id: 'g1', variations: [], background_path: 'o/backgrounds/g1.jpg' },
      backgroundError: 'Sem fundo.',
    });
    const c = fixture.componentInstance;
    c.theme.set('Um tema valido');
    await c.submit();
    expect(c.generation()?.id).toBe('g1');
    expect(c.notice()).toBe('Sem fundo.');
    expect(c.background()).toBe('data:image/png;base64,AA==');
  });

  it('carrega o historico e reabre uma geracao sem chamar o Gemini', async () => {
    await fixture.whenStable();
    const c = fixture.componentInstance;
    expect(c.items().map((g) => g.id)).toEqual(['old']);
    await c.show(saved);
    expect(c.generation()?.id).toBe('old');
    expect(generate).not.toHaveBeenCalled();
  });

  it('excluir pede um segundo clique e tira a geracao da lista', async () => {
    await fixture.whenStable();
    const c = fixture.componentInstance;
    await c.show(saved);
    await c.remove(saved);
    expect(history.remove).not.toHaveBeenCalled();
    expect(c.confirming()).toBe('old');
    await c.remove(saved);
    expect(history.remove).toHaveBeenCalledWith(saved);
    expect(c.items()).toEqual([]);
    expect(c.generation()).toBeNull();
  });

  it('uma geracao nova entra no topo do historico', async () => {
    await fixture.whenStable();
    generate.and.resolveTo({ generation: { id: 'new', variations: [], background_path: null } });
    const c = fixture.componentInstance;
    c.theme.set('Um tema valido');
    await c.submit();
    expect(c.items().map((g) => g.id)).toEqual(['new', 'old']);
  });
});
