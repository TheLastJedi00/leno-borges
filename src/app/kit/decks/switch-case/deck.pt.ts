import type { ChestState, Deck, SorterState } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 6 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/009 - Condicionais/context.md
// Metáfora: o valor do switch é um item que desce pela calha e cai no escaninho com a etiqueta
// igual (case). Sem break, o fundo do escaninho fica aberto e a execução cai no de baixo.

/** Baú aberto com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });

type Sorter = Omit<SorterState, 'value' | 'dropped'>;
const DAYS: Sorter = {
  cases: [
    { label: '1', out: '"Dom"', brk: true },
    { label: '2', out: '"Seg"', brk: true },
    { label: '3', out: '"Ter"', brk: true },
  ],
};
const DAYS_DEFAULT: Sorter = {
  cases: [
    { label: '1', out: '"Dom"', brk: true },
    { label: '2', out: '"Seg"', brk: true },
  ],
  fallback: { out: '"Inválido"' },
};
const FALL: Sorter = {
  cases: [
    { label: '1', out: '"Dom"' },
    { label: '2', out: '"Seg"' },
    { label: '3', out: '"Ter"', brk: true },
  ],
  fallback: { out: '"Inválido"' },
};
const DAY_OFF: Sorter = {
  cases: [{ label: '1' }, { label: '7', out: '"Folga"', brk: true }],
  fallback: { out: '"Trabalho"' },
};
const STRICT: Sorter = {
  cases: [{ label: '5', out: '"cinco"', brk: true }],
  fallback: { out: '"outro"' },
};

/** Triagem com o valor no alto (`dropped` false) ou já caído. */
const at = (sorter: Sorter, value: string, dropped = true): SorterState => ({ ...sorter, value, dropped });

