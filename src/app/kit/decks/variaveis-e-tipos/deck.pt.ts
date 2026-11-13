import type { BySyntax, ChestShape, ChestState, Deck } from '../../kit.data';
import { code, only } from './code';

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

    // 3 · A
    {
      id: 'memoria',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'A memória é um depósito de baús',
      description: 'Uma fileira de baús vazios aparece, cada um com um número de endereço acima.',
      steps: [
        {
          caption: 'A memória do computador é um depósito enorme de baús.',
          chests: [
            { id: 'm1', shape: 'any' },
            { id: 'm2', shape: 'any' },
            { id: 'm3', shape: 'any' },
            { id: 'm4', shape: 'any' },
          ],
        },
        {
          caption: 'Cada baú tem um endereço: um número que diz onde ele fica.',
          chests: [
            { id: 'm1', shape: 'any', address: '0x01A0', focus: 'address' },
            { id: 'm2', shape: 'any', address: '0x01A4', focus: 'address' },
            { id: 'm3', shape: 'any', address: '0x01A8', focus: 'address' },
            { id: 'm4', shape: 'any', address: '0x01AC', focus: 'address' },
          ],
        },
      ],
      notes: [
        'Memória RAM: rápida e temporária, apaga quando o programa fecha',
        'Endereços costumam ser escritos em hexadecimal (0x...)',
        'Um computador comum tem bilhões de posições de memória',
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

    // 6 · A
    {
      id: 'apelido',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'A etiqueta é um apelido',
      description: 'Um baú com o endereço 0x7FFE4A recebe a etiqueta idade.',
      steps: [
        {
          caption: 'Para a máquina, o baú é só um endereço.',
          chests: [idade({ typeName: undefined, open: true, item: '25', address: '0x7FFE4A', focus: 'address' })],
        },
        {
          caption: 'O nome existe para nós. Na hora de rodar, o computador troca o nome pelo endereço.',
          chests: [
            idade({ typeName: undefined, open: true, item: '25', address: '0x7FFE4A', label: 'idade', focus: 'label' }),
          ],
        },
      ],
      notes: [
        'Ninguém quer decorar 0x7FFE4A: nomes são para pessoas',
        'O compilador ou interpretador faz a tradução nome → endereço',
        'Por isso o nome não muda o desempenho: pode usar nomes longos e claros',
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

    // 8 · A
    {
      id: 'ler',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Ler o valor',
      description: 'O programa chama o baú pela etiqueta idade e mostra o 25 na tela.',
      code: code.read,
      steps: [
        {
          caption: 'Para usar o valor, chamamos o baú pela etiqueta.',
          lines: 1,
          chests: [idade({ open: true, item: '25', label: 'idade' })],
        },
        { lines: 2, activeLine: 2, highlight: 'n' },
        {
          caption: 'O programa abre o baú e usa o item. O valor continua guardado.',
          highlight: null,
          output: '25',
          chests: [idade({ open: true, item: '25', label: 'idade', focus: 'item' })],
        },
      ],
      notes: [
        'console.log (JS/TS) e System.out.println (Java) mostram valores na tela',
        'Ler não esvazia o baú: dá para ler quantas vezes quiser',
        'Sem aspas: idade é o baú; "idade" seria o texto idade',
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

    // 10 · A
    {
      id: 'atualizar',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Usar o próprio valor para mudar',
      description: 'O baú pontos começa com 0, ganha 10, depois mais 10 e depois mais 1, terminando com 21.',
      code: code.update,
      steps: [
        {
          caption: 'Começamos com zero pontos.',
          lines: 1,
          activeLine: 1,
          chests: [chest('pontos', 'int', { open: true, item: '0', label: 'pontos' })],
        },
        {
          caption: 'Lê o valor atual, soma 10 e guarda de volta no mesmo baú.',
          lines: 2,
          activeLine: 2,
          chests: [chest('pontos', 'int', { open: true, item: '10', label: 'pontos', focus: 'item' })],
        },
        {
          caption: 'O atalho += faz a mesma coisa.',
          lines: 3,
          activeLine: 3,
          chests: [chest('pontos', 'int', { open: true, item: '20', label: 'pontos', focus: 'item' })],
        },
        {
          caption: '++ soma 1. Muito usado para contar.',
          lines: 4,
          activeLine: 4,
          chests: [chest('pontos', 'int', { open: true, item: '21', label: 'pontos', focus: 'item' })],
        },
      ],
      notes: [
        'Ler a linha 2 da direita para a esquerda: primeiro calcula, depois guarda',
        'Em matemática pontos = pontos + 10 seria absurdo; aqui é uma ordem',
        'Também existem -=, *=, /= e --',
      ],
    },

    // 11 · A
    {
      id: 'constante',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Baú trancado: constantes',
      description: 'O baú PI, com 3.14, recebe um cadeado. Tentar trocar o valor gera um erro.',
      code: code.constant,
      steps: [
        {
          caption: { js: 'const cria um baú trancado.', ts: 'const cria um baú trancado.', java: 'final tranca o baú.' },
          lines: 1,
          activeLine: 1,
          chests: [chest('pi', 'decimal', { open: true, item: '3.14', label: 'PI', locked: true })],
        },
        {
          caption: 'Tentar trocar o item gera erro.',
          lines: 2,
          activeLine: 2,
          chests: [chest('pi', 'decimal', { open: true, item: '3.14', label: 'PI', locked: true, error: true })],
          output: {
            js: 'TypeError: Assignment to constant variable.',
            ts: "error: Cannot assign to 'PI' because it is a constant.",
            java: 'error: cannot assign a value to final variable PI',
          },
          outputTone: 'error',
        },
      ],
      notes: [
        'Use constante para o que não deve mudar: taxas, limites, configurações',
        'JS/TS: prefira const e use let só quando o valor precisa mudar',
        'Convenção: constantes fixas em MAIÚSCULAS',
        'JS: o erro só aparece ao rodar; TS e Java avisam antes',
      ],
    },

    // 12 · A
    {
      id: 'vazio',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Baú sem nada dentro',
      description: 'Um baú com a etiqueta nome é criado sem item dentro.',
      code: code.empty,
      steps: [
        {
          caption: 'Dá para criar o baú sem guardar nada.',
          lines: 1,
          activeLine: 1,
          chests: [chest('nome', 'text', { open: true, label: 'nome' })],
        },
        {
          caption: {
            js: 'Em JavaScript, o baú vazio guarda undefined.',
            ts: 'TypeScript avisa antes de rodar: o baú ainda está vazio.',
            java: 'Java não deixa usar uma variável local sem valor.',
          },
          lines: 2,
          activeLine: 2,
          chests: {
            js: [chest('nome', 'text', { open: true, label: 'nome', item: 'undefined', typeName: 'undefined' })],
            ts: [chest('nome', 'text', { open: true, label: 'nome', error: true })],
            java: [chest('nome', 'text', { open: true, label: 'nome', error: true })],
          },
          output: {
            js: 'undefined',
            ts: "error: Variable 'nome' is used before being assigned.",
            java: 'error: variable nome might not have been initialized',
          },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
      ],
      notes: [
        'Declarar = criar o baú; inicializar = guardar o primeiro valor',
        'JS: undefined é "ainda não tem valor"; null é "vazio de propósito"',
        'Boa prática: já guardar um valor ao criar',
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

    // 15 · A
    {
      id: 'exercicio-tipos',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Cada item no seu baú',
      lead: 'Em qual formato de baú cabe cada valor?',
      bins: [
        { id: 'text', shape: 'text', label: { js: 'texto', ts: 'string', java: 'String' } },
        { id: 'int', shape: 'int', label: { js: 'inteiro', ts: 'number (inteiro)', java: 'int' } },
        { id: 'decimal', shape: 'decimal', label: { js: 'decimal', ts: 'number (decimal)', java: 'double' } },
        { id: 'bool', shape: 'bool', label: { js: 'verdadeiro/falso', ts: 'boolean', java: 'boolean' } },
      ],
      items: [
        { value: '"Ana"', bin: 'text' },
        { value: '42', bin: 'int' },
        { value: '3.14', bin: 'decimal' },
        { value: 'true', bin: 'bool' },
        { value: '"42"', bin: 'text' },
        { value: '-7', bin: 'int' },
        { value: '0.5', bin: 'decimal' },
        { value: 'false', bin: 'bool' },
      ],
      notes: [
        'Deixar a turma decidir cada item em voz alta antes de soltar',
        'Pegadinha: "42" com aspas é texto',
        'Negativo continua inteiro; 0.5 é decimal mesmo começando com zero',
        'JS/TS: inteiro e decimal são o mesmo tipo (number), mas a ideia de formato vale',
      ],
    },

    // 16 · A
    {
      id: 'tipo-errado',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Item errado no baú errado',
      description: 'Tentamos guardar o texto "vinte" no baú idade, que guarda números.',
      code: code.mismatch,
      steps: [
        {
          caption: 'O baú idade guarda um número.',
          lines: 1,
          activeLine: 1,
          chests: [idade({ open: true, item: '25', label: 'idade' })],
        },
        {
          caption: {
            js: 'JavaScript aceita: o baú se adapta e passa a guardar texto.',
            ts: 'TypeScript recusa antes de rodar: o formato não bate.',
            java: 'Java recusa na compilação: o formato não bate.',
          },
          lines: 2,
          activeLine: 2,
          chests: {
            js: [chest('idade', 'text', { open: true, item: '"vinte"', label: 'idade', focus: 'type' })],
            ts: [idade({ open: true, item: '25', label: 'idade', error: true })],
            java: [idade({ open: true, item: '25', label: 'idade', error: true })],
          },
          output: {
            ts: "error: Type 'string' is not assignable to type 'number'.",
            java: 'error: incompatible types: String cannot be converted to int',
          },
          outputTone: 'error',
        },
        {
          caption: {
            js: 'typeof mostra o tipo do valor guardado agora.',
            ts: 'O erro aparece no editor, antes de alguém usar o programa.',
            java: 'O erro aparece antes de o programa rodar.',
          },
          lines: 3,
          activeLine: { js: 3 },
          output: { js: 'string', ts: "error: Type 'string' is not assignable to type 'number'.", java: 'error: incompatible types: String cannot be converted to int' },
          outputTone: { js: 'ok', ts: 'error', java: 'error' },
        },
      ],
      notes: [
        'Tipagem dinâmica (JS) x estática (TS, Java)',
        'Dinâmica: mais liberdade, erros aparecem com o programa rodando',
        'Estática: o compilador pega o erro antes, ótimo em projetos grandes',
        'TypeScript existe justamente para trazer essa checagem ao JavaScript',
      ],
    },

    // 17 · A
    {
      id: 'aspas',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: '"5" não é 5',
      code: code.quotes,
      steps: [
        {
          caption: 'Com aspas, 5 é texto. Texto + número junta os dois.',
          lines: 1,
          activeLine: 1,
          output: '55',
        },
        {
          caption: 'Sem aspas, é conta de verdade.',
          lines: 2,
          activeLine: 2,
          output: '55\n10',
        },
      ],
      notes: [
        'O + tem dois papéis: somar números e juntar textos (concatenar)',
        'Bug clássico: valor digitado em formulário chega como texto',
        'Para converter: Number("5") em JS/TS, Integer.parseInt("5") em Java',
      ],
    },

    // 18 · A
    {
      id: 'ponto-flutuante',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: '0.1 + 0.2',
      code: code.float,
      steps: [
        { caption: 'Quanto dá essa conta?', output: null },
        {
          caption: 'Decimais são guardados em binário, e alguns não cabem de forma exata.',
          output: '0.30000000000000004',
        },
      ],
      notes: [
        'Pedir o palpite da turma antes de revelar',
        'Acontece em quase todas as linguagens (padrão IEEE 754)',
        '0,1 em binário é uma dízima, como 1/3 em decimal',
        'Dinheiro: guardar em centavos inteiros ou usar BigDecimal (Java)',
      ],
    },

    // 19 · A
    {
      id: 'tamanho',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'O baú tem tamanho',
      code: code.size,
      steps: [
        {
          caption: {
            js: 'Existe um maior número inteiro guardado com segurança.',
            ts: 'Existe um maior número inteiro guardado com segurança.',
            java: 'O int vai até 2.147.483.647.',
          },
          lines: 1,
          activeLine: 1,
          chests: { java: [chest('maximo', 'int', { open: true, label: 'maximo', item: '2147483647' })] },
          output: { js: '9007199254740991', ts: '9007199254740991' },
        },
        {
          caption: {
            js: 'Passando dele, as contas perdem precisão: + 1 não muda nada.',
            ts: 'Passando dele, as contas perdem precisão: + 1 não muda nada.',
            java: 'Somando 1, o baú transborda e volta para o menor número.',
          },
          lines: 3,
          activeLine: { js: 2, ts: 2, java: 3 },
          chests: {
            java: [chest('maximo', 'int', { open: true, label: 'maximo', item: '-2147483648', error: true })],
          },
          output: { js: '9007199254740991\n9007199254740992', ts: '9007199254740991\n9007199254740992', java: '-2147483648' },
        },
        {
          caption: {
            js: 'Para números gigantes existe o BigInt, com n no final.',
            ts: 'Para números gigantes existe o bigint, com n no final.',
            java: 'Para números maiores, existe o long (e o BigInteger).',
          },
          activeLine: { js: 3, ts: 3, java: null },
          output: {
            js: '9007199254740991\n9007199254740992\n9007199254740993n',
            ts: '9007199254740991\n9007199254740992\n9007199254740993n',
            java: '-2147483648',
          },
        },
      ],
      notes: [
        'Cada tipo reserva um tamanho fixo de memória (int: 32 bits)',
        'Overflow: o contador "dá a volta", como um odômetro antigo',
        'Caso real: em 2014, o vídeo Gangnam Style passou de 2.147.483.647 views e o YouTube trocou o contador para 64 bits',
        'TS: BigInt exige target ES2020 ou mais novo',
      ],
    },

    // 20 · A (só JS/TS)
    {
      id: 'typeof-null',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['js', 'ts'],
      title: 'typeof null',
      code: only.typeofNull,
      steps: [
        { caption: 'typeof diz o tipo de um valor.', lines: 2, output: 'number\nstring' },
        {
          caption: 'E null? Responde "object": um erro da primeira versão da linguagem.',
          lines: 3,
          activeLine: 3,
          output: 'number\nstring\nobject',
        },
      ],
      notes: [
        'Bug de 1995, mantido para não quebrar sites que já dependiam dele',
        'Uma proposta para corrigir foi recusada justamente por compatibilidade',
        'Para testar null, compare direto: valor === null',
      ],
    },

    // 21 · A (só Java)
    {
      id: 'char-string',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      syntaxes: ['java'],
      title: 'char e String',
      code: only.charString,
      steps: [
        {
          caption: 'Aspas simples guardam um caractere: char.',
          lines: 1,
          activeLine: 1,
          chests: [chest('letra', 'text', { open: true, label: 'letra', item: "'A'", typeName: 'char' })],
        },
        {
          caption: 'Aspas duplas guardam texto: String.',
          lines: 2,
          activeLine: 2,
          chests: [
            chest('letra', 'text', { open: true, label: 'letra', item: "'A'", typeName: 'char' }),
            chest('nome', 'text', { open: true, label: 'nome', item: '"Ana"' }),
          ],
        },
        {
          caption: 'Trocar as aspas troca o tipo, e o compilador recusa.',
          lines: 3,
          activeLine: 3,
          output: 'error: incompatible types: String cannot be converted to char',
          outputTone: 'error',
        },
      ],
      notes: [
        'char é tipo primitivo (minúsculo); String é classe (maiúscula)',
        'Em JS/TS aspas simples e duplas são equivalentes; em Java não',
        'Por baixo, um char é um número (código Unicode): \'A\' é 65',
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

    // 23 · A
    {
      id: 'convencoes',
      kind: 'cards',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Convenções pelo mundo',
      lead: 'Cada linguagem tem o seu jeito combinado de escrever nomes.',
      columns: 2,
      cards: [
        { title: 'camelCase', value: '{n:idadeDoAluno}', text: 'Variáveis em JS, TS e Java.' },
        { title: 'PascalCase', value: '{t:ContaBancaria}', text: 'Classes e tipos (aulas futuras).' },
        { title: 'UPPER_CASE', value: '{n:TAXA_MAXIMA}', text: 'Constantes fixas.' },
        { title: 'snake_case', value: '{n:idade_do_aluno}', text: 'Python, Ruby e bancos de dados.' },
      ],
      notes: [
        'Convenção não é regra do compilador: é acordo da equipe',
        'Código com estilo único parece escrito por uma pessoa só',
        'Linters e formatadores (ESLint, Prettier, Checkstyle) ajudam a manter o padrão',
      ],
    },

    // 24 · A
    {
      id: 'exercicio-valor-final',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual o valor final?',
      question: 'Depois das quatro linhas, quanto vale b?',
      code: code.predict,
      options: ['10', '15', '20', '5'],
      answer: 1,
      explanation: 'b copiou o 5 de a. Mudar a depois não muda b. No fim, b = 5 + 10 = 15.',
      trace: [
        {
          activeLine: 1,
          chests: [chest('a', 'int', { open: true, label: 'a', item: '5', focus: 'item' })],
        },
        {
          activeLine: 2,
          chests: [
            chest('a', 'int', { open: true, label: 'a', item: '5' }),
            chest('b', 'int', { open: true, label: 'b', item: '5', focus: 'item' }),
          ],
        },
        {
          activeLine: 3,
          chests: [
            chest('a', 'int', { open: true, label: 'a', item: '10', focus: 'item' }),
            chest('b', 'int', { open: true, label: 'b', item: '5' }),
          ],
        },
        {
          activeLine: 4,
          chests: [
            chest('a', 'int', { open: true, label: 'a', item: '10' }),
            chest('b', 'int', { open: true, label: 'b', item: '15', focus: 'item' }),
          ],
        },
      ],
      notes: [
        'Dar 30 segundos para cada pessoa decidir sozinha',
        'Votação com a mão antes de revelar',
        'Erro comum: achar que b acompanha a (b recebeu uma cópia do valor)',
        'Revelar linha a linha com a seta',
      ],
    },

    // 25 · A
    {
      id: 'desafio-troca',
      kind: 'scene',
      depth: 'extra',
      tag: 'Desafio',
      title: 'Troque os itens de dois baús',
      description: 'Para trocar maçã e uva entre os baús a e b, um terceiro baú aux guarda a maçã temporariamente.',
      code: code.swap,
      steps: [
        {
          caption: 'Como trocar o conteúdo de a e b?',
          lines: 2,
          activeLine: null,
          chests: [
            chest('a', 'text', { open: true, label: 'a', item: '"maçã"' }),
            chest('b', 'text', { open: true, label: 'b', item: '"uva"' }),
          ],
        },
        {
          caption: 'Se fizer a = b direto, a maçã se perde.',
          chests: [
            chest('a', 'text', { open: true, label: 'a', item: '"uva"', error: true }),
            chest('b', 'text', { open: true, label: 'b', item: '"uva"' }),
          ],
        },
        {
          caption: 'Solução: um baú auxiliar guarda a maçã antes.',
          lines: 3,
          activeLine: 3,
          chests: [
            chest('a', 'text', { open: true, label: 'a', item: '"maçã"' }),
            chest('b', 'text', { open: true, label: 'b', item: '"uva"' }),
            chest('aux', 'text', { open: true, label: 'aux', item: '"maçã"', focus: 'item' }),
          ],
        },
        {
          caption: 'Agora a pode receber a uva.',
          lines: 4,
          activeLine: 4,
          chests: [
            chest('a', 'text', { open: true, label: 'a', item: '"uva"', focus: 'item' }),
            chest('b', 'text', { open: true, label: 'b', item: '"uva"' }),
            chest('aux', 'text', { open: true, label: 'aux', item: '"maçã"' }),
          ],
        },
        {
          caption: 'E b recebe a maçã guardada em aux. Trocados!',
          lines: 5,
          activeLine: 5,
          chests: [
            chest('a', 'text', { open: true, label: 'a', item: '"uva"' }),
            chest('b', 'text', { open: true, label: 'b', item: '"maçã"', focus: 'item' }),
            chest('aux', 'text', { open: true, label: 'aux', item: '"maçã"' }),
          ],
        },
      ],
      notes: [
        'Pedir a solução para a turma antes de mostrar a etapa 3',
        'Analogia: trocar o líquido de dois copos exige um terceiro copo',
        'JS/TS tem atalho: [a, b] = [b, a] (desestruturação, aula futura)',
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
