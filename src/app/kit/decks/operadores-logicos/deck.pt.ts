import type { ChestState, Deck } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 4 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/008 - Operadores Relacionais e Logicos/context.md
// Metáfora: cada resposta true/false é um interruptor; a lâmpada é o resultado. && liga em série,
// || em paralelo e ! passa por um inversor.

/** Baú aberto com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });
const bool = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'bool', { open: true, label: id, item, ...extra });

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

    // 7 · A
    {
      id: 'exercicio-lampada',
      kind: 'circuit',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Acenda a lâmpada',
      lead: 'Ligue e desligue os interruptores até cumprir o objetivo de cada desafio.',
      challenges: [
        { mode: 'and', labels: DRIVE, start: [true, false], goal: true },
        { mode: 'or', labels: SHIPPING, start: [false, false], goal: true },
        { mode: 'not', labels: ['logado'], start: [true], goal: true },
        { mode: 'or', labels: SHIPPING, start: [true, true], goal: false },
        { mode: 'and', labels: DRIVE, start: [true, true], goal: false },
      ],
      notes: [
        'Chamar alguém da turma para mexer nos interruptores',
        'Antes de clicar, pedir para a pessoa dizer qual interruptor vai mexer e por quê',
        'Desafio 4: apagar um || exige desligar os dois; desafio 5: apagar um && basta desligar um',
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

    // 11 · A
    {
      id: 'exercicio-qual-true',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual baú guarda true?',
      question: 'Com n valendo 7, qual baú guarda true?',
      code: code.predictTrue,
      options: ['a', 'b', 'c', 'Nenhum'],
      answer: 0,
      explanation: 'a: 7 > 5 e 7 < 10, as duas true. b: 7 < 5 e 7 > 8 são false. c: n é 7, e o ! inverte para false.',
      trace: [
        { activeLine: 1, chests: [int('n', '7', { focus: 'item' })] },
        { activeLine: 2, chests: [int('n', '7'), bool('a', 'true', { focus: 'item' })] },
        {
          activeLine: 3,
          chests: [int('n', '7'), bool('a', 'true'), bool('b', 'false', { focus: 'item' })],
        },
        {
          activeLine: 4,
          chests: [
            int('n', '7'),
            bool('a', 'true'),
            bool('b', 'false'),
            bool('c', 'false', { focus: 'item' }),
          ],
        },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou c esqueceu de aplicar o ! no fim',
        'Revelar linha a linha com a seta',
      ],
    },

    // 12 · A
    {
      id: 'curto-circuito',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Curto-circuito',
      code: code.shortCircuit,
      steps: [
        {
          caption: {
            js: '&& para no primeiro false: com x 0, 10 / x nem é calculado.',
            ts: '&& para no primeiro false: com x 0, 10 / x nem é calculado.',
            java: '&& para no primeiro false: com x 0, a divisão por zero nem acontece.',
          },
          lines: 2,
          activeLine: 2,
          output: 'false',
        },
        {
          caption: '|| para no primeiro true: o resto já não muda a resposta.',
          lines: 3,
          activeLine: 3,
          output: 'false\ntrue',
        },
      ],
      notes: [
        'A ordem importa: a pergunta que protege vem primeiro (x != 0)',
        'Java: sem essa proteção, 10 / 0 para o programa (aula 2)',
        'JS/TS: sem proteção, 10 / 0 vira Infinity e Infinity > 2 dá true, uma resposta errada',
        'Também economiza tempo: a segunda pergunta só roda quando precisa',
      ],
    },

    // 13 · A (só Java)
    {
      id: 'java-sem-curto',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: '& e | sem curto-circuito',
      code: only.javaNoShortCircuit,
      steps: [
        {
          caption: 'Com &&, a divisão nem acontece.',
          lines: 2,
          activeLine: 2,
          output: 'false',
        },
        {
          caption: 'Com um & só, o Java calcula os dois lados sempre, e divide por zero.',
          lines: 3,
          activeLine: 3,
          output: 'false\nException in thread "main" java.lang.ArithmeticException: / by zero',
          outputTone: 'error',
        },
      ],
      notes: [
        '& e | com boolean dão o mesmo resultado que && e ||, mas sem curto-circuito',
        'Quase sempre se usa && e ||',
        'Com números, & e | fazem contas com os bits (outra história)',
      ],
    },

    // 14 · A (só JS/TS)
    {
      id: 'valor-padrao',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['js', 'ts'],
      title: '|| devolve um valor',
      code: only.fallback,
      steps: [
        {
          caption: '|| devolve o primeiro valor que conta como verdadeiro. Texto vazio conta como falso.',
          lines: 2,
          activeLine: 2,
          output: 'Visitante',
        },
        {
          caption: 'Cuidado: 0 também conta como falso…',
          lines: 4,
          activeLine: 4,
          output: 'Visitante\n10',
        },
        {
          caption: '…?? só troca null e undefined: o 0 fica.',
          lines: 5,
          activeLine: 5,
          output: 'Visitante\n10\n0',
        },
      ],
      notes: [
        'Contam como falso: false, 0, "", null, undefined e NaN; todo o resto conta como verdadeiro',
        'nome || "Visitante" é um jeito curto de dar um valor padrão',
        'Para números e textos que podem ser 0 ou "", prefira ??',
        'Java não tem isso: && e || só aceitam boolean',
      ],
    },

    // 15 · A
    {
      id: 'de-morgan',
      kind: 'truth',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'De Morgan',
      lead: 'Negar um && vira um || com cada parte negada.',
      head: ['{n:a}', '{n:b}', '!({n:a} && {n:b})', '!{n:a} || !{n:b}'],
      rows: [
        [true, true, false, false],
        [true, false, true, true],
        [false, true, true, true],
        [false, false, true, true],
      ],
      results: [2, 3],
      footnote: 'As duas colunas são iguais em todas as linhas. Vale também: !(a || b) é !a && !b.',
      notes: [
        'Exemplo: "não pode dirigir" = !(maior && cnh) = !maior || !cnh',
        'Útil para simplificar condições com muitos !',
        'Leis de Augustus De Morgan, matemático do século 19',
      ],
    },

    // 16 · A
    {
      id: 'ou-exclusivo',
      kind: 'cards',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'OU exclusivo',
      lead: 'Às vezes "ou" quer dizer um ou outro, mas não os dois.',
      columns: 3,
      cards: [
        { title: 'OU comum', value: '{n:a} || {n:b}', text: 'true com um ou com os dois true.' },
        {
          title: 'OU exclusivo',
          value: { js: '{n:a} !== {n:b}', ts: '{n:a} !== {n:b}', java: '{n:a} ^ {n:b}' },
          text: 'true só quando um é true e o outro é false.',
        },
        { title: '^ não é potência', value: '{v:2} ^ {v:10}', text: 'Dá 8: é uma conta com os bits do número.', tone: 'bad' },
      ],
      notes: [
        'Exemplo: interruptor de escada, dois interruptores para a mesma lâmpada',
        'JS/TS: com boolean, a !== b funciona como OU exclusivo',
        'Java: a ^ b com boolean; a != b também funciona',
        'Retoma a aula 2: potência é ** (JS/TS) ou Math.pow (Java)',
      ],
    },

    // 17 · A
    {
      id: 'desafio-bissexto',
      kind: 'scene',
      depth: 'extra',
      tag: 'Desafio',
      title: 'Ano bissexto',
      code: code.leapYear,
      steps: [
        {
          caption: 'Três perguntas: o ano é divisível por 4, por 100 e por 400?',
          lines: 4,
          activeLine: null,
        },
        {
          caption: 'Bissexto: divisível por 4 e não por 100, ou divisível por 400.',
          lines: 5,
          activeLine: 5,
        },
        {
          caption: '2024 é bissexto. Troque o ano: 1900 dá false e 2000 dá true.',
          lines: 6,
          activeLine: 6,
          output: 'true',
        },
      ],
      notes: [
        'Pedir para a turma escrever a regra antes da etapa 2',
        '1900: divisível por 4 e por 100, e não por 400, então não é bissexto',
        '2000: divisível por 400, então é bissexto',
        'Junta as três aulas: % (aula 2), === e == (aula 3), && || ! (aula 4)',
        'TS: bissexto não precisa do tipo escrito, ele vem da conta (inferência)',
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
