import { type BySyntax, type Deck, type ListState, type Syntax, pick } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 7 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/010 - Listas/context.md
// Metáfora: a lista é um gaveteiro com um nome só e gavetas numeradas a partir do 0. O índice é a
// posição da gaveta: muda quando outra entra ou sai antes dela.
// A mesma operação nas três sintaxes; muda só o nome do método. Java usa List / ArrayList.

/** Linha `n` do JS/TS; no Java, a lista com valores ocupa uma linha a mais. */
const L = (n: number): BySyntax<number> => ({ js: n, ts: n, java: n + 1 });

/** Gaveteiro com textos (`"maçã"`); o id da gaveta é o próprio texto. */
const shelf = (name: string, values: string[], extra: Partial<ListState> = {}): ListState => ({
  name,
  items: values.map((v) => ({ id: v, value: `"${v}"` })),
  ...extra,
});
const fruits = (extra: Partial<ListState> = {}) => shelf('frutas', ['maçã', 'uva', 'pera'], extra);

/** Saída da lista impressa: `console.log` do Node no JS/TS, `[a, b]` no Java. */
const printed = (...values: string[]): BySyntax => {
  const node = values.length ? `[ ${values.map((v) => `'${v}'`).join(', ')} ]` : '[]';
  return { js: node, ts: node, java: `[${values.join(', ')}]` };
};
/** Junta saídas linha a linha, por sintaxe. */
const lines = (...outs: BySyntax[]): Record<Syntax, string> => {
  const get = (s: Syntax) => outs.map((o) => pick(o, s)).join('\n');
  return { js: get('js'), ts: get('ts'), java: get('java') };
};

/** Erros conferidos no `tsc` 5.9 `--strict`, no Node e no JDK 17. */
const JAVA_OUT_OF_BOUNDS = (i: number, n: number) =>
  `Exception in thread "main" java.lang.IndexOutOfBoundsException: Index ${i} out of bounds for length ${n}`;
