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
