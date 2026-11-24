import { cleanPieceText, titleSize } from './piece-text';

describe('cleanPieceText', () => {
  it('remove emojis e troca travessoes por virgula', () => {
    expect(cleanPieceText('Pronto — no ar 🚀')).toBe('Pronto, no ar');
    expect(cleanPieceText('2025 – 2026')).toBe('2025, 2026');
    expect(cleanPieceText('Antes - depois')).toBe('Antes, depois');
    expect(cleanPieceText('  🚀 Olá   mundo ')).toBe('Olá mundo');
    expect(cleanPieceText('Feito ✅ e testado ❤️')).toBe('Feito e testado');
  });

  it('mantem hifen de palavra, acentos e setas', () => {
    expect(cleanPieceText('full-stack, e-mail, coração')).toBe('full-stack, e-mail, coração');
  });

  it('texto vazio ou ausente vira string vazia', () => {
    expect(cleanPieceText(undefined)).toBe('');
    expect(cleanPieceText('🚀')).toBe('');
  });
});

describe('titleSize', () => {
  const steps = [
    { chars: 10, size: 120 },
    { chars: 20, size: 100 },
    { chars: 999, size: 80 },
  ];

  it('desce em degraus conforme o texto cresce', () => {
    expect(titleSize('curto', steps)).toBe(120);
    expect(titleSize('a'.repeat(10), steps)).toBe(120);
    expect(titleSize('a'.repeat(11), steps)).toBe(100);
    expect(titleSize('a'.repeat(21), steps)).toBe(80);
  });

  it('o ultimo degrau e o piso', () => {
    expect(titleSize('a'.repeat(5000), steps)).toBe(80);
  });
});
