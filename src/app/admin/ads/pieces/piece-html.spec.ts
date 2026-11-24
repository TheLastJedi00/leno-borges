import { LOGO_URL, sanitizePieceHtml } from './piece-html';

const BG = 'data:image/jpeg;base64,AAAA';

function dom(html: string) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el;
}

describe('sanitizePieceHtml', () => {
  it('troca os marcadores pela logo e pelo fundo', () => {
    const out = dom(
      sanitizePieceHtml(
        `<div style="background-image:url('{{BACKGROUND_URL}}')"><img src="{{LOGO_URL}}" alt=""></div>`,
        BG,
      ),
    );
    expect(out.querySelector('img')?.getAttribute('src')).toBe(LOGO_URL);
    expect((out.firstElementChild as HTMLElement).style.backgroundImage).toContain(BG);
  });

  it('sem fundo, o url do marcador sai do estilo', () => {
    const out = dom(sanitizePieceHtml(`<div style="color:red;background-image:url('{{BACKGROUND_URL}}')">x</div>`, null));
    const style = (out.firstElementChild as HTMLElement).getAttribute('style') ?? '';
    expect(style).not.toContain('url(');
    expect(style).toContain('color');
  });

  it('remove script, style, iframe, link e atributos de evento', () => {
    const out = sanitizePieceHtml(
      `<div onclick="alert(1)"><script>alert(2)</script><style>*{}</style><iframe src="x"></iframe><link rel="stylesheet" href="https://x"><img src="{{LOGO_URL}}" onerror="alert(3)"><p>ok</p></div>`,
      null,
    );
    expect(out).not.toMatch(/script|onclick|onerror|<style|<iframe|<link/i);
    expect(dom(out).textContent).toContain('ok');
  });

  it('remove enderecos externos em src, href e url() do CSS', () => {
    const out = dom(
      sanitizePieceHtml(
        `<div style="background:url(https://evil.example/a.png) #1C1C1E"><img src="https://evil.example/b.png"><a href="https://evil.example">x</a><a href="javascript:alert(1)">y</a></div>`,
        null,
      ),
    );
    const html = out.innerHTML;
    expect(html).not.toContain('evil.example');
    expect(html).not.toContain('javascript:');
    expect(out.querySelector('img')).toBeNull();
  });

  it('position:fixed vira absolute, para a arte nao cobrir o painel', () => {
    const out = dom(sanitizePieceHtml('<div style="position: fixed; inset: 0">x</div>', null));
    expect((out.firstElementChild as HTMLElement).style.position).toBe('absolute');
  });

  it('mantem estilos inline, SVG e data: do fundo', () => {
    const out = dom(
      sanitizePieceHtml(
        `<div style="width:1080px;height:1080px;background:linear-gradient(135deg,#488FFF,#3986FF);box-shadow:24px 24px 56px rgba(0,0,0,.55)"><svg viewBox="0 0 10 10" width="10" height="10"><circle cx="5" cy="5" r="5" fill="#3986FF"/></svg></div>`,
        null,
      ),
    );
    const root = out.firstElementChild as HTMLElement;
    expect(root.style.width).toBe('1080px');
    expect(root.style.background).toContain('linear-gradient');
    expect(root.style.boxShadow).toContain('rgba');
    expect(out.querySelector('svg circle')?.getAttribute('fill')).toBe('#3986FF');
  });
});
