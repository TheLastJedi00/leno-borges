import type { BySyntax, ChestState, Deck, ListState, LoopState } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 8 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/011 - Lacos de Repeticao/context.md
// Metáfora: a execução corre numa pista. A cada volta passa pelo portão da condição: true entra
// para mais uma volta, false sai. Ao percorrer a lista, a gaveta acesa anda uma casa por volta.

/** Linha `n` do JS/TS; no Java, a lista com valores ocupa uma linha a mais. */
const L = (n: number): BySyntax<number> => ({ js: n, ts: n, java: n + 1 });

/** Baú de inteiro aberto, com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });
const text = (id: string, item: string) => chest(id, 'text', { open: true, label: id, item });

/** Gaveteiro de textos (`"maçã"`) ou de números. */
const shelf = (name: string, values: (string | number)[], extra: Partial<ListState> = {}): ListState => ({
  name,
  items: values.map((v) => ({ id: String(v), value: typeof v === 'number' ? String(v) : `"${v}"` })),
  ...extra,
});
const fruits = (extra: Partial<ListState> = {}) => shelf('frutas', ['maçã', 'uva', 'pera'], extra);
const notes789 = (extra: Partial<ListState> = {}) => shelf('notas', [7, 9, 8], extra);

/** `console.log(i)` ou `System.out.println(i)`, para o corpo da pista. */
const say = (what: string): BySyntax => ({ js: `console.log(${what})`, ts: `console.log(${what})`, java: `System.out.println(${what})` });
/** Pista do while que conta de 1 a 3. */
const WHILE = (laps: number, answer: boolean | null): BySyntax<LoopState> => {
  const base = { condition: 'i <= 3', laps, answer };
  return {
    js: { ...base, body: ['console.log(i)', 'i++'] },
    ts: { ...base, body: ['console.log(i)', 'i++'] },
    java: { ...base, body: ['System.out.println(i)', 'i++'] },
  };
};
/** Pista do for: começo, condição e passo. */
const FOR = (condition: string, body: BySyntax, update: string, from: string) =>
  (laps: number, answer: boolean | null): BySyntax<LoopState> => {
    const make = (s: 'js' | 'ts' | 'java'): LoopState => ({
      init: `${s === 'java' ? 'int' : 'let'} i = ${from}`,
      condition,
      body: [typeof body === 'string' ? body : body[s]!],
      update,
      laps,
      answer,
    });
    return { js: make('js'), ts: make('ts'), java: make('java') };
  };
const FOR3 = FOR('i <= 3', say('i'), 'i++', '1');
const FOR_ODD = FOR('i <= 6', 'if (i % 2 == 0) continue', 'i++', '1');

/** Pista do slide do do...while: o corpo do while ou do do...while, com o texto de cada um. */
const DO_WHILE = (kind: 'while' | 'do', laps: number, answer: boolean | null): BySyntax<LoopState> => {
  const make = (s: 'js' | 'ts' | 'java'): LoopState => ({
    condition: 'i <= 3',
    body: [`${s === 'java' ? 'System.out.println' : 'console.log'}("${kind}: " + i)`, 'i++'],
    kind,
    laps,
    answer,
  });
  return { js: make('js'), ts: make('ts'), java: make('java') };
};

