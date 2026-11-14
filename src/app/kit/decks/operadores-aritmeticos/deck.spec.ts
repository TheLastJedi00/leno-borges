import { SYNTAXES, type Slide, pick, stepCount, tracks } from '../../kit.data';
import { visibleSlides } from '../../player/player-state';
import { parseCode, parseExpr, plainCode } from '../../ui/code/code-markup';
import { code } from './code';
import { deck } from './deck.pt';

const lesson = tracks[0].lessons.find((l) => l.slug === 'operadores-aritmeticos')!;

describe('aula operadores aritméticos', () => {
  it('está no catálogo, logo depois de variáveis e tipos', () => {
    expect(tracks[0].lessons.map((l) => l.slug)).toEqual(['variaveis-e-tipos', 'operadores-aritmeticos']);
  });

  it('todo trecho de código existe nas três sintaxes', () => {
    for (const [name, snippet] of Object.entries(code)) {
      for (const s of SYNTAXES) {
        expect(snippet[s]?.trim().length).withContext(`${name}.${s}`).toBeGreaterThan(0);
      }
    }
  });

  it('todo slide com código tem código em cada sintaxe em que aparece', () => {
    const withCode = deck.slides.filter(
      (s): s is Extract<Slide, { code?: unknown }> => 'code' in s && !!s.code,
    );
    for (const slide of withCode) {
      for (const s of slide.syntaxes ?? lesson.syntaxes) {
        const markup = pick(slide.code, s);
        expect(markup).withContext(`${slide.id}.${s}`).toBeTruthy();
        expect(parseCode(markup!).length).toBeGreaterThan(0);
      }
    }
  });

  it('toda linha de conta tem expressão em cada sintaxe', () => {
    for (const slide of deck.slides) {
      if (slide.kind !== 'expr') continue;
      for (const step of slide.steps) {
        for (const s of lesson.syntaxes) {
          const expr = pick(step.expr, s);
          expect(expr).withContext(`${slide.id}.${s}`).toBeTruthy();
          expect(parseExpr(expr!).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('as contas dos slides de expressão fecham', () => {
    // Cada linha de uma conta vale o mesmo que a anterior (todas as linhas são JS válido)
    for (const slide of deck.slides) {
      if (slide.kind !== 'expr') continue;
      let previous: number | undefined;
      for (const step of slide.steps) {
        const value = Function(`return ${plainCode(pick(step.expr, 'js')!)}`)() as number;
        if (previous !== undefined && !step.reset) {
          expect(value).withContext(`${slide.id}: ${pick(step.expr, 'js')}`).toBe(previous);
        }
        previous = value;
      }
    }
  });

  it('ids de slide são únicos', () => {
    const ids = deck.slides.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo slide tem tópicos de fala e pelo menos uma etapa', () => {
    for (const slide of deck.slides) {
      expect(slide.notes.length).withContext(slide.id).toBeGreaterThan(0);
      expect(stepCount(slide)).toBeGreaterThan(0);
    }
  });

  it('slides extra têm selo; essenciais não', () => {
    for (const slide of deck.slides) {
      expect(!!slide.tag).withContext(slide.id).toBe(slide.depth === 'extra');
    }
  });

  it('a contagem do catálogo bate com o deck em todas as sintaxes', () => {
    for (const s of lesson.syntaxes) {
      expect(visibleSlides(deck, 'essencial', s).length).withContext(s).toBe(lesson.counts.essencial);
      expect(visibleSlides(deck, 'completo', s).length).withContext(s).toBe(lesson.counts.completo);
    }
  });

  it('a resposta dos exercícios bate com a conta', () => {
    const r = 20 * 3 - 10 / 2;
    let x = 7;
    x += 3;
    x %= 4;
    x *= 5;
    const answers: Record<string, number> = { 'exercicio-prioridade': r, 'exercicio-atalhos': x };
    for (const slide of deck.slides) {
      if (slide.kind !== 'predict') continue;
      expect(Number(slide.options[slide.answer])).withContext(slide.id).toBe(answers[slide.id]);
    }
  });

  it('texto do deck não usa travessão', () => {
    expect(JSON.stringify(deck)).not.toContain('—');
  });
});
