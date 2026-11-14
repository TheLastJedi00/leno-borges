import { parseCode, parseExpr, plainCode, sceneAt } from './code-markup';

describe('code-markup', () => {
  it('separa tokens com papel e texto puro', () => {
    expect(parseCode('{k:let} {n:idade} = {v:25};')).toEqual([
      [
        { text: 'let', role: 'k' },
        { text: ' ' },
        { text: 'idade', role: 'n' },
        { text: ' = ' },
        { text: '25', role: 'v' },
        { text: ';' },
      ],
    ]);
  });

  it('mantém chaves de bloco do Java como texto', () => {
    expect(plainCode('{k:if} (x) {\n}')).toBe('if (x) {\n}');
    expect(parseCode('{k:if} (x) {\n}').length).toBe(2);
  });

  it('cada etapa herda a anterior', () => {
    const state = sceneAt([{ caption: 'a', lines: 1 }, { lines: 2 }, { highlight: 'n' }], 2);
    expect(state).toEqual({ caption: 'a', lines: 2, highlight: 'n' });
  });

  it('separa o trecho em destaque da expressão', () => {
    const parts = parseExpr('{v:2} + [[{v:3} * {v:4}]]');
    expect(parts.map((p) => p.focus)).toEqual([false, true]);
    expect(parts[1].tokens).toEqual([{ text: '3', role: 'v' }, { text: ' * ' }, { text: '4', role: 'v' }]);
    expect(plainCode('{v:2} + [[{v:3} * {v:4}]]')).toBe('2 + 3 * 4');
  });

  it('expressão sem destaque é uma parte só', () => {
    expect(parseExpr('{v:14}')).toEqual([{ tokens: [{ text: '14', role: 'v' }], focus: false }]);
  });
});