const TS_NOT_ASSIGNABLE = "error: Argument of type 'number' is not assignable to parameter of type 'string'.";
const JAVA_INCOMPATIBLE = 'error: incompatible types: int cannot be converted to String';
const JS_CONST = 'TypeError: Assignment to constant variable.';
const TS_CONST = "error: Cannot assign to 'frutas' because it is a constant.";
const JAVA_NO_ADD = 'error: cannot find symbol';

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Listas',
      subtitle: 'Como guardar vários valores com um nome só',
      notes: [
        'Retomar a aula 1: uma variável é um baú que guarda um valor',
        'Pergunta de abertura: como guardar as 40 notas de uma turma? 40 variáveis?',
        'Hoje: a lista, o gaveteiro que guarda muitos valores com um nome só',
      ],
    },

    // 2 · E
    {
      id: 'muitas-variaveis',
      kind: 'scene',
      depth: 'core',
      title: 'Uma lista no lugar de muitas variáveis',
      description:
        'Três baús, fruta1, fruta2 e fruta3, viram um gaveteiro chamado frutas, com três gavetas numeradas de 0 a 2.',
      code: code.manyVars,
      steps: [
        {
          caption: 'Três frutas, três variáveis. E se fossem trinta?',
          lines: 3,
          chests: [
            chest('fruta1', 'text', { open: true, label: 'fruta1', item: '"maçã"' }),
            chest('fruta2', 'text', { open: true, label: 'fruta2', item: '"uva"' }),
            chest('fruta3', 'text', { open: true, label: 'fruta3', item: '"pera"' }),
          ],
        },
        {
          caption: 'Uma lista guarda todas com um nome só, cada uma na sua gaveta.',
          lines: 99,
          activeLine: { js: 4, ts: 4, java: 4 },
          chests: [],
          list: fruits(),
        },
      ],
      notes: [
        'Com variáveis soltas, cada fruta nova pede uma linha e um nome novo',
        'A lista é um valor só que guarda vários: um gaveteiro com uma etiqueta',
        'Os colchetes [ ] (JS/TS) e o List (Java) avisam: aqui tem uma lista',
        'Nomes de lista no plural ajudam: frutas, notas, alunos',
      ],
    },

    // 3 · E
    {
      id: 'criar',
      kind: 'scene',
      depth: 'core',
      title: 'Criar e mostrar a lista',
      description: 'O gaveteiro frutas com três gavetas: maçã na 0, uva na 1 e pera na 2.',
      code: code.create,
      steps: [
        {
          caption: {
            js: 'Os itens entre colchetes, separados por vírgula.',
            ts: 'string[] quer dizer: uma lista de textos.',
            java: 'List é o que dá para fazer com a lista; ArrayList é a lista de verdade, criada com new.',
          },
          activeLine: { js: 1, ts: 1, java: 4 },
          list: fruits(),
        },
        {
          caption: 'Mostrar a lista mostra todos os itens, na ordem.',
          activeLine: { js: 2, ts: 2, java: 6 },
          output: printed('maçã', 'uva', 'pera'),
        },
      ],
      notes: [
        'A ordem dos itens é a ordem em que foram escritos, e ela se mantém',
        'JS/TS: o terminal (Node) mostra [ \'maçã\', \'uva\', \'pera\' ]; o console do navegador mostra a lista de um jeito parecido, com o tamanho na frente',
        'TS: string[] é "lista de string"; o TS descobre sozinho, mas escrever deixa claro',
        'Java: os import trazem List e ArrayList do pacote java.util; nos próximos slides eles ficam de fora',
        'Java: List.of(...) cria uma lista que não muda; o new ArrayList<>(...) copia para uma lista que cresce e diminui',
        'Java: <String> diz o tipo dos itens; o <> do ArrayList repete o mesmo tipo',
      ],
    },

    // 4 · E
    {
      id: 'indice',
      kind: 'scene',
      depth: 'core',
      title: 'O índice começa no 0',
      description: 'A gaveta 0 acende e mostra maçã; depois a gaveta 2 acende e mostra pera.',
      code: code.index,
      steps: [
        {
          caption: {
            js: 'Cada gaveta tem um número, o índice. A primeira é a 0.',
            ts: 'Cada gaveta tem um número, o índice. A primeira é a 0.',
            java: 'Cada gaveta tem um número, o índice. A primeira é a 0; get(0) abre essa gaveta.',
          },
          activeLine: L(2),
          list: fruits({ focus: 0 }),
          output: 'maçã',
        },
        {
          caption: 'Com três itens, os índices vão de 0 a 2.',
          activeLine: L(3),
          list: fruits({ focus: 2 }),
          output: 'maçã\npera',
        },
      ],
      notes: [
        'O índice é a distância até a primeira gaveta: a primeira está a 0 passos',
        'Erro comum: achar que frutas[1] é a primeira',
        'Quase todas as linguagens começam do 0',
        'JS/TS: frutas[0]; Java: frutas.get(0). Mesma operação, nome diferente',
      ],
    },

    // 5 · A
    {
      id: 'tamanho',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Tamanho e último item',
      description: 'O gaveteiro tem 3 gavetas, numeradas de 0 a 2: a última, pera, é a de índice 2.',
      code: code.last,
      steps: [
        {
          caption: {
            js: 'length diz quantos itens a lista tem.',
            ts: 'length diz quantos itens a lista tem.',
            java: 'size() diz quantos itens a lista tem.',
          },
          activeLine: L(2),
          list: fruits(),
          output: '3',
        },
        {
          caption: 'São 3 itens, mas o último índice é 2: o tamanho menos 1.',
          activeLine: L(3),
        },
        {
          caption: 'Com o índice do último, abre a última gaveta, seja qual for o tamanho.',
          activeLine: L(4),
          list: fruits({ focus: 2 }),
          output: '3\npera',
        },
      ],
      notes: [
        'JS/TS: length sem parênteses (é uma informação da lista); Java: size() com parênteses (é um método)',
        'O último é sempre tamanho - 1, porque o primeiro é 0',
        'JS/TS: frutas.at(-1) também dá o último',
        'Java 21: frutas.getLast() faz o mesmo (o JDK da aula é o 17)',
      ],
    },

    // 6 · A
    {
      id: 'exercicio-indice',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Escolha o índice',
      lead: 'Troque o índice e veja qual gaveta abre.',
      variable: 'índice',
      code: code.pick,
      list: { name: 'frutas', items: fruits().items },
      choices: [
        { value: '0', output: 'maçã' },
        { value: '1', output: 'uva' },
        { value: '2', output: 'pera' },
        { value: '3', output: { js: 'undefined', ts: 'undefined', java: JAVA_OUT_OF_BOUNDS(3, 3) } },
      ],
      goals: ['uva', 'pera'],
      notes: [
        'Antes de clicar, pedir para a turma dizer o índice',
        'Desafio 2: a pera é a terceira, mas o índice é 2',
        'Depois, clicar no 3: a gaveta não existe (o próximo aprofundamento explica)',
      ],
    },

    // 7 · E
    {
      id: 'adicionar',
      kind: 'scene',
      depth: 'core',
      title: 'Adicionar no fim',
      description: 'Uma gaveta nova, kiwi, entra à direita com o índice 3. O tamanho passa de 3 para 4.',
      code: code.push,
      steps: [
        {
          caption: {
            js: 'push põe o item no fim da lista.',
            ts: 'push põe o item no fim da lista.',
            java: 'add põe o item no fim da lista.',
          },
          activeLine: L(2),
          list: shelf('frutas', ['maçã', 'uva', 'pera', 'kiwi'], { focus: 3 }),
        },
        {
          caption: 'A lista cresceu: agora são 4 itens.',
          activeLine: L(4),
          list: shelf('frutas', ['maçã', 'uva', 'pera', 'kiwi']),
          output: lines(printed('maçã', 'uva', 'pera', 'kiwi'), '4'),
        },
      ],
      notes: [
        'A lista não tem tamanho fixo: cresce quando precisa',
        'O item novo ganha o próximo índice (o tamanho antigo)',
        'Mesma operação, nome diferente: push no JS/TS, add no Java',
      ],
    },

    // 8 · E
    {
      id: 'trocar',
      kind: 'scene',
      depth: 'core',
      title: 'Trocar um item',
      description: 'A gaveta 1 troca uva por kiwi. As gavetas 0 e 2 não mudam.',
      code: code.set,
      steps: [
        {
          caption: {
            js: 'Com o índice e o =, a gaveta 1 recebe outro valor (como a variável da aula 1).',
            ts: 'Com o índice e o =, a gaveta 1 recebe outro valor (como a variável da aula 1).',
            java: 'set(1, ...) troca o que está na gaveta 1.',
          },
          activeLine: L(2),
          list: { name: 'frutas', items: [{ id: 'maçã', value: '"maçã"' }, { id: 'uva', value: '"kiwi"' }, { id: 'pera', value: '"pera"' }], focus: 1 },
        },
        {
          caption: 'O tamanho não muda: só o conteúdo da gaveta.',
          activeLine: L(3),
          output: printed('maçã', 'kiwi', 'pera'),
        },
      ],
      notes: [
        'Trocar não abre gaveta nova: o valor antigo some, como numa variável',
        'JS/TS: frutas[1] = "kiwi"; Java: frutas.set(1, "kiwi")',
        'Java: não dá para escrever frutas.get(1) = "kiwi"',
      ],
    },

    // 9 · E
    {
      id: 'remover',
      kind: 'scene',
      depth: 'core',
      title: 'Remover',
      description:
        'A gaveta pera sai do fim. Depois a gaveta maçã sai do começo e a uva anda para a esquerda: o índice dela passa de 1 para 0.',
      code: code.remove,
      steps: [
        {
          caption: {
            js: 'pop tira o último item.',
            ts: 'pop tira o último item.',
            java: 'remove com o índice do último (tamanho - 1) tira o último item.',
          },
          activeLine: L(2),
          list: shelf('frutas', ['maçã', 'uva']),
        },
        {
          activeLine: L(3),
          output: printed('maçã', 'uva'),
        },
        {
          caption: {
            js: 'splice(0, 1) tira 1 item a partir do índice 0.',
            ts: 'splice(0, 1) tira 1 item a partir do índice 0.',
            java: 'remove(0) tira o item do índice 0.',
          },
          activeLine: L(4),
          list: shelf('frutas', ['uva'], { focus: 0 }),
        },
        {
          caption: 'A uva andou para a gaveta 0: os índices de quem vem depois mudam.',
          activeLine: L(5),
          output: lines(printed('maçã', 'uva'), printed('uva')),
        },
      ],
      notes: [
        'Remover do meio ou do começo faz todo mundo depois andar uma casa',
        'Um índice guardado antes de remover pode apontar para outro item depois',
        'JS/TS: splice(índice, quantos); shift() tira o primeiro',
        'Java 21: removeLast() e removeFirst() (o JDK da aula é o 17)',
      ],
    },

    // 10 · A
    {
      id: 'inserir',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Inserir no meio',
      description: 'A gaveta kiwi entra no índice 1. A uva e a pera andam uma casa para a direita.',
      code: code.insert,
      steps: [
        {
          caption: {
            js: 'splice(1, 0, "kiwi"): no índice 1, tira 0 itens e põe o kiwi.',
            ts: 'splice(1, 0, "kiwi"): no índice 1, tira 0 itens e põe o kiwi.',
            java: 'add(1, "kiwi"): o add com índice põe o item nessa posição.',
          },
          activeLine: L(2),
          list: shelf('frutas', ['maçã', 'kiwi', 'uva', 'pera'], { focus: 1 }),
        },
        {
          caption: 'Uva e pera andaram para a direita: agora são as gavetas 2 e 3.',
          activeLine: L(3),
          output: printed('maçã', 'kiwi', 'uva', 'pera'),
        },
      ],
      notes: [
        'Inserir é o contrário de remover: quem vem depois anda para a direita',
        'JS/TS: o mesmo splice remove e insere; o segundo número diz quantos tirar',
        'Java: add(item) põe no fim; add(índice, item) põe na posição',
      ],
    },

    // 11 · A
    {
      id: 'exercicio-fila',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Quem é o primeiro da fila?',
      question: 'A fila do caixa atende uma pessoa e chega mais uma. O que o programa mostra?',
      code: code.queue,
      options: ['Ana 3', 'Bia 3', 'Bia 4', 'Davi 3'],
      answer: 1,
      explanation: 'A Ana foi atendida e saiu: a Bia virou a gaveta 0. O Davi entrou no fim, e a fila continua com 3 pessoas.',
      trace: [
        { activeLine: L(2) },
        { activeLine: L(3) },
        { activeLine: L(4) },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou "Ana 3" esqueceu que remover muda quem está na gaveta 0',
        'Quem marcou "Bia 4" esqueceu que um saiu antes de outro entrar',
        'Fila: entra no fim, sai do começo',
      ],
    },

    // 12 · E
    {
      id: 'procurar',
      kind: 'scene',
      depth: 'core',
      title: 'Procurar na lista',
      description: 'A gaveta 1, uva, acende quando a busca encontra a uva. O kiwi não está em nenhuma gaveta.',
      code: code.find,
      steps: [
        {
          caption: {
            js: 'includes responde à pergunta "tem uva?" com true ou false.',
            ts: 'includes responde à pergunta "tem uva?" com true ou false.',
            java: 'contains responde à pergunta "tem uva?" com true ou false.',
          },
          activeLine: L(2),
          list: fruits(),
          output: 'true',
        },
        {
          caption: 'indexOf diz em qual gaveta está: o mesmo nome nas três linguagens.',
          activeLine: L(3),
          list: fruits({ focus: 1 }),
          output: 'true\n1',
        },
        {
          caption: 'Quando não acha, indexOf dá -1: não existe gaveta -1.',
          activeLine: L(4),
          list: fruits(),
          output: 'true\n1\n-1',
        },
      ],
      notes: [
        'A resposta true / false cabe direto num if (aula 5): if (frutas.includes("uva"))',
        'Java: if (frutas.contains("uva"))',
        'A busca compara o texto exato: "Uva" com maiúscula não acha',
        'indexOf devolve a primeira gaveta onde encontra',
      ],
    },

    // 13 · A
    {
      id: 'fora-da-lista',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Fora da lista',
      description: 'O índice 10 aparece como uma gaveta fantasma em vermelho, depois das gavetas 0 a 2.',
      code: code.outside,
      steps: [
        {
          caption: 'A lista tem as gavetas 0, 1 e 2. E a gaveta 10?',
          activeLine: L(2),
          list: fruits({ outside: 10 }),
        },
        {
          caption: {
            js: 'O JS não reclama: devolve undefined, "nada aqui".',
            ts: 'O TS diz que o tipo é string, mas na hora de rodar vem undefined.',
            java: 'O Java para o programa com um erro: não existe índice 10.',
          },
          output: { js: 'undefined', ts: 'undefined', java: JAVA_OUT_OF_BOUNDS(10, 3) },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'Índices válidos: de 0 até o tamanho - 1',
        'JS/TS: o undefined segue pelo programa e o erro aparece mais longe, onde é mais difícil achar',
        'TS: a opção noUncheckedIndexedAccess faz o tipo virar string | undefined',
        'Java: o erro para na hora, na linha certa (IndexOutOfBoundsException)',
      ],
    },

    // 14 · A
    {
      id: 'um-tipo',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Uma lista, um tipo',
      code: code.oneType,
      steps: [
        {
          caption: 'Uma lista de frutas recebendo o número 5.',
          activeLine: L(2),
        },
        {
          caption: {
            js: 'O JS aceita e mistura texto com número na mesma lista.',
            ts: 'O TS recusa antes de rodar: a lista é de string.',
            java: 'O Java recusa antes de rodar: a lista é de String.',
          },
          activeLine: { js: 3, ts: 2, java: 3 },
          output: { js: "[ 'maçã', 'uva', 'pera', 5 ]", ts: TS_NOT_ASSIGNABLE, java: JAVA_INCOMPATIBLE },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
      ],
      notes: [
        'Misturar tipos costuma ser engano: o que fazer com o 5 numa lista de frutas?',
        'TS: string[] é a promessa de que só tem texto, e o TS confere (erro TS2345)',
        'Java: List<String> faz a mesma promessa',
        'JS: a lista aceita qualquer coisa; o cuidado fica com quem programa',
      ],
    },

    // 15 · A
    {
      id: 'juntar-ordenar',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Juntar em texto e ordenar',
      description: 'O gaveteiro com uva, maçã e pera é ordenado e fica maçã, pera e uva.',
      code: code.joinSort,
      steps: [
        {
          caption: {
            js: 'join junta os itens num texto só, com o separador que você escolher.',
            ts: 'join junta os itens num texto só, com o separador que você escolher.',
            java: 'String.join junta os itens num texto só, com o separador que você escolher.',
          },
          activeLine: L(2),
          list: shelf('frutas', ['uva', 'maçã', 'pera']),
          output: 'uva, maçã, pera',
        },
        {
          caption: {
            js: 'sort põe a lista em ordem alfabética.',
            ts: 'sort põe a lista em ordem alfabética.',
            java: 'Collections.sort põe a lista em ordem alfabética.',
          },
          activeLine: L(4),
          list: shelf('frutas', ['maçã', 'pera', 'uva']),
          output: lines('uva, maçã, pera', printed('maçã', 'pera', 'uva')),
        },
      ],
      notes: [
        'join devolve um texto novo; a lista continua igual',
        'sort muda a própria lista: a ordem antiga se perde',
        'Java: Collections é uma caixa de ferramentas para listas (sort, reverse, max, min)',
        'Ordem alfabética do computador: maiúsculas vêm antes das minúsculas',
      ],
    },

    // 16 · A (só JS/TS)
    {
      id: 'sort-texto',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'O sort ordena como texto',
      description: 'A lista 10, 9, 1 ordenada fica 1, 10, 9.',
      code: only.sortText,
      steps: [
        {
          caption: 'Três números para pôr em ordem.',
          activeLine: 1,
          list: { name: 'numeros', items: [{ id: '10', value: '10' }, { id: '9', value: '9' }, { id: '1', value: '1' }] },
        },
        {
          caption: 'O sort compara como texto, letra a letra: "10" vem antes de "9", como "ba" vem antes de "c".',
          activeLine: 3,
          list: { name: 'numeros', items: [{ id: '1', value: '1' }, { id: '10', value: '10' }, { id: '9', value: '9' }] },
          output: '[ 1, 10, 9 ]',
        },
      ],
      notes: [
        'Sem instrução, o sort transforma cada item em texto para comparar',
        'O jeito certo para números: numeros.sort((a, b) => a - b), depois da aula de funções',
        'O Java não tem essa pegadinha: Collections.sort ordena números como números',
      ],
    },

    // 17 · A (só JS/TS)
    {
      id: 'const-lista',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'const não congela a lista',
      code: only.constList,
      steps: [
        {
          caption: 'Uma lista com const aceita item novo.',
          lines: 3,
          activeLine: 2,
          list: shelf('frutas', ['maçã', 'uva', 'pera'], { focus: 2 }),
          output: printed('maçã', 'uva', 'pera'),
        },
        {
          caption: 'O que o const proíbe é trocar o gaveteiro inteiro.',
          lines: 4,
          activeLine: 4,
          output: { js: lines(printed('maçã', 'uva', 'pera'), JS_CONST).js, ts: TS_CONST },
          outputTone: 'error',
        },
      ],
      notes: [
        'Retomar a aula 1: const não deixa a variável receber outro valor',
        'A variável guarda o gaveteiro; mexer nas gavetas não troca o gaveteiro',
        'Por isso é comum ver listas com const',
        'TS: o erro aparece antes de rodar (TS2588)',
      ],
    },

    // 18 · A (só Java)
    {
      id: 'java-array',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['java'],
      title: 'O array do Java',
      description: 'O gaveteiro do array é parafusado: tem 3 gavetas e não cabe uma nova.',
      code: only.javaArray,
      steps: [
        {
          caption: 'O Java tem outra lista, mais antiga: o array, com [ ] depois do tipo.',
          lines: 2,
          activeLine: 2,
          list: fruits({ fixed: true }),
          output: '3',
        },
        {
          caption: 'Mostrar o array direto dá um código estranho; precisa do Arrays.toString.',
          lines: 4,
          activeLine: 4,
          output: '3\n[Ljava.lang.String;@1b6d3586\n[maçã, uva, pera]',
        },
        {
          caption: 'E o tamanho é fixo: não tem add. Por isso a aula usa List.',
          lines: 5,
          activeLine: 5,
          output: JAVA_NO_ADD,
          outputTone: 'error',
        },
      ],
      notes: [
        'O array nasce com um tamanho e morre com ele: para crescer, é preciso criar outro e copiar',
        'length sem parênteses no array; size() com parênteses na List',
        '[Ljava.lang.String;@1b6d3586 é o tipo e um endereço; o número muda a cada execução',
        'O array aparece em código antigo e no main(String[] args); no dia a dia, List é mais prática',
      ],
    },

    // 19 · A (só Java)
    {
      id: 'java-integer',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'List<Integer> e o remove que confunde',
      code: only.javaInteger,
      steps: [
        {
          caption: 'Lista de números: List<Integer>, não List<int> (esse não compila).',
          activeLine: 1,
          list: { name: 'numeros', items: [{ id: '1', value: '1' }, { id: '5', value: '5' }, { id: '8', value: '8' }] },
        },
        {
          caption: 'remove(1) tira o item do índice 1 (o 5), não o número 1.',
          activeLine: 4,
          list: { name: 'numeros', items: [{ id: '1', value: '1' }, { id: '8', value: '8' }] },
          output: '[1, 8]',
        },
        {
          caption: 'Para tirar o número 1, é preciso dizer que é um valor: Integer.valueOf(1).',
          activeLine: 6,
          list: { name: 'numeros', items: [{ id: '8', value: '8' }] },
          output: '[1, 8]\n[8]',
        },
      ],
      notes: [
        'A List guarda objetos; int, double e boolean têm embrulhos: Integer, Double e Boolean',
        'List<int> dá "error: unexpected type" (required: reference, found: int)',
        'remove(int) usa o índice; remove(Object) procura o valor',
        'Em List<String> não há confusão: remove("uva") só pode ser o valor',
      ],
    },

    // 20 · A
    {
      id: 'mesma-operacao',
      kind: 'table',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Mesma operação, nome diferente',
      head: ['Operação', 'JS / TS', 'Java'],
      rows: [
        ['Ler', '{n:l}[{v:0}]', '{n:l}.{f:get}({v:0})'],
        ['Tamanho', '{n:l}.{f:length}', '{n:l}.{f:size}()'],
        ['Adicionar no fim', '{n:l}.{f:push}({n:x})', '{n:l}.{f:add}({n:x})'],
        ['Inserir', '{n:l}.{f:splice}({n:i}, {v:0}, {n:x})', '{n:l}.{f:add}({n:i}, {n:x})'],
        ['Trocar', '{n:l}[{n:i}] = {n:x}', '{n:l}.{f:set}({n:i}, {n:x})'],
        ['Remover', '{n:l}.{f:splice}({n:i}, {v:1})', '{n:l}.{f:remove}({n:i})'],
        ['Procurar', '{n:l}.{f:includes}({n:x})', '{n:l}.{f:contains}({n:x})'],
        ['Ordenar', '{n:l}.{f:sort}()', '{t:Collections}.{f:sort}({n:l})'],
      ],
      footnote: 'indexOf tem o mesmo nome nas três. JS e TS usam os mesmos métodos.',
      notes: [
        'A operação é a ideia; o nome muda de linguagem para linguagem',
        'Quem sabe o que quer fazer acha o nome na documentação',
        'Pedir para a turma completar de memória antes de mostrar',
      ],
    },

    // 21 · A
    {
      id: 'exercicio-operacao',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual operação?',
      lead: 'Qual método resolve cada situação?',
      bins: [
        { id: 'ler', shape: 'text', label: { js: 'lista[i]', ts: 'lista[i]', java: 'get' } },
        { id: 'adicionar', shape: 'text', label: { js: 'push', ts: 'push', java: 'add' } },
        { id: 'remover', shape: 'text', label: { js: 'splice', ts: 'splice', java: 'remove' } },
        { id: 'procurar', shape: 'text', label: { js: 'includes', ts: 'includes', java: 'contains' } },
      ],
      items: [
        { value: 'Chegou mais um na fila', bin: 'adicionar' },
        { value: 'O primeiro da fila foi atendido', bin: 'remover' },
        { value: 'Tem leite no carrinho?', bin: 'procurar' },
        { value: 'Qual é a 3ª música?', bin: 'ler' },
        { value: 'Pôr pão no carrinho', bin: 'adicionar' },
        { value: 'Tirar o café do carrinho', bin: 'remover' },
        { value: 'A Bia está na chamada?', bin: 'procurar' },
        { value: 'Qual é a primeira nota?', bin: 'ler' },
      ],
      notes: [
        'Pergunta-chave: a lista muda (adicionar, remover) ou só é consultada (ler, procurar)?',
        'A 3ª música é o índice 2',
        'Pedir para a turma escrever a linha de código de duas situações',
      ],
    },

    // 22 · E
    {
      id: 'carrinho',
      kind: 'scene',
      depth: 'core',
      title: 'Desafio: carrinho de compras',
      description:
        'O carrinho começa vazio, recebe pão, café e leite, perde o pão e termina com café e leite.',
      code: code.cart,
      steps: [
        {
          caption: 'O carrinho começa vazio e recebe dois itens.',
          activeLine: 3,
          list: shelf('carrinho', ['pão', 'café']),
        },
        {
          caption: 'O if da aula 5: só põe leite se ainda não tiver.',
          activeLine: 5,
          list: shelf('carrinho', ['pão', 'café', 'leite'], { focus: 2 }),
        },
        {
          caption: 'Desistiu do pão: sai a gaveta 0.',
          activeLine: 7,
          list: shelf('carrinho', ['café', 'leite']),
        },
        {
          caption: 'E para mostrar cada item numa linha, sem escrever uma linha por item? Próxima aula.',
          activeLine: 9,
          output: lines(printed('café', 'leite'), '2'),
        },
      ],
      notes: [
        'Junta as aulas: variável (aula 1), ! (aula 4), if (aula 5) e a lista de hoje',
        'Pedir para a turma rodar de novo de cabeça: e se o leite já estivesse no carrinho?',
        'Desafio extra: mostrar "Carrinho vazio" quando o tamanho for 0',
        'A pergunta final abre a aula de laços de repetição',
      ],
    },

    // 23 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        {
          title: 'Lista',
          value: { js: '[{v:"maçã"}, {v:"uva"}]', ts: '{t:string}[]', java: '{t:List}<{t:String}>' },
          text: 'Vários valores com um nome só.',
        },
        {
          title: 'Índice',
          value: { js: '{n:frutas}[{v:0}]', ts: '{n:frutas}[{v:0}]', java: '{n:frutas}.{f:get}({v:0})' },
          text: 'A posição, começando do 0.',
        },
        {
          title: 'Tamanho',
          value: { js: '{n:frutas}.{f:length}', ts: '{n:frutas}.{f:length}', java: '{n:frutas}.{f:size}()' },
          text: 'O último índice é o tamanho - 1.',
        },
        {
          title: 'Operações',
          value: { js: '{f:push} {f:splice} {f:includes}', ts: '{f:push} {f:splice} {f:includes}', java: '{f:add} {f:remove} {f:contains}' },
          text: 'Adicionar, remover, procurar: mesma ideia, nome diferente.',
        },
      ],
      notes: [
        'Pedir para a turma montar a lista de compras da semana e tirar um item',
        'Lembrar: índice começa no 0; remover muda o índice de quem vem depois',
        'Próxima aula: laços de repetição, passar por todos os itens da lista',
        'Abrir para perguntas',
      ],
    },
  ],
};
