import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AdHtmlPiece } from './ad-html-piece';

describe('AdHtmlPiece', () => {
  function render(inputs: Record<string, unknown>) {
    TestBed.configureTestingModule({ imports: [AdHtmlPiece], providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(AdHtmlPiece);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('.piece') as HTMLElement;
  }

  it('renderiza a arte do Gemini numa moldura do tamanho do formato', () => {
    const piece = render({ html: '<div style="width:1080px;height:1920px"><h1>Ola</h1></div>', format: 'story' });
    expect([piece.style.width, piece.style.height]).toEqual(['1080px', '1920px']);
    expect(piece.querySelector('h1')?.textContent).toBe('Ola');
  });

  it('o HTML passa pelo sanitizador (sem script nem eventos)', () => {
    const piece = render({
      html: '<div onclick="alert(1)"><script>alert(2)</script><p>ok</p></div>',
      format: 'post',
    });
    expect([piece.style.width, piece.style.height]).toEqual(['1080px', '1440px']);
    expect(piece.innerHTML).not.toMatch(/script|onclick/i);
    expect(piece.textContent).toContain('ok');
  });

  it('a logo e o fundo entram no lugar dos marcadores', () => {
    const piece = render({
      html: `<div style="background-image:url('{{BACKGROUND_URL}}')"><img src="{{LOGO_URL}}" alt=""></div>`,
      format: 'carousel',
      background: 'data:image/png;base64,AA==',
    });
    expect(piece.querySelector('img')?.getAttribute('src')).toBe('images/logo.svg');
    expect(piece.innerHTML).toContain('data:image/png;base64,AA==');
  });
});
