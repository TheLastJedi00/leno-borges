import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdApi } from '../core/ad-api';
import { AdAssets } from '../core/ad-assets';
import { AdGenerator } from './ad-generator';

describe('AdGenerator (formulario)', () => {
  let fixture: ComponentFixture<AdGenerator>;
  let generate: jasmine.Spy;

  beforeEach(() => {
    generate = jasmine.createSpy('generate');
    TestBed.configureTestingModule({
      imports: [AdGenerator],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AdApi, useValue: { generate } },
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
});
