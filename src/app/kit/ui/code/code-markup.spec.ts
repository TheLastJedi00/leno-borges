import { parseCode, plainCode, sceneAt } from './code-markup';

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
});
