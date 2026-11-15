// Confere os trechos de Java do Kit de Ensino num JDK de verdade: compila e roda cada trecho e
// compara com a saída (ou o erro) que o slide mostra na última etapa.
//
// Uso: npm run check:java [-- <aula> ...]   (sem aula, confere todas)
// JDK: JAVA_HOME, senão o primeiro de ~/.jdks, senão o java do PATH.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const kitSrc = path.join(root, 'src/app/kit');
const decksDir = path.join(kitSrc, 'decks');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-java-'));

function jdkBin() {
  if (process.env.JAVA_HOME) return path.join(process.env.JAVA_HOME, 'bin');
  const jdks = path.join(os.homedir(), '.jdks');
  if (fs.existsSync(jdks)) {
    const first = fs.readdirSync(jdks).sort().reverse()[0];
    if (first) return path.join(jdks, first, 'bin');
  }
  return '';
}
const bin = jdkBin();
const javac = bin ? path.join(bin, 'javac') : 'javac';
const java = bin ? path.join(bin, 'java') : 'java';

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(decksDir).filter((d) => fs.existsSync(path.join(decksDir, d, 'deck.pt.ts')));

// Transpila os decks para CommonJS (o tsc do projeto) e carrega como dados.
const tsc = path.join(root, 'node_modules/typescript/bin/tsc');
execFileSync(process.execPath, [
  tsc, '--module', 'commonjs', '--target', 'es2022', '--skipLibCheck', '--outDir', out,
  path.join(kitSrc, 'kit.data.ts'), path.join(kitSrc, 'ui/code/code-markup.ts'),
  path.join(decksDir, 'java-source.ts'),
  ...slugs.map((s) => path.join(decksDir, s, 'deck.pt.ts')),
], { stdio: 'inherit' });
const { pick } = require(path.join(out, 'kit.data.js'));
const { codeWithValue, finishedRuns, plainCode } = require(path.join(out, 'ui/code/code-markup.js'));
const { javaSource } = require(path.join(out, 'decks/java-source.js'));

/** Tempo máximo de cada execução: um laço infinito por engano acusa o slide em vez de travar. */
const TIMEOUT_MS = 10000;
const clean = (s) => String(s).replace(/\r/g, '');
/** O endereço do array muda a cada execução (`[Ljava.lang.String;@1b6d3586`): compara sem ele. */
const noAddress = (s) => String(s).replace(/;@[0-9a-f]+/g, ';@');

/** Compila e roda; devolve as linhas que a turma veria (saída, `error: ...` ou a exceção). */
function runJava(code) {
  const dir = fs.mkdtempSync(path.join(out, 'java-'));
  // Classe e `main` por fora; `// no main` separa as funções do que roda dentro do `main`.
  const src = javaSource(code);
  const file = path.join(dir, 'Main.java');
  fs.writeFileSync(file, src);
  try {
    execFileSync(javac, ['-encoding', 'UTF-8', file], { stdio: 'pipe' });
  } catch (e) {
    const errors = clean(e.stderr).split('\n').map((l) => l.match(/error: .*/)?.[0]).filter(Boolean);
    return { kind: 'compile', lines: errors };
  }
  try {
    const stdout = execFileSync(java, ['-Dfile.encoding=UTF-8', '-Dsun.stdout.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-cp', dir, 'Main'], { stdio: 'pipe', timeout: TIMEOUT_MS });
    return { kind: 'ok', lines: clean(stdout).trimEnd().split('\n').filter((l, i, a) => a.length > 1 || l) };
  } catch (e) {
    if (e.signal || e.code === 'ETIMEDOUT') return { kind: 'timeout', lines: [`passou de ${TIMEOUT_MS / 1000} s (laço infinito?)`] };
    const exception = clean(e.stderr).split('\n').find((l) => l.startsWith('Exception'));
    return { kind: 'runtime', lines: [...clean(e.stdout).trimEnd().split('\n').filter(Boolean), exception] };
  }
}

let problems = 0;
let checked = 0;
for (const slug of slugs) {
  const { deck } = require(path.join(out, 'decks', slug, 'deck.pt.js'));
  for (const slide of deck.slides) {
    if (slide.syntaxes && !slide.syntaxes.includes('java')) continue;
    // Código que não deve rodar (laço infinito de propósito).
    if (slide.noRun) continue;
    const markup = 'code' in slide && slide.code ? pick(slide.code, 'java') : undefined;
    if (!markup) continue;
    if (slide.kind === 'branch') {
      // Exercício "escolha o valor": roda o código com cada valor (a exceção conta como saída).
      for (const choice of slide.choices) {
        const expected = pick(choice.output, 'java') ?? '';
        const result = runJava(plainCode(codeWithValue(markup, choice.value)));
        checked++;
        if (result.kind === 'compile' || noAddress(result.lines.join('\n')) !== noAddress(expected)) {
          problems++;
          console.log(`\n✗ ${slug} / ${slide.id}, valor ${choice.value}`);
          console.log(`  slide: ${JSON.stringify(expected)}`);
          console.log(`  javac/java (${result.kind}): ${JSON.stringify(result.lines.join('\n'))}`);
        }
      }
      continue;
    }
    const steps = slide.kind === 'predict' ? slide.trace : slide.kind === 'scene' ? slide.steps : [];
    // Uma execução por valor (`value`) da cena; sem valor, a última etapa.
    const runs = steps.length ? finishedRuns(steps) : [{}];
    for (const run of runs) {
      const expected = pick(run.output ?? undefined, 'java');
      const result = runJava(plainCode(codeWithValue(markup, run.value)));
      checked++;
      let ok;
      if (result.kind === 'compile') {
        // Slides em etapas mostram o erro da linha visível: basta ser um dos erros do javac.
        ok = expected !== undefined && result.lines.includes(expected.trim());
      } else if (expected === undefined) {
        // Sem saída no slide: basta compilar e rodar sem erro.
        ok = result.kind === 'ok';
      } else {
        ok = noAddress(result.lines.join('\n')) === noAddress(expected);
      }
      if (!ok) {
        problems++;
        console.log(`\n✗ ${slug} / ${slide.id}${run.value === undefined ? '' : `, valor ${run.value}`}`);
        console.log(`  slide: ${JSON.stringify(expected)}`);
        console.log(`  javac/java (${result.kind}): ${JSON.stringify(result.lines.join('\n'))}`);
      }
    }
  }
}
fs.rmSync(out, { recursive: true, force: true });
console.log(`\n${checked} trechos de Java conferidos, ${problems} com diferença.`);
process.exit(problems ? 1 : 0);