/** Erros conferidos no `tsc` 5.9 (TS2678) e no `javac` 17. */
const TS_NOT_COMPARABLE = "error: Type 'number' is not comparable to type 'string'.";
const JAVA_DUPLICATE = 'error: duplicate case label';

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Switch Case',
      subtitle: 'Como escolher um caminho entre vários a partir de um valor',
      notes: [
        'Retomar a aula 5: else if faz perguntas em fila',
        'Pergunta de abertura: como um elevador sabe para qual andar ir?',
        'Hoje um valor só escolhe entre muitos caminhos',
      ],
    },

    // 2 · E
    {
      id: 'muitos-else-if',
      kind: 'scene',
      depth: 'core',
      title: 'Muitos else if com o mesmo valor',
      code: code.elseIfDays,
      steps: [
        {
          caption: 'Dia da semana pelo número: a mesma pergunta em toda linha.',
          highlight: 'n',
        },
        {
          caption: 'Só muda o valor comparado. Dá para escrever isso de um jeito mais curto.',
          highlight: null,
          activeLine: 5,
          skip: [3, 6, 7],
          output: 'Seg',
        },
      ],
      notes: [
        'Funciona, mas repete dia === (Java: dia ==) em toda pergunta',
        'Com os sete dias, seriam sete perguntas iguais',
        'Quando a pergunta é sempre "o valor é igual a quê?", o switch é mais direto',
      ],
    },

    // 3 · E
    {
      id: 'switch',
      kind: 'scene',
      depth: 'core',
      title: 'switch: o valor procura a etiqueta',
      description:
        'O item 2 desce pela calha e cai no escaninho case 2, que mostra Seg. Os escaninhos case 1 e case 3 ficam apagados.',
      code: code.days,
      steps: [
        {
          value: '2',
          caption: 'O switch pega o valor de dia. Cada case é um escaninho com etiqueta.',
          activeLine: 2,
          sorter: at(DAYS, '2', false),
        },
        {
          caption: 'O item 2 cai no escaninho case 2 e roda o que está lá.',
          activeLine: 4,
          skip: [3, 5],
          sorter: at(DAYS, '2'),
          output: 'Seg',
        },
        {
          caption: 'O break fecha o fundo do escaninho: a execução sai do switch.',
        },
      ],
      notes: [
        'Ler: "conforme o dia, no caso 1... no caso 2..."',
        'O switch compara por igualdade: o valor tem que ser exatamente o da etiqueta',
        'Os dois-pontos depois do case abrem o que roda; o break encerra',
      ],
    },

    // 4 · E
    {
      id: 'default',
      kind: 'scene',
      depth: 'core',
      title: 'default: quando nenhum case serve',
      description:
        'O item 9 desce pela calha, não encontra etiqueta igual e cai no escaninho default, que mostra Inválido.',
      code: code.daysDefault,
      steps: [
        {
          value: '2',
          caption: 'Com 2, cai no case 2, como antes.',
          activeLine: 4,
          skip: [3, 5],
          sorter: at(DAYS_DEFAULT, '2'),
          output: 'Seg',
        },
        {
          value: '9',
          caption: 'Com 9, nenhuma etiqueta confere: cai no default, o else do switch.',
          activeLine: 5,
          skip: [3, 4],
          sorter: at(DAYS_DEFAULT, '9'),
          output: 'Inválido',
        },
      ],
      notes: [
        'O default é opcional; sem ele, um valor sem etiqueta não roda nada',
        'Costuma ficar por último, e por isso não precisa de break',
        'Bom lugar para tratar valor inválido',
      ],
    },

    // 5 · E
    {
      id: 'break',
      kind: 'scene',
      depth: 'core',
      title: 'break: pare aqui',
      description:
        'Sem break nos escaninhos case 1 e case 2, o item 1 cai no case 1 e a execução continua pelo case 2 e pelo case 3, onde há um break.',
      code: code.fallThrough,
      steps: [
        {
          value: '1',
          caption: 'Agora os dois primeiros case estão sem break. Valor 1:',
          activeLine: 2,
          sorter: at(FALL, '1', false),
        },
        {
          caption: 'Cai no case 1… e o fundo está aberto: roda o case 2 e o case 3 também.',
          activeLine: 5,
          skip: [6],
          sorter: at(FALL, '1'),
          output: 'Dom\nSeg\nTer',
        },
        {
          caption: 'A queda só para no primeiro break (ou no fim do switch).',
        },
      ],
      notes: [
        'Isso se chama fall-through: "cair para dentro" do próximo case',
        'O switch não pergunta de novo: depois que caiu, roda tudo até um break',
        'Esquecer o break é o erro mais comum com switch',
      ],
    },

    // 6 · A
    {
      id: 'exercicio-menu',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'O que aparece?',
      question: 'A opção escolhida no menu foi 2. O que o programa mostra?',
      code: code.predictMenu,
      options: ['Salvar', 'Salvar e Sair', 'Abrir, Salvar e Sair', 'Nada'],
      answer: 1,
      explanation: 'Cai no case 2 e mostra Salvar. Sem break, continua no case 3 e mostra Sair, e só então para.',
      trace: [
        { activeLine: 1, chests: [int('op', '2', { focus: 'item' })] },
        { activeLine: 4, skip: [3] },
        { activeLine: 5, skip: [3] },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou "Salvar" esqueceu que falta o break no case 2',
        'Quem marcou "Abrir, Salvar e Sair" achou que começa do primeiro case',
      ],
    },

    // 7 · E
    {
      id: 'casos-juntos',
      kind: 'scene',
      depth: 'core',
      title: 'Casos juntos de propósito',
      description:
        'O escaninho case 1 está vazio e sem break. O item 1 cai nele e escorrega para o case 7, que mostra Folga.',
      code: code.dayOff,
      steps: [
        {
          value: '7',
          caption: 'Domingo (1) e sábado (7) dão folga. Com 7, cai direto no case 7.',
          activeLine: 4,
          skip: [5],
          sorter: at(DAY_OFF, '7'),
          output: 'Folga',
        },
        {
          value: '1',
          caption: 'Com 1, cai no case 1, que está vazio e sem break: escorrega para o case 7.',
          activeLine: 4,
          skip: [5],
          sorter: at(DAY_OFF, '1'),
          output: 'Folga',
        },
        {
          value: '3',
          caption: 'Qualquer outro dia cai no default.',
          activeLine: 5,
          skip: [3, 4],
          sorter: at(DAY_OFF, '3'),
          output: 'Trabalho',
        },
      ],
      notes: [
        'O fall-through usado a favor: dois valores, um mesmo caminho',
        'Combinar com a turma: case vazio colado no de baixo, para mostrar que é de propósito',
        'Java moderno tem um jeito mais claro: case 1, 7 (aprofundamento)',
      ],
    },

    // 8 · E
    {
      id: 'texto',
      kind: 'scene',
      depth: 'core',
      title: 'switch com texto',
      code: code.traffic,
      steps: [
        {
          caption: 'As etiquetas também podem ser texto.',
          activeLine: 2,
        },
        {
          caption: '"amarelo" confere com o segundo case.',
          activeLine: 4,
          skip: [3, 5],
          output: 'Atenção',
        },
      ],
      notes: [
        'Texto precisa ser igual letra por letra: "Amarelo" com maiúscula não confere',
        'Java aceita String no switch desde o Java 7, e compara com equals (aula 3)',
        'Sem default aqui: uma cor desconhecida não mostra nada',
      ],
    },

    // 9 · A (só JS/TS)
    {
      id: 'compara-estrito',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['js', 'ts'],
      title: 'O switch compara com ===',
      description:
        'O item "5", um texto, desce pela calha e não confere com a etiqueta case 5, um número: cai no default.',
      code: only.strict,
      steps: [
        {
          caption: 'O valor é o texto "5"; a etiqueta é o número 5.',
          activeLine: 2,
          sorter: { js: at(STRICT, '"5"', false), ts: at(STRICT, '"5"', false) },
        },
        {
          caption: {
            js: '"5" === 5 é false: não confere e cai no default.',
            ts: 'O TS recusa antes de rodar: texto nunca é igual a número.',
          },
          activeLine: { js: 4, ts: 3 },
          skip: { js: [3], ts: [] },
          sorter: { js: at(STRICT, '"5"'), ts: at(STRICT, '"5"', false) },
          output: { js: 'outro', ts: TS_NOT_COMPARABLE },
          outputTone: { js: 'ok', ts: 'error' },
        },
      ],
      notes: [
        'O switch usa === (aula 3): tipo e valor precisam bater',
        'Valor que vem de um campo de texto chega como texto: converter com Number() antes',
        'TS: o erro aparece no case, antes de rodar (TS2678)',
      ],
    },

    // 10 · A (só Java)
    {
      id: 'java-tipos',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'O que o switch do Java aceita',
      code: only.javaDuplicate,
      steps: [
        {
          caption: 'Duas etiquetas iguais: o Java recusa antes de rodar.',
          activeLine: 4,
          output: JAVA_DUPLICATE,
          outputTone: 'error',
        },
        {
          caption: 'Aceita int, char, String e enum. Com double, boolean ou long, não compila.',
        },
      ],
      notes: [
        'Também vale para Integer, Character, byte e short',
        'Com double ou boolean, o javac 17 dá uma mensagem confusa ("patterns in switch statements are a preview feature"): o recado é que esse tipo não serve',
        'Para faixas de valores e decimais, if / else if (aula 5)',
      ],
    },

    // 11 · A (só Java)
    {
      id: 'java-seta',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'Java moderno: case com seta',
      code: only.javaArrow,
      steps: [
        {
          caption: 'Com ->, cada case roda só o seu: sem break e sem queda. Vários valores com vírgula.',
          activeLine: 3,
        },
        {
          caption: 'E o switch pode devolver um valor, que cabe num baú.',
          activeLine: 6,
          output: 'Folga',
        },
      ],
      notes: [
        'Existe desde o Java 14; o switch de dois-pontos continua valendo',
        'Também serve sem devolver valor: case 1, 7 -> System.out.println("Folga");',
        'O switch que devolve valor precisa cobrir todos os casos: daí o default',
        'Termina com ; depois da chave, porque é uma atribuição',
      ],
    },

    // 12 · A (só JS/TS)
    {
      id: 'switch-true',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'switch (true)',
      code: only.switchTrue,
      steps: [
        {
          caption: 'Truque: o valor é true, e cada case é uma pergunta.',
          activeLine: 2,
        },
        {
          caption: 'Cai no primeiro case cuja pergunta dá true.',
          activeLine: 4,
          skip: [3, 5],
          output: 'B',
        },
      ],
      notes: [
        'Funciona porque cada case é comparado com true usando ===',
        'Faz o mesmo que o else if da aula 5, que costuma ser mais claro',
        'Java não aceita: as etiquetas precisam ser valores fixos',
      ],
    },

    // 13 · E
    {
      id: 'switch-ou-if',
      kind: 'cards',
      depth: 'core',
      title: 'switch ou if?',
      cards: [
        {
          title: 'switch',
          value: '{k:case} {v:1}: … {k:case} {v:2}:',
          text: 'Um valor comparado com valores fixos: dia, opção de menu, cor, operador.',
          tone: 'good',
        },
        {
          title: 'if',
          value: '{n:nota} >= {v:7} && …',
          text: 'Faixas, comparações diferentes e perguntas combinadas com && e ||.',
          tone: 'good',
        },
      ],
      notes: [
        'Tudo o que o switch faz, o if também faz; o contrário não',
        'O switch deixa claro que a decisão depende de um valor só',
        'Na dúvida, if: é mais flexível',
      ],
    },

    // 14 · A
    {
      id: 'exercicio-switch-ou-if',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'switch ou if?',
      lead: 'Qual combina mais com cada situação?',
      bins: [
        { id: 'switch', shape: 'text', label: 'switch' },
        { id: 'if', shape: 'text', label: 'if' },
      ],
      items: [
        { value: 'Opção 1 a 4 do menu', bin: 'switch' },
        { value: 'Conceito pela nota', bin: 'if' },
        { value: 'Cor do semáforo', bin: 'switch' },
        { value: 'Idade e ingresso', bin: 'if' },
        { value: 'Dia pelo número', bin: 'switch' },
        { value: 'Frete acima de 200', bin: 'if' },
        { value: 'Operador + - * /', bin: 'switch' },
        { value: 'Temperatura abaixo de 0', bin: 'if' },
      ],
      notes: [
        'Pergunta-chave: é "igual a qual destes valores?" (switch) ou "maior, menor, e, ou?" (if)',
        'Conceito pela nota é faixa: if (ou o switch (true), que é um if disfarçado)',
        'Idade e ingresso são dois valores: if com &&',
      ],
    },

    // 15 · A
    {
      id: 'exercicio-valor',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Escolha o dia',
      lead: 'Troque o valor e veja onde o item cai, e até onde a execução escorrega.',
      variable: 'dia',
      code: code.fallThrough,
      sorter: FALL,
      choices: [
        { value: '1', output: 'Dom\nSeg\nTer' },
        { value: '2', output: 'Seg\nTer' },
        { value: '3', output: 'Ter' },
        { value: '9', output: 'Inválido' },
      ],
      goals: ['Ter', 'Seg\nTer', 'Inválido'],
      notes: [
        'Chamar alguém da turma para escolher o valor',
        'Antes de clicar, pedir para a pessoa dizer até onde a execução vai cair',
        'Desafio 2: Seg e Ter juntos só acontecem pela queda a partir do case 2',
      ],
    },

    // 16 · A
    {
      id: 'att-1990',
      kind: 'cards',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'O break que parou os EUA',
      lead: 'Em 15 de janeiro de 1990, a rede de longa distância da AT&T ficou fora do ar por cerca de 9 horas.',
      cards: [
        { title: 'A causa', value: '{k:break};', text: 'Um break no lugar errado, dentro de um switch em C, saía antes da hora.' },
        { title: 'O efeito', value: '{v:9 h}', text: 'Milhões de ligações não completadas nos Estados Unidos.' },
        { title: 'A lição', value: '{k:case} {k:break}', text: 'Cada break muda o caminho: teste cada case.' },
      ],
      notes: [
        'O código novo tinha sido instalado nas centrais semanas antes',
        'Uma central reiniciava, avisava as vizinhas, e o erro fazia as vizinhas reiniciarem também, em cadeia',
        'Não era falta de break, e sim um break que pulava um trecho importante',
        'Moral: switch parece simples, mas o caminho da execução precisa ser testado',
      ],
    },

    // 17 · E
    {
      id: 'calculadora',
      kind: 'scene',
      depth: 'core',
      title: 'Desafio: calculadora',
      code: code.calculator,
      steps: [
        {
          value: '2',
          caption: 'O operador escolhe a conta; o if da aula 5 protege a divisão.',
          activeLine: 6,
          skip: [4],
          output: '5',
        },
        {
          value: '0',
          caption: 'Com b = 0, o if não deixa dividir: nada aparece.',
          activeLine: 7,
          skip: [4],
          output: '',
        },
      ],
      notes: [
        'Pedir para a turma acrescentar os case de "-" e "*"',
        'Junta as aulas: operadores (aula 2), != (aula 3), if (aula 5) e o switch de hoje',
        'Desafio extra: mostrar "Não dá para dividir por zero" num else',
        'Java: 10 / 2 é divisão de inteiros (aula 2); com 10 / 4 daria 2',
      ],
    },

    // 18 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'switch', value: '{k:switch} ({n:dia})', text: 'Um valor escolhe o caminho.' },
        { title: 'case', value: '{k:case} {v:2}:', text: 'A etiqueta: roda quando o valor é igual.' },
        { title: 'break', value: '{k:break};', text: 'Para a execução. Sem ele, cai no de baixo.' },
        { title: 'default', value: '{k:default}:', text: 'Quando nenhum case serve.' },
      ],
      notes: [
        'Pedir para a turma escrever um switch para um menu de 3 opções',
        'Lembrar: switch para valores fixos, if para faixas e combinações',
        'Próxima aula: laços de repetição, fazer o programa repetir uma tarefa',
        'Abrir para perguntas',
      ],
    },
  ],
};
