import type { BySyntax, ChestShape, ChestState, Deck } from '../../kit.data';
import { code } from './code';

// Aula 1 da trilha Lógica de Programação. Conteúdo em PT; roteiro em .specs/006 - Kit de Ensino/context.md
// Metáfora: baú = variável, etiqueta = nome, item = valor, formato do baú = tipo.

/** Nome do tipo escrito no baú, por sintaxe (em JS é o que `typeof` responde). */
const TYPE: Record<Exclude<ChestShape, 'any'>, BySyntax> = {
  text: { js: 'string', ts: 'string', java: 'String' },
  int: { js: 'number', ts: 'number', java: 'int' },
  decimal: { js: 'number', ts: 'number', java: 'double' },
  bool: { js: 'boolean', ts: 'boolean', java: 'boolean' },
};

function chest(
  id: string,
  shape: Exclude<ChestShape, 'any'>,
  extra: Partial<ChestState> = {},
): ChestState {
  return { id, shape, typeName: TYPE[shape], ...extra };
}

const idade = (extra: Partial<ChestState> = {}) => chest('idade', 'int', extra);

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Variáveis e Tipos de Dados',
      subtitle: 'Como um programa guarda, nomeia e reconhece informações',
      notes: [
        'Se apresentar e combinar o ritmo da aula',
        'Pergunta de abertura: o que um app precisa lembrar sobre você?',
        'Avisar a metáfora do dia: baús, etiquetas e itens',
      ],
    },

    // 2 · E
    {
      id: 'por-que-guardar',
      kind: 'cards',
      depth: 'core',
      title: 'Por que guardar coisas?',
      lead: 'Enquanto roda, um programa precisa lembrar informações.',
      cards: [
        { title: 'Placar do jogo', value: '{v:1500}', text: 'Muda a cada ponto marcado.' },
        { title: 'Quem entrou', value: '{v:"Ana"}', text: 'Aparece no topo da tela.' },
        { title: 'Carrinho', value: '{v:49.90}', text: 'Soma o preço dos produtos.' },
      ],
      notes: [
        'Pedir exemplos da turma antes de mostrar os cards',
        'Cada informação precisa ficar em algum lugar para ser usada depois',
        'Gancho: esse lugar é a variável',
      ],
    },

    // 4 · E
    {
      id: 'guardar-valor',
      kind: 'scene',
      depth: 'core',
      title: 'Guardar um valor',
      description: 'Um baú abre, o número 25 cai dentro dele e a tampa fecha.',
      steps: [
        { caption: 'Imagine um baú vazio.', chests: [idade({ typeName: undefined })] },
        {
          caption: 'Abrimos o baú…',
          chests: [idade({ typeName: undefined, open: true })],
        },
        {
          caption: '…e guardamos um valor dentro.',
          chests: [idade({ typeName: undefined, open: true, item: '25' })],
        },
        {
          caption: 'O valor fica guardado até o programa precisar dele.',
          chests: [idade({ typeName: undefined, item: '25' })],
        },
      ],
      notes: [
        'O baú é um espaço na memória do computador',
        'O item é o valor: um número, um texto, verdadeiro ou falso',
        'Fechado, o valor continua lá dentro',
      ],
    },

    // 5 · E
    {
      id: 'etiqueta',
      kind: 'scene',
      depth: 'core',
      title: 'Dar um nome: a etiqueta',
      description: 'Uma etiqueta com o nome idade é colada no baú. Depois aparecem outros baús com etiquetas nome e ativo.',
      steps: [
        {
          caption: 'Com milhares de baús, como achar o nosso?',
          chests: [idade({ typeName: undefined, open: true, item: '25' })],
        },
        {
          caption: 'Colamos uma etiqueta: o nome da variável.',
          chests: [idade({ typeName: undefined, open: true, item: '25', label: 'idade', focus: 'label' })],
        },
        {
          caption: 'Cada baú com seu nome. É assim que o programa encontra cada valor.',
          chests: [
            idade({ typeName: undefined, open: true, item: '25', label: 'idade' }),
            chest('nome', 'text', { typeName: undefined, open: true, item: '"Ana"', label: 'nome' }),
            chest('ativo', 'bool', { typeName: undefined, open: true, item: 'true', label: 'ativo' }),
          ],
        },
      ],
      notes: [
        'Variável = baú com etiqueta',
        'O nome deve dizer o que tem dentro',
        'Dois baús não podem ter a mesma etiqueta no mesmo lugar do programa',
      ],
    },

    // 7 · E
    {
      id: 'bau-codigo',
      kind: 'scene',
      depth: 'core',
      title: 'Do baú para o código',
      description: 'O código da declaração aparece ao lado do baú e cada parte acende junto com a parte do baú que representa.',
      code: code.declare,
      steps: [
        {
          caption: 'Em código, a mesma ideia cabe em uma linha.',
          chests: [idade({ open: true, item: '25', label: 'idade' })],
          highlight: null,
        },
        { caption: 'O nome é a etiqueta.', highlight: 'n' },
        { caption: 'O valor é o item guardado.', highlight: 'v' },
        {
          caption: {
            js: 'Em JavaScript, o tipo vem do valor guardado: 25 é number.',
            ts: 'O tipo é o formato do baú: aqui só cabe número.',
            java: 'O tipo vem primeiro e define o formato do baú.',
          },
          highlight: { js: 'v', ts: 't', java: 't' },
          chests: [idade({ open: true, item: '25', label: 'idade', focus: 'type' })],
        },
        {
          caption: { js: 'let cria o baú.', ts: 'let cria o baú.', java: 'Em Java, o próprio tipo cria o baú.' },
          highlight: { js: 'k', ts: 'k', java: 't' },
          chests: [idade({ open: true, item: '25', label: 'idade', focus: 'chest' })],
        },
      ],
      notes: [
        'Ler a linha em voz alta: "cria o baú idade e guarda 25"',
        'O sinal = guarda, não compara (comparar vem em outra aula)',
        'O ponto e vírgula fecha a instrução',
      ],
    },

    // 9 · E
    {
      id: 'trocar',
      kind: 'scene',
      depth: 'core',
      title: 'Trocar o conteúdo',
      description: 'O item 25 sai do baú idade e o item 26 entra no lugar. A etiqueta continua a mesma.',
      code: code.reassign,
      steps: [
        {
          caption: 'O baú idade guarda 25.',
          lines: 1,
          activeLine: 1,
          chests: [idade({ open: true, item: '25', label: 'idade' })],
        },
        {
          caption: 'Um novo valor substitui o antigo. A etiqueta continua a mesma.',
          lines: 2,
          activeLine: 2,
          chests: [idade({ open: true, item: '26', label: 'idade', focus: 'item' })],
        },
        {
          caption: 'Por isso o nome é variável: o conteúdo pode variar.',
          activeLine: null,
          chests: [idade({ open: true, item: '26', label: 'idade' })],
        },
      ],
      notes: [
        'Na segunda linha não tem let nem tipo: o baú já existe',
        'O valor antigo some, não fica guardado em lugar nenhum',
        'Origem do nome: o conteúdo varia durante o programa',
      ],
    },

    // 13 · E
    {
      id: 'tipos',
      kind: 'scene',
      depth: 'core',
      title: 'Tipos: cada baú tem um formato',
      description: 'Aparecem quatro baús: texto com "Ana", número inteiro com 25, número decimal com 9.9 e verdadeiro ou falso com true.',
      steps: [
        {
          caption: 'Texto vai entre aspas.',
          chests: [chest('nome', 'text', { open: true, item: '"Ana"', label: 'nome', focus: 'type' })],
        },
        {
          caption: 'Número inteiro, sem aspas.',
          chests: [
            chest('nome', 'text', { open: true, item: '"Ana"', label: 'nome' }),
            idade({ open: true, item: '25', label: 'idade', focus: 'type' }),
          ],
        },
        {
          caption: 'Número decimal usa ponto, não vírgula.',
          chests: [
            chest('nome', 'text', { open: true, item: '"Ana"', label: 'nome' }),
            idade({ open: true, item: '25', label: 'idade' }),
            chest('preco', 'decimal', { open: true, item: '9.9', label: 'preco', focus: 'type' }),
          ],
        },
        {
          caption: 'Verdadeiro ou falso: só dois valores possíveis.',
          chests: [
            chest('nome', 'text', { open: true, item: '"Ana"', label: 'nome' }),
            idade({ open: true, item: '25', label: 'idade' }),
            chest('preco', 'decimal', { open: true, item: '9.9', label: 'preco' }),
            chest('ativo', 'bool', { open: true, item: 'true', label: 'ativo', focus: 'type' }),
          ],
        },
      ],
      notes: [
        'O tipo diz que tipo de item cabe no baú',
        'Texto também é chamado de string (cadeia de caracteres)',
        'Booleano vem de George Boole: só verdadeiro ou falso',
      ],
    },

    // 14 · E
    {
      id: 'tipos-linguagem',
      kind: 'table',
      depth: 'core',
      title: 'Tipos na linguagem escolhida',
      head: ['Formato', 'Tipo', 'Exemplo'],
      rows: {
        js: [
          ['Texto', '{t:string}', '{k:let} {n:nome} = {v:"Ana"};'],
          ['Número inteiro', '{t:number}', '{k:let} {n:idade} = {v:25};'],
          ['Número decimal', '{t:number}', '{k:let} {n:preco} = {v:9.9};'],
          ['Verdadeiro/falso', '{t:boolean}', '{k:let} {n:ativo} = {v:true};'],
        ],
        ts: [
          ['Texto', '{t:string}', '{k:let} {n:nome}: {t:string} = {v:"Ana"};'],
          ['Número inteiro', '{t:number}', '{k:let} {n:idade}: {t:number} = {v:25};'],
          ['Número decimal', '{t:number}', '{k:let} {n:preco}: {t:number} = {v:9.9};'],
          ['Verdadeiro/falso', '{t:boolean}', '{k:let} {n:ativo}: {t:boolean} = {v:true};'],
        ],
        java: [
          ['Texto', '{t:String}', '{t:String} {n:nome} = {v:"Ana"};'],
          ['Número inteiro', '{t:int}', '{t:int} {n:idade} = {v:25};'],
          ['Número decimal', '{t:double}', '{t:double} {n:preco} = {v:9.9};'],
          ['Verdadeiro/falso', '{t:boolean}', '{t:boolean} {n:ativo} = {v:true};'],
        ],
      },
      footnote: {
        js: 'Em JavaScript, inteiro e decimal são o mesmo tipo: number.',
        ts: 'TypeScript usa os tipos do JavaScript e fixa o formato do baú.',
        java: 'Java separa inteiro (int) de decimal (double). String começa com maiúscula.',
      },
      notes: [
        'Ler a tabela de cima para baixo, uma linha por tipo',
        'JS: o tipo existe, mas fica no valor, não no baú',
        'TS: dá para omitir o tipo; ele é inferido pelo valor (let idade = 25 já é number)',
        'Java: existem outros inteiros (long, short, byte), int é o mais usado',
      ],
    },

    // 22 · E
    {
      id: 'boas-etiquetas',
      kind: 'cards',
      depth: 'core',
      title: 'Boas etiquetas',
      lead: 'O nome conta o que tem dentro do baú.',
      columns: 3,
      cards: [
        { title: 'Descritivo', value: '{n:idadeDoAluno}', text: 'Dá para entender sem ler o resto.', tone: 'good' },
        { title: 'camelCase', value: '{n:precoTotal}', text: 'Junta as palavras, a partir da segunda com maiúscula.', tone: 'good' },
        { title: 'Pergunta sim/não', value: '{n:estaLogado}', text: 'Booleano lido como pergunta.', tone: 'good' },
        { title: 'Não diz nada', value: '{n:x}', text: 'Daqui a uma semana, ninguém lembra.', tone: 'bad' },
        { title: 'Espaço não pode', value: '{n:idade do aluno}', text: 'O nome é uma palavra só.', tone: 'bad' },
        {
          title: 'Começa com número',
          value: '{n:2nome}',
          text: { js: 'Também não vale palavra reservada, como let.', ts: 'Também não vale palavra reservada, como let.', java: 'Também não vale palavra reservada, como int.' },
          tone: 'bad',
        },
      ],
      notes: [
        'Nome bom economiza comentário',
        'Regras (o que não compila) x convenções (o que a equipe combina)',
        'Maiúsculas e minúsculas contam: idade e Idade são baús diferentes',
      ],
    },

    // 26 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'Baú', value: '{k:variável}', text: 'Um espaço na memória.' },
        { title: 'Etiqueta', value: '{n:idade}', text: 'O nome da variável.' },
        { title: 'Item', value: '{v:25}', text: 'O valor guardado.' },
        {
          title: 'Formato',
          value: { js: '{t:number}', ts: '{t:number}', java: '{t:int}' },
          text: { js: 'O tipo, que vem do valor.', ts: 'O tipo do baú.', java: 'O tipo do baú.' },
        },
      ],
      notes: [
        'Pedir para a turma explicar a metáfora com as próprias palavras',
        'Próxima aula: operadores (fazer contas com os itens)',
        'Abrir para perguntas',
      ],
    },
  ],
};
