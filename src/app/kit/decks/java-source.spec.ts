import { javaSource } from './java-source';

describe('javaSource (check:java)', () => {
  it('sem classe nem // no main, tudo dentro do main', () => {
    const src = javaSource('int x = 1;\nSystem.out.println(x);');
    expect(src).toContain('import java.util.*;');
    expect(src).toMatch(/main\(String\[\] args\) throws Exception \{\n {4}int x = 1;\n {4}System\.out\.println\(x\);\n {2}\}\n\}/);
  });

  it('com // no main, as funções ficam na classe e o resto no main', () => {
    const src = javaSource('static int dobro(int n) {\n    return n * 2;\n}\n// no main\nSystem.out.println(dobro(4));');
    const classAt = src.indexOf('public class Main {');
    const fnAt = src.indexOf('  static int dobro(int n) {');
    const mainAt = src.indexOf('public static void main');
    expect(classAt).toBeGreaterThan(-1);
    expect(fnAt).toBeGreaterThan(classAt);
    expect(mainAt).toBeGreaterThan(fnAt);
    expect(src.indexOf('    System.out.println(dobro(4));')).toBeGreaterThan(mainAt);
    expect(src).not.toContain('// no main');
  });

  it('com a classe no trecho, usa o trecho como está', () => {
    const code = 'public class Main {\n  public static void main(String[] args) {}\n}';
    expect(javaSource(code)).toBe(`import java.util.*;\n${code}\n`);
  });

  it('mantém os imports do trecho no topo', () => {
    expect(javaSource('import java.util.List;\nint x = 1;').startsWith('import java.util.List;\npublic class Main {')).toBeTrue();
  });
});