/** Saída da lista impressa: `console.log` do Node no JS/TS. */
const JAVA_OUT_OF_BOUNDS = 'Exception in thread "main" java.lang.IndexOutOfBoundsException: Index 3 out of bounds for length 3';
const JAVA_CME = 'Exception in thread "main" java.util.ConcurrentModificationException';

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Laços de repetição',
      subtitle: 'Como fazer o programa repetir uma tarefa',
      notes: [
        'Retomar a pergunta do fim da aula 7: como mostrar cada item da lista sem uma linha por item?',
        'Pergunta de abertura: o que você repete todo dia? Escovar os dentes, subir degraus, contar troco',
        'Hoje: o laço, um trecho que roda de novo enquanto a condição for verdadeira',
      ],
    },

    // 2 · E
    {
      id: 'while',
      kind: 'scene',
      depth: 'core',
      title: 'while: enquanto for verdade',
      description:
        'A pista do laço: a condição i <= 3 na entrada, o corpo embaixo e a seta que volta. O placar conta 3 voltas; com i 4, a seta false sai da pista.',
      code: code.whileCount,
      steps: [
        {
          caption: 'Imprimir 1, 2 e 3 sem laço pede três linhas quase iguais. Com while, uma só:',
          activeLine: 1,
          chests: [int('i', '1')],
          loop: WHILE(0, null),
        },
        {
          caption: 'Antes de cada volta, a pergunta: i <= 3? true, então entra.',
          activeLine: 2,
          loop: WHILE(0, true),
        },
        {
          caption: 'Imprime, soma 1 ao i e volta para a pergunta.',
          activeLine: 4,
          chests: [int('i', '2', { focus: 'item' })],
          loop: WHILE(1, null),
          output: '1',
        },
        {
          caption: 'Mais duas voltas: imprime 2 e 3, e o i chega a 4.',
          activeLine: 4,
          chests: [int('i', '4', { focus: 'item' })],
          loop: WHILE(3, null),
          output: '1\n2\n3',
        },
        {
          caption: '4 <= 3 é false: sai do laço e segue o programa.',
          activeLine: 6,
          skip: [3, 4],
          loop: WHILE(3, false),
          output: '1\n2\n3\nFim',
        },
      ],
      notes: [
        'Ler: "enquanto i for menor ou igual a 3, faça..."',
        'A condição é a mesma pergunta das aulas 3 e 4; o while repete a pergunta a cada volta',
        'Cada volta também se chama iteração',
        'O i++ (aula 2) é o que leva o laço a terminar',
      ],
    },

    // 3 · A
    {
      id: 'teste-de-mesa',
      kind: 'trace',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Teste de mesa',
      lead: 'Uma linha por volta: o valor de i, a resposta da condição e o que aparece.',
      code: code.whileCount,
      columns: [
        { head: 'Volta' },
        { head: '{n:i}', js: 'i' },
        { head: '{n:i} <= {v:3}', js: 'i <= 3' },
        { head: 'Imprime', out: true },
      ],
      rows: [
        { cells: ['1', '1', 'true', '1'], line: 3 },
        { cells: ['2', '2', 'true', '2'], line: 3 },
        { cells: ['3', '3', 'true', '3'], line: 3 },
        { cells: ['', '4', 'false', 'Fim'], line: 6 },
      ],
      at: 3,
      end: 6,
      notes: [
        'Teste de mesa é executar o código no papel, como o computador faria',
        'Pedir para a turma preencher a próxima linha antes de mostrar',
        'A última linha é a pergunta que dá false: ela também acontece',
        'Ferramenta para achar erro em laço: onde a tabela diverge do esperado?',
      ],
    },

    // 4 · E
    {
      id: 'laco-infinito',
      kind: 'scene',
      depth: 'core',
      noRun: true,
      title: 'Laço infinito',
      description: 'Sem o i++, o placar da pista não para de subir e a condição continua true.',
      code: code.infinite,
      steps: [
        {
          caption: 'Sem o i++, o i fica em 1 para sempre.',
          activeLine: 3,
          chests: [int('i', '1')],
          loop: { js: { condition: 'i <= 3', body: ['console.log(i)'], laps: 1, answer: true }, ts: { condition: 'i <= 3', body: ['console.log(i)'], laps: 1, answer: true }, java: { condition: 'i <= 3', body: ['System.out.println(i)'], laps: 1, answer: true } },
          output: '1',
        },
        {
          caption: '1 <= 3 é sempre true: o programa nunca sai do laço. No terminal, Ctrl+C interrompe.',
          loop: { js: { condition: 'i <= 3', body: ['console.log(i)'], laps: 999, answer: true }, ts: { condition: 'i <= 3', body: ['console.log(i)'], laps: 999, answer: true }, java: { condition: 'i <= 3', body: ['System.out.println(i)'], laps: 999, answer: true } },
          output: '1\n1\n1\n1\n...',
          outputTone: 'error',
        },
      ],
      notes: [
        'Todo laço precisa de algo que mude a condição para false',
        'Sinais: o programa não termina, o terminal enche de linhas, o navegador trava',
        'Ctrl+C no terminal; no navegador, fechar a aba',
        'Às vezes é de propósito: um servidor ou um jogo rodam "para sempre" esperando eventos',
      ],
    },

    // 5 · E
    {
      id: 'for',
      kind: 'scene',
      depth: 'core',
      title: 'for: começo, condição e passo',
      description:
        'A pista do for: o começo i = 1 antes da pista, a condição i <= 3 no portão e o passo i++ no fim de cada volta. 3 voltas.',
      code: code.forCount,
      steps: [
        {
          caption: 'O for junta numa linha as três partes do while: começo; condição; passo.',
          activeLine: 1,
          chests: [int('i', '1')],
          loop: FOR3(0, null),
        },
        {
          caption: 'O começo roda uma vez. Depois, a cada volta: pergunta, corpo e passo.',
          activeLine: 2,
          loop: FOR3(0, true),
          output: '1',
        },
        {
          caption: 'Depois de 3 voltas, i vale 4 e a condição dá false.',
          activeLine: 1,
          chests: [int('i', '4', { focus: 'item' })],
          loop: FOR3(3, false),
          output: '1\n2\n3',
        },
      ],
      notes: [
        'for e while fazem a mesma coisa; o for deixa tudo o que controla o laço numa linha',
        'Use for quando sabe quantas voltas vai dar; while quando depende de algo que acontece no caminho',
        'Os ; separam as três partes; o passo roda no fim da volta, antes da próxima pergunta',
        'Java: int i = 1; JS: let i = 1 (o TS deduz que é number)',
      ],
    },

    // 6 · A
    {
      id: 'exercicio-quantas',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Quantas vezes?',
      question: 'Quantas linhas este laço imprime?',
      code: code.stepTwo,
      options: ['4 linhas', '5 linhas', '6 linhas', '10 linhas'],
      answer: 1,
      explanation: 'O i vale 0, 2, 4, 6 e 8. Com 10, 10 < 10 é false: são 5 voltas.',
      trace: [
        { activeLine: 1, chests: [int('i', '0')] },
        { activeLine: 2, chests: [int('i', '8', { focus: 'item' })] },
        { activeLine: 1, chests: [int('i', '10', { focus: 'item', error: true })] },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou 10 contou até 10 de 1 em 1',
        'Quem marcou 6 contou o 10, mas 10 < 10 é false',
        'Fazer o teste de mesa no quadro: i, i < 10, imprime',
      ],
    },

    // 7 · E
    {
      id: 'percorrer-indice',
      kind: 'scene',
      depth: 'core',
      title: 'Percorrer a lista pelo índice',
      description: 'A gaveta acesa anda uma casa por volta: 0, 1 e 2. Com i 3, o laço termina.',
      code: code.walkIndex,
      steps: [
        {
          caption: 'O i começa em 0, o primeiro índice (aula 7).',
          activeLine: L(3),
          chests: [int('i', '0')],
          list: fruits({ focus: 0 }),
          output: 'maçã',
        },
        {
          caption: 'A cada volta, o i aumenta 1 e a gaveta acesa anda uma casa.',
          activeLine: L(3),
          chests: [int('i', '1', { focus: 'item' })],
          list: fruits({ focus: 1 }),
          output: 'maçã\nuva',
        },
        {
          activeLine: L(3),
          chests: [int('i', '2', { focus: 'item' })],
          list: fruits({ focus: 2 }),
          output: 'maçã\nuva\npera',
        },
        {
          caption: {
            js: 'Com i 3, 3 < frutas.length (3) é false: acabaram as gavetas.',
            ts: 'Com i 3, 3 < frutas.length (3) é false: acabaram as gavetas.',
            java: 'Com i 3, 3 < frutas.size() (3) é false: acabaram as gavetas.',
          },
          activeLine: L(2),
          chests: [int('i', '3', { focus: 'item' })],
          list: fruits(),
        },
      ],
      notes: [
        'Resposta da aula 7: uma linha de laço mostra a lista inteira, tenha 3 ou 3 mil itens',
        'O índice vai de 0 até o tamanho - 1: por isso a condição é i < tamanho',
        'Java: frutas.size() e frutas.get(i); JS/TS: frutas.length e frutas[i]',
      ],
    },

    // 8 · A
    {
      id: 'volta-a-mais',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Uma volta a mais',
      description: 'Com <=, a última volta pede a gaveta 3, que aparece como fantasma em vermelho.',
      code: code.offByOne,
      steps: [
        {
          caption: 'Trocar < por <= parece inofensivo…',
          activeLine: L(2),
          chests: [int('i', '0')],
          list: fruits(),
        },
        {
          caption: {
            js: '…mas com i 3, 3 <= 3 é true: pede a gaveta 3, que não existe, e imprime undefined.',
            ts: '…mas com i 3, 3 <= 3 é true: pede a gaveta 3, que não existe, e imprime undefined.',
            java: '…mas com i 3, 3 <= 3 é true: pede a gaveta 3, que não existe, e o programa para.',
          },
          activeLine: L(3),
          chests: [int('i', '3', { focus: 'item', error: true })],
          list: fruits({ outside: 3 }),
          output: { js: 'maçã\nuva\npera\nundefined', ts: 'maçã\nuva\npera\nundefined', java: `maçã\nuva\npera\n${JAVA_OUT_OF_BOUNDS}` },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'É o erro de laço mais comum: errar por um (em inglês, off-by-one)',
        'Regra: começando do 0, a condição é i < tamanho',
        'Retoma o slide "Fora da lista" da aula 7: JS segue com undefined, Java para',
      ],
    },

    // 9 · E
    {
      id: 'cada-item',
      kind: 'scene',
      depth: 'core',
      title: 'Cada item da lista',
      description: 'O baú fruta recebe o item de cada gaveta, uma por volta: maçã, uva e pera.',
      code: code.forOf,
      steps: [
        {
          caption: {
            js: 'Sem índice: a cada volta, fruta recebe o próximo item.',
            ts: 'Sem índice: a cada volta, fruta recebe o próximo item.',
            java: 'Sem índice: a cada volta, fruta recebe o próximo item. Lê-se "para cada fruta em frutas".',
          },
          activeLine: L(3),
          chests: [text('fruta', '"maçã"')],
          list: fruits({ focus: 0 }),
          output: 'maçã',
        },
        {
          activeLine: L(3),
          chests: [text('fruta', '"uva"')],
          list: fruits({ focus: 1 }),
          output: 'maçã\nuva',
        },
        {
          caption: 'Acabaram os itens, acabou o laço. Sem condição para errar.',
          activeLine: L(3),
          chests: [text('fruta', '"pera"')],
          list: fruits({ focus: 2 }),
          output: 'maçã\nuva\npera',
        },
      ],
      notes: [
        'Mesma ideia, sintaxe diferente: for (const fruta of frutas) no JS/TS, for (String fruta : frutas) no Java',
        'Use quando precisa de cada item e não do índice',
        'Não dá para errar por um: o laço sabe onde a lista acaba',
        'JS/TS: frutas.forEach(...) faz o mesmo com uma função (próxima aula)',
      ],
    },

    // 10 · E
    {
      id: 'soma',
      kind: 'scene',
      depth: 'core',
      title: 'Acumulador: a soma das notas',
      description: 'A cada volta, a nota da gaveta acesa é somada ao baú soma: 7, 16 e 24. A média é 8.',
      code: code.sum,
      steps: [
        {
          caption: 'O acumulador começa em 0, antes do laço.',
          activeLine: L(2),
          chests: [int('soma', '0')],
          list: notes789(),
        },
        {
          caption: 'Cada volta soma a nota da vez: soma += nota.',
          activeLine: L(4),
          chests: [int('soma', '7', { focus: 'item' })],
          list: notes789({ focus: 0 }),
        },
        {
          activeLine: L(4),
          chests: [int('soma', '16', { focus: 'item' })],
          list: notes789({ focus: 1 }),
        },
        {
          activeLine: L(4),
          chests: [int('soma', '24', { focus: 'item' })],
          list: notes789({ focus: 2 }),
        },
        {
          caption: 'Depois do laço, o total e a média (soma dividida pelo tamanho, aula 2).',
          activeLine: L(7),
          list: notes789(),
          output: '24\n8',
        },
      ],
      notes: [
        'Acumulador: variável que guarda o resultado parcial a cada volta',
        'Começa em 0 para soma; para multiplicar, começaria em 1',
        'soma += nota é o mesmo que soma = soma + nota (aula 2)',
        'Java: 24 / 3 é divisão de inteiros; com 25 daria 8, não 8.33 (aula 2)',
      ],
    },

    // 11 · A
    {
      id: 'teste-de-mesa-soma',
      kind: 'trace',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Teste de mesa da soma',
      lead: 'O valor de nota e de soma no fim de cada volta.',
      code: code.sum,
      columns: [{ head: 'Volta' }, { head: '{n:nota}', js: 'nota' }, { head: '{n:soma}', js: 'soma' }],
      rows: [
        { cells: ['1', '7', '7'], line: L(4) },
        { cells: ['2', '9', '16'], line: L(4) },
        { cells: ['3', '8', '24'], line: L(4) },
      ],
      at: 5,
      notes: [
        'Pedir para a turma preencher a linha 2 antes de mostrar',
        'E se a soma começasse em 10? Toda a coluna sobe 10: o acumulador precisa começar no lugar certo',
        'O mesmo laço serve para contar: conta += 1 a cada volta',
      ],
    },

    // 12 · A
    {
      id: 'maior',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'O maior valor',
      description: 'O baú maior começa com 7, troca para 9 quando aparece a nota 9 e não muda com o 8.',
      code: code.max,
      steps: [
        {
          caption: 'maior começa com a primeira nota.',
          activeLine: L(2),
          chests: [int('maior', '7')],
          list: notes789({ focus: 0 }),
        },
        {
          caption: 'A cada volta, o if da aula 5: a nota da vez é maior que o maior até agora?',
          activeLine: L(5),
          chests: [int('maior', '9', { focus: 'item' })],
          list: notes789({ focus: 1 }),
        },
        {
          caption: '8 > 9 é false: o maior continua 9.',
          activeLine: L(4),
          skip: { js: [5], ts: [5], java: [6] },
          list: notes789({ focus: 2 }),
        },
        {
          activeLine: L(8),
          skip: [],
          list: notes789(),
          output: '9',
        },
      ],
      notes: [
        'Começar com a primeira nota, e não com 0: com notas negativas, 0 daria errado',
        'Trocando > por <, o mesmo laço acha o menor',
        'JS: Math.max(...notas); Java: Collections.max(notas) fazem o mesmo pronto',
      ],
    },

    // 13 · E
    {
      id: 'break',
      kind: 'scene',
      depth: 'core',
      title: 'break: parar antes do fim',
      description: 'A gaveta 0 (8) passa, a gaveta 1 (4) é reprovada e o laço para: a gaveta 2 nem acende.',
      code: code.breakFind,
      steps: [
        {
          caption: 'Procurar o primeiro aluno reprovado (nota menor que 5).',
          activeLine: L(7),
          list: shelf('notas', [8, 4, 9], { focus: 0 }),
          output: 'Ok: 8',
        },
        {
          caption: 'Achou o 4: avisa e o break sai do laço na hora.',
          activeLine: L(5),
          list: shelf('notas', [8, 4, 9], { focus: 1 }),
          output: 'Ok: 8\nReprovado: 4',
        },
        {
          caption: 'A gaveta 2 nem é aberta: não precisa olhar o resto.',
          list: shelf('notas', [8, 4, 9]),
        },
      ],
      notes: [
        'O break da aula 6 (switch) também serve para laços: sai do laço inteiro',
        'Útil para procurar: achou, para',
        'Sem o break, o laço avisaria todos os reprovados',
      ],
    },

    // 14 · A
    {
      id: 'continue',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'continue: pular uma volta',
      description: 'De 1 a 6, as voltas dos números pares pulam direto para o passo: aparecem só 1, 3 e 5.',
      code: code.continueOdd,
      steps: [
        {
          caption: 'Com i 1, ímpar: imprime.',
          activeLine: 5,
          skip: [3],
          chests: [int('i', '1')],
          loop: FOR_ODD(0, true),
          output: '1',
        },
        {
          caption: 'Com i 2, par: o continue pula o resto da volta e vai para o passo.',
          activeLine: 3,
          skip: [5],
          chests: [int('i', '2', { focus: 'item' })],
          loop: FOR_ODD(1, true),
          output: '1',
        },
        {
          caption: 'No fim, só os ímpares (o par ou ímpar da aula 5).',
          activeLine: 1,
          skip: [],
          chests: [int('i', '7', { focus: 'item' })],
          loop: FOR_ODD(6, false),
          output: '1\n3\n5',
        },
      ],
      notes: [
        'break sai do laço; continue só pula para a próxima volta',
        'No for, o continue ainda roda o passo (i++); no while, cuidado: se o i++ ficar depois do continue, vira laço infinito',
        'O mesmo resultado sai com if (i % 2 !== 0) imprimindo; o continue é útil quando há muito código depois',
      ],
    },

    // 15 · A
    {
      id: 'do-while',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'do...while: pelo menos uma vez',
      description:
        'O while pergunta antes e não roda nenhuma vez. O do...while roda o corpo, depois pergunta, e sai com 1 volta.',
      code: code.doWhile,
      steps: [
        {
          caption: 'Com i 5, o while pergunta antes: 5 <= 3 é false. Roda 0 vezes.',
          activeLine: 2,
          skip: [3, 4],
          loop: DO_WHILE('while', 0, false),
        },
        {
          caption: 'O do...while roda o corpo primeiro…',
          activeLine: 7,
          skip: [3, 4],
          loop: DO_WHILE('do', 0, null),
          output: 'do: 5',
        },
        {
          caption: '…e só depois pergunta: false, sai. Rodou uma vez.',
          activeLine: 9,
          loop: DO_WHILE('do', 1, false),
        },
      ],
      notes: [
        'Uso típico: mostrar um menu e repetir enquanto a opção for inválida (o menu aparece pelo menos uma vez)',
        'O do...while termina com ; depois da condição',
        'É o laço menos usado dos três; existe igual em JS, TS e Java',
      ],
    },

    // 16 · A (só JS/TS)
    {
      id: 'for-in',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'for...in na lista',
      code: only.forIn,
      steps: [
        {
          caption: 'for...in parece o for...of, mas dá os índices, e não os itens.',
          activeLine: 2,
          list: fruits(),
        },
        {
          caption: 'E os índices vêm como texto: "0" + 1 junta e dá "01" (aula 2).',
          activeLine: 3,
          output: '01\n11\n21',
        },
      ],
      notes: [
        'for...in foi feito para as chaves de um objeto, não para listas',
        'Para listas: for...of (itens) ou o for com índice',
        'O TS deixa compilar: o tipo de i é string, e texto + número é permitido',
      ],
    },

    // 17 · A (só Java)
    {
      id: 'java-remover-no-laco',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'Remover durante o for-each',
      description: 'A gaveta maçã sai durante o laço e o Java para com um erro na volta seguinte.',
      code: only.removeInForEach,
      steps: [
        {
          caption: 'Na primeira volta, a maçã sai da lista enquanto o for-each passa por ela.',
          activeLine: 5,
          list: shelf('frutas', ['uva', 'pera']),
        },
        {
          caption: 'Na volta seguinte, o Java percebe que a lista mudou no meio do caminho e para.',
          activeLine: 3,
          output: JAVA_CME,
          outputTone: 'error',
        },
      ],
      notes: [
        'O for-each não deixa a lista mudar de tamanho enquanto passa por ela',
        'Para remover com condição: frutas.removeIf(f -> f.equals("maçã")), depois da aula de funções',
        'Ou com um Iterator e o remove dele',
        'No JS, o mesmo erro passa em silêncio: a lista anda e o laço pula um item',
      ],
    },

    // 18 · A
    {
      id: 'exercicio-contagem',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Contagem regressiva',
      lead: 'Troque o começo do laço e veja quantas voltas a pista dá.',
      variable: 'i',
      code: code.countdown,
      loop: {
        js: { condition: 'i >= 1', body: ['console.log(i)'], update: 'i--' },
        ts: { condition: 'i >= 1', body: ['console.log(i)'], update: 'i--' },
        java: { condition: 'i >= 1', body: ['System.out.println(i)'], update: 'i--' },
      },
      choices: [
        { value: '5', output: '5\n4\n3\n2\n1', laps: 5 },
        { value: '3', output: '3\n2\n1', laps: 3 },
        { value: '1', output: '1', laps: 1 },
        { value: '0', output: '', laps: 0 },
      ],
      goals: ['3\n2\n1', '1', ''],
      notes: [
        'i-- tira 1 a cada volta: o laço conta para trás',
        'Desafio 3: com 0, a primeira pergunta já dá false e o laço roda 0 vezes',
        'Pergunta: e com i >= 0? Uma volta a mais, imprimindo 0',
      ],
    },

    // 19 · A
    {
      id: 'exercicio-qual-laco',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual laço?',
      lead: 'Qual laço combina mais com cada situação?',
      bins: [
        { id: 'for', shape: 'text', label: 'for' },
        { id: 'cada', shape: 'text', label: { js: 'for...of', ts: 'for...of', java: 'for-each' } },
        { id: 'while', shape: 'text', label: 'while' },
      ],
      items: [
        { value: 'Repetir 10 vezes', bin: 'for' },
        { value: 'Contar de 1 a 100', bin: 'for' },
        { value: 'Cada aluno da chamada', bin: 'cada' },
        { value: 'Somar as notas', bin: 'cada' },
        { value: 'Até a senha estar certa', bin: 'while' },
        { value: 'Enquanto tiver saldo', bin: 'while' },
      ],
      notes: [
        'Pergunta-chave: sei quantas voltas (for), passo por cada item (for...of / for-each) ou depende de algo que vai acontecer (while)?',
        'Os três podem fazer tudo; a escolha deixa a intenção clara',
        'A senha: não dá para saber quantas tentativas a pessoa vai precisar',
      ],
    },

    // 20 · A
    {
      id: 'zune-2008',
      kind: 'cards',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'O tocador que travou no último dia do ano',
      lead: 'Em 31 de dezembro de 2008, os tocadores de música Zune de 30 GB, da Microsoft, travaram no mundo todo.',
      cards: [
        { title: 'A causa', value: '{k:while} ({n:dias} > {v:365})', text: 'Um laço convertia dias em anos e não sabia sair no dia 366 de um ano bissexto.' },
        { title: 'O efeito', value: '{v:31/12}', text: 'O aparelho ficava preso na tela de abertura.' },
        { title: 'A solução', value: '{v:1/1}', text: 'Esperar o dia seguinte: no dia 367, o laço voltava a terminar.' },
      ],
      notes: [
        'O código do relógio tirava 366 ou 365 dias por ano até sobrar o dia do ano atual',
        'No dia 366 de 2008 (bissexto), nenhuma das condições mudava o valor: laço infinito',
        'A recomendação oficial foi deixar a bateria acabar e ligar de novo no dia 1º',
        'Moral: teste o laço nos limites (o último dia, a lista vazia, o 0)',
      ],
    },

    // 21 · E
    {
      id: 'tabuada',
      kind: 'scene',
      depth: 'core',
      title: 'Desafio: tabuada',
      code: code.table,
      steps: [
        {
          caption: 'A tabuada do 7: o laço muda o i, a conta muda junto.',
          activeLine: 3,
          chests: [int('n', '7'), int('i', '1')],
          output: '7 x 1 = 7',
        },
        {
          caption: 'Cinco voltas, cinco linhas. Desafio: ir até 10, e depois trocar o n.',
          activeLine: 2,
          chests: [int('n', '7'), int('i', '6', { focus: 'item' })],
          output: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35',
        },
      ],
      notes: [
        'Junta as aulas: variável (1), operadores e texto + número (2), condição (3) e o laço de hoje',
        'Desafio extra: a tabuada de 1 a 10 inteira, com um laço dentro do outro',
        'Desafio extra: somar só os resultados pares',
      ],
    },

    // 22 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'while', value: '{k:while} ({n:i} <= {v:3})', text: 'Repete enquanto a condição for true.' },
        { title: 'for', value: '{k:for} (…; …; {n:i}++)', text: 'Começo, condição e passo numa linha.' },
        {
          title: 'Cada item',
          value: { js: '{k:for} (… {k:of} {n:frutas})', ts: '{k:for} (… {k:of} {n:frutas})', java: '{k:for} (… : {n:frutas})' },
          text: 'Passa por todos os itens da lista.',
        },
        { title: 'break / continue', value: '{k:break}; {k:continue};', text: 'Sai do laço / pula a volta.' },
      ],
      notes: [
        'Lembrar: todo laço precisa de algo que leve a condição a false',
        'Pedir para a turma escrever um laço que some os números de 1 a 100 (5050)',
        'Próxima aula: funções, dar nome a um trecho de código e usar de novo',
        'Abrir para perguntas',
      ],
    },
  ],
};
