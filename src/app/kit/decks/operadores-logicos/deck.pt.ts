import type { Deck } from '../../kit.data';
import { code } from './code';

// Aula 4 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md
// Metáfora: cada resposta true/false é um interruptor; a lâmpada é o resultado. && liga em série,
// || em paralelo e ! passa por um inversor.

const DRIVE = ['maior', 'cnh'];
const SHIPPING = ['vip', 'cupom'];

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Operadores Lógicos',
      subtitle: 'Como juntar e inverter perguntas de verdadeiro ou falso',
      notes: [
        'Retomar a aula 3: comparações respondem true ou false',
        'Pergunta de abertura: o que precisa ser verdade para alguém poder dirigir?',
        'Hoje as respostas viram interruptores, e a lâmpada é o resultado',
      ],
    },

    // 2 · E
    {
      id: 'juntar',
      kind: 'cards',
      depth: 'core',
      title: 'Juntar perguntas',
      lead: 'Muitas decisões dependem de mais de uma resposta.',
      cards: [
        { title: 'Pode dirigir?', value: '{n:maior} && {n:cnh}', text: 'Precisa ter 18 anos e habilitação.' },
        { title: 'Frete grátis?', value: '{n:vip} || {n:cupom}', text: 'Assinante ou cupom: qualquer um serve.' },
        { title: 'Mostrar "Entrar"?', value: '!{n:logado}', text: 'Só para quem ainda não entrou.' },
      ],
      notes: [
        'Pedir exemplos da turma com "e", "ou" e "não"',
        'Cada parte (maior, cnh, vip) já é um true ou false, como na aula 3',
        'Três operadores: && (E), || (OU) e ! (NÃO)',
      ],
    },

    // 3 · E
    {
      id: 'e',
      kind: 'scene',
      depth: 'core',
      title: 'E (&&): as duas precisam ser verdade',
      description:
        'Dois interruptores em série, maior e cnh, ligam uma lâmpada. Ela só acende com os dois ligados.',
      steps: [
        {
          caption: 'Interruptores em série: a corrente passa por um e depois pelo outro.',
          circuit: { mode: 'and', labels: DRIVE, switches: [true, true] },
        },
        {
          caption: 'Desligou um, a lâmpada apaga.',
          circuit: { mode: 'and', labels: DRIVE, switches: [true, false] },
        },
        {
          caption: 'Tanto faz qual: qualquer um desligado corta o caminho.',
          circuit: { mode: 'and', labels: DRIVE, switches: [false, true] },
        },
        {
          caption: '&& só dá true quando os dois são true.',
          circuit: { mode: 'and', labels: DRIVE, switches: [false, false] },
        },
      ],
      notes: [
        'Ler && como "e": maior e cnh',
        'Um único false derruba tudo',
        'Pergunta para a turma: e com três interruptores em série?',
      ],
    },

    // 4 · E
    {
      id: 'ou',
      kind: 'scene',
      depth: 'core',
      title: 'OU (||): basta uma',
      description:
        'Dois interruptores em paralelo, vip e cupom, ligam uma lâmpada. Ela acende com qualquer um ligado.',
      steps: [
        {
          caption: 'Interruptores em paralelo: cada um abre um caminho.',
          circuit: { mode: 'or', labels: SHIPPING, switches: [false, false] },
        },
        {
          caption: 'Um caminho ligado já acende a lâmpada.',
          circuit: { mode: 'or', labels: SHIPPING, switches: [true, false] },
        },
        {
          caption: 'Qualquer um serve.',
          circuit: { mode: 'or', labels: SHIPPING, switches: [false, true] },
        },
        {
          caption: 'Os dois ligados também: || só dá false quando os dois são false.',
          circuit: { mode: 'or', labels: SHIPPING, switches: [true, true] },
        },
      ],
      notes: [
        'Ler || como "ou": vip ou cupom',
        'No dia a dia, "ou" às vezes quer dizer "um ou outro, não os dois"; no código, os dois também valem',
        'Um único true já basta',
      ],
    },

    // 5 · E
    {
      id: 'nao',
      kind: 'scene',
      depth: 'core',
      title: 'NÃO (!): inverte',
      description: 'Um interruptor logado passa por um inversor: ligado, a lâmpada apaga; desligado, acende.',
      steps: [
        {
          caption: 'O ! inverte a resposta: quem está logado não vê o botão "Entrar".',
          circuit: { mode: 'not', labels: ['logado'], switches: [true] },
        },
        {
          caption: 'Desligou, a lâmpada acende: !false é true.',
          circuit: { mode: 'not', labels: ['logado'], switches: [false] },
        },
      ],
      notes: [
        'Ler ! como "não": não logado',
        'O ! vai colado antes do valor: !logado',
        'Já apareceu na aula 3: !== é "não igual"',
      ],
    },

    // 6 · E
    {
      id: 'tabela-verdade',
      kind: 'truth',
      depth: 'core',
      title: 'Tabela-verdade',
      lead: 'Todas as combinações de a e b, e o que cada operador responde.',
      head: ['{n:a}', '{n:b}', '{n:a} && {n:b}', '{n:a} || {n:b}'],
      rows: [
        [true, true, true, true],
        [true, false, false, true],
        [false, true, false, true],
        [false, false, false, false],
      ],
      results: [2, 3],
      notes: [
        '&&: só a primeira linha dá true',
        '||: só a última linha dá false',
        'Com 2 interruptores são 4 combinações; com 3, são 8',
      ],
    },

    // 8 · E
    {
      id: 'com-relacionais',
      kind: 'expr',
      depth: 'core',
      title: 'Com os relacionais',
      description: 'A conta 20 >= 18 && 20 < 65 faz as duas comparações e depois o &&: true.',
      steps: [
        { expr: '{v:20} >= {v:18} && {v:20} < {v:65}', caption: 'Idade 20: está entre 18 e 65?' },
        {
          expr: '[[{v:20} >= {v:18}]] && [[{v:20} < {v:65}]]',
          replace: true,
          caption: 'Primeiro as comparações…',
        },
        { expr: '[[{v:true} && {v:true}]]', caption: '…depois o &&.' },
        { expr: '{v:true}', result: true, caption: 'Comparações respondem; os lógicos juntam as respostas.' },
      ],
      notes: [
        'Ordem: contas, depois comparações, depois os lógicos',
        'No código, com o baú: idade >= 18 && idade < 65',
        'Parênteses opcionais ajudam a ler: (idade >= 18) && (idade < 65)',
      ],
    },

    // 9 · E
    {
      id: 'faixa',
      kind: 'scene',
      depth: 'core',
      title: 'Faixa de valores',
      code: code.range,
      steps: [
        {
          caption: 'Uma nota vale de 0 a 10: as duas pontas precisam ser verdade.',
          lines: 2,
          activeLine: 2,
          output: 'true',
        },
        {
          caption: '12 passa no >= 0, mas não no <= 10: false.',
          lines: 4,
          activeLine: 4,
          output: 'true\nfalse',
        },
      ],
      notes: [
        'É o jeito certo do 0 <= nota <= 10 da matemática (curiosidade da aula 3)',
        'Fora da faixa: nota < 0 || nota > 10',
        'Repetir o nome do baú dos dois lados: nota >= 0 && nota <= 10',
      ],
    },

    // 10 · E
    {
      id: 'precedencia',
      kind: 'expr',
      depth: 'core',
      title: 'Quem vem primeiro?',
      description:
        'A conta true || false && false resolve o && primeiro e dá true. Com parênteses no ||, dá false.',
      steps: [
        { expr: '{v:true} || {v:false} && {v:false}', caption: 'Quanto dá: true ou false?' },
        {
          expr: '{v:true} || [[{v:false} && {v:false}]]',
          replace: true,
          caption: '&& vem antes de ||, como * vem antes de +.',
        },
        { expr: '[[{v:true} || {v:false}]]', caption: 'Depois, o ||.' },
        { expr: '{v:true}', result: true, caption: 'Ordem: !, depois &&, depois ||.' },
        {
          expr: '[[({v:true} || {v:false})]] && {v:false}',
          reset: true,
          caption: 'Com parênteses, o || vai primeiro…',
        },
        { expr: '[[{v:true} && {v:false}]]' },
        { expr: '{v:false}', result: true, caption: '…e a resposta muda. Na dúvida, parênteses.' },
      ],
      notes: [
        'Mesma ideia da aula 2: && é como a multiplicação, || como a soma',
        'O ! vem antes de todos: !a && b é (!a) && b',
        'Código claro usa parênteses mesmo quando não precisa',
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
        { title: 'E', value: '{k:&&}', text: 'As duas precisam ser true.' },
        { title: 'OU', value: '{k:||}', text: 'Basta uma ser true.' },
        { title: 'NÃO', value: '{k:!}', text: 'Inverte: true vira false.' },
        { title: 'Ordem', value: '{k:! && ||}', text: 'Nessa ordem. Na dúvida, parênteses.' },
      ],
      notes: [
        'Pedir para a turma montar uma regra com && e || (ex.: meia-entrada)',
        'Lembrar da tabela-verdade: && só true com tudo true; || só false com tudo false',
        'Próxima aula: condicionais, usar essas respostas para decidir o que o programa faz (if/else)',
        'Abrir para perguntas',
      ],
    },
  ],
};
