// Monta o arquivo Java completo a partir do trecho do slide (usado pelo `npm run check:java`).
// Os slides mostram só o que importa; a classe e o `main` entram por fora.

/** Linha que separa, no slide, as funções (nível da classe) do que roda dentro do `main`. */
export const NO_MAIN = '// no main';

/**
 * Arquivo `Main.java` do trecho:
 * - com `class`, `record` ou `enum`: o trecho já é o arquivo inteiro;
 * - com a linha `// no main`: o que vem antes fica no nível da classe (as funções `static`) e o
 *   que vem depois, dentro do `main`;
 * - sem nenhum dos dois: o trecho inteiro fica dentro do `main`.
 * Sem `import` no trecho, importa `java.util` (os slides de listas não repetem a linha).
 */
export function javaSource(code: string): string {
  const lines = code.replace(/\r/g, '').split('\n');
  const imports = lines.filter((l) => l.startsWith('import ')).join('\n') || 'import java.util.*;';
  const rest = lines.filter((l) => !l.startsWith('import '));
  const body = rest.join('\n');
  if (/^\s*(public\s+)?(class|record|enum)\s/m.test(body)) return `${imports}\n${body}\n`;
  const split = rest.findIndex((l) => l.trim() === NO_MAIN);
  const members = split < 0 ? [] : rest.slice(0, split);
  const main = split < 0 ? rest : rest.slice(split + 1);
  const indent = (list: string[], pad: string) => list.map((l) => (l ? pad + l : l)).join('\n');
  return [
    imports,
    'public class Main {',
    ...(members.length ? [indent(members, '  '), ''] : []),
    '  public static void main(String[] args) throws Exception {',
    indent(main, '    '),
    '  }',
    '}',
    '',
  ].join('\n');
}
