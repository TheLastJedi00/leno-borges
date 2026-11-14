import type { ChestState, Deck, FlowState } from '../../kit.data';
import { chest } from '../chests';
import { code, only } from './code';

// Aula 5 da trilha Lógica de Programação. Conteúdo em PT; roteiro em
// .specs/009 - Condicionais/context.md
// Metáfora: a execução é um caminho que desce pelo fluxograma. A condição fica num losango; a
// resposta (true/false, das aulas 3 e 4) escolhe a seta, e o caminho percorrido acende.

/** Baú aberto com a etiqueta igual ao id. */
const int = (id: string, item: string, extra: Partial<ChestState> = {}) =>
  chest(id, 'int', { open: true, label: id, item, ...extra });

type Flow = Omit<FlowState, 'answers'>;
const ENTRY: Flow = { conditions: ['idade >= 18'], outcomes: ['"Entra"'] };
const ENTRY_ELSE: Flow = { conditions: ['idade >= 18'], outcomes: ['"Entra"', '"Não entra"'] };
const GRADES: Flow = {
  conditions: ['nota >= 9', 'nota >= 7', 'nota >= 5'],
  outcomes: ['"A"', '"B"', '"C"', '"Reprovado"'],
};
const GRADES_WRONG: Flow = {
  conditions: ['nota >= 5', 'nota >= 7', 'nota >= 9'],
  outcomes: ['"C"', '"B"', '"A"', '"Reprovado"'],
};
const EVEN = (op: string): Flow => ({
  conditions: [`numero % 2 ${op} 0`],
  outcomes: ['"Par"', '"Ímpar"'],
});

/** Fluxograma com as respostas dos losangos já perguntados. */
const at = (flow: Flow, ...answers: boolean[]): FlowState => ({ ...flow, answers });

/** Erro do `javac` (conferido no JDK 17) quando a condição não é boolean. */
const JAVA_NOT_BOOLEAN = 'error: incompatible types: int cannot be converted to boolean';

export const deck: Deck = {
  slides: [
    // 1 · E
    {
      id: 'capa',
      kind: 'cover',
      depth: 'core',
      eyebrow: 'Lógica de Programação',
      title: 'Condicionais',
      subtitle: 'Como o programa escolhe qual caminho seguir',
      notes: [
        'Retomar as aulas 3 e 4: comparações e lógicos respondem true ou false',
        'Pergunta de abertura: que decisões um app toma sozinho? (login, frete, nota)',
        'Hoje essas respostas decidem qual parte do código roda',
      ],
    },

    // 2 · E
    {
      id: 'caminhos',
      kind: 'cards',
      depth: 'core',
      title: 'O programa escolhe um caminho',
      lead: 'Toda decisão começa com uma pergunta de true ou false.',
      cards: [
        { title: 'Está chovendo?', value: '{n:chovendo}', text: 'Então leve o guarda-chuva.' },
        { title: 'Tem 18 anos?', value: '{n:idade} >= {v:18}', text: 'Então pode entrar no show.' },
        { title: 'Compra acima de 200?', value: '{n:total} > {v:200}', text: 'Então o frete é grátis.' },
      ],
      notes: [
        'Cada pergunta é uma comparação (aula 3) ou uma junção delas (aula 4)',
        'A palavra "então" é o que o if acrescenta: se for verdade, faça isto',
        'Pedir para a turma dar mais exemplos do dia a dia',
      ],
    },

    // 3 · E
    {
      id: 'if',
      kind: 'scene',
      depth: 'core',
      title: 'if: só se for verdade',
      description:
        'Fluxograma com um losango, idade >= 18. Com 20, a seta true acende e Entra aparece. Com 15, a seta false leva direto ao fim e o bloco é pulado.',
      code: code.ifOnly,
      steps: [
        {
          value: '20',
          caption: 'O if faz uma pergunta. O bloco entre { } só roda se a resposta for true.',
          activeLine: 2,
          flow: at(ENTRY),
        },
        {
          caption: '20 >= 18 é true: o bloco roda.',
          activeLine: 3,
          flow: at(ENTRY, true),
          output: 'Entra',
        },
        {
          caption: 'Depois do bloco, o programa segue.',
          activeLine: 5,
          output: 'Entra\nFim',
        },
        {
          value: '15',
          caption: 'Com 15, a resposta é false: o bloco é pulado e o programa segue direto.',
          activeLine: 5,
          skip: [3],
          flow: at(ENTRY, false),
          output: 'Fim',
        },
      ],
      notes: [
        'Ler em voz alta: "se idade maior ou igual a 18, então..."',
        'Os parênteses guardam a pergunta; as chaves guardam o que roda',
        'A linha apagada é a que não rodou: o computador nem passa por ela',
        'O "Fim" aparece nos dois casos: está fora do bloco',
      ],
    },

    // 4 · E
    {
      id: 'else',
      kind: 'scene',
      depth: 'core',
      title: 'else: senão',
      description:
        'Fluxograma com idade >= 18: a seta true leva a Entra, a seta false leva a Não entra. Com 20 acende o caminho do Entra; com 15, o do Não entra.',
      code: code.ifElse,
      steps: [
        {
          value: '20',
          caption: 'else quer dizer "senão": é o caminho do false.',
          activeLine: 2,
          flow: at(ENTRY_ELSE),
        },
        {
          caption: 'true: roda o bloco do if e pula o do else.',
          activeLine: 3,
          skip: [5],
          flow: at(ENTRY_ELSE, true),
          output: 'Entra',
        },
        {
          value: '15',
          caption: 'false: pula o if e roda o else. Sempre um dos dois, nunca os dois.',
          activeLine: 5,
          skip: [3],
          flow: at(ENTRY_ELSE, false),
          output: 'Não entra',
        },
      ],
      notes: [
        'O else não tem pergunta: ele pega tudo o que não deu true',
        'Exatamente um dos blocos roda, nunca os dois e nunca nenhum',
        'Pergunta para a turma: e se idade for exatamente 18? (borda, aula 3)',
      ],
    },

    // 5 · E
    {
      id: 'condicao',
      kind: 'expr',
      depth: 'core',
      title: 'A condição pode ser qualquer pergunta',
      description:
        'A conta 20 >= 18 && false resolve a comparação, depois o &&, e dá false: o if segue pelo else.',
      steps: [
        {
          expr: '{v:20} >= {v:18} && {v:false}',
          caption: 'if (idade >= 18 && temIngresso), com idade 20 e sem ingresso.',
        },
        {
          expr: '[[{v:20} >= {v:18}]] && {v:false}',
          replace: true,
          caption: 'Primeiro a comparação…',
        },
        { expr: '[[{v:true} && {v:false}]]', caption: '…depois o &&.' },
        {
          expr: '{v:false}',
          result: true,
          caption: 'O if só recebe a resposta final: false, então roda o else.',
        },
      ],
      notes: [
        'Tudo o que vimos nas aulas 3 e 4 pode ir dentro dos parênteses do if',
        'O if não sabe se a pergunta foi simples ou composta: só olha o true ou false do fim',
        'Pergunta: o que muda se temIngresso for true?',
      ],
    },

    // 6 · A
    {
      id: 'exercicio-saldo',
      kind: 'predict',
      depth: 'extra',
      tag: 'Exercício',
      title: 'O que aparece?',
      question: 'O saldo é 50 e o preço é 80. O que o programa mostra?',
      code: code.predictBalance,
      options: ['50', '-30', '80', 'Nada aparece'],
      answer: 0,
      explanation: '50 >= 80 é false: o bloco é pulado e o saldo continua 50. A última linha está fora do if e roda sempre.',
      trace: [
        { activeLine: 1, chests: [int('saldo', '50', { focus: 'item' })] },
        { activeLine: 2, chests: [int('saldo', '50'), int('preco', '80', { focus: 'item' })] },
        { activeLine: 3, chests: [int('saldo', '50'), int('preco', '80')] },
        {
          activeLine: 6,
          skip: [4],
          chests: [int('saldo', '50', { focus: 'item' }), int('preco', '80')],
        },
      ],
      notes: [
        '30 segundos para cada pessoa decidir sozinha, depois votação',
        'Quem marcou -30 fez a conta sem olhar a pergunta do if',
        'Quem marcou "Nada aparece" achou que o console.log estava dentro do if: olhar as chaves',
      ],
    },

    // 7 · E
    {
      id: 'else-if',
      kind: 'scene',
      depth: 'core',
      title: 'else if: várias perguntas em fila',
      description:
        'Fluxograma com três losangos em fila: nota >= 9, nota >= 7 e nota >= 5, e o else no fim. Com nota 8, o primeiro dá false, o segundo dá true e aparece B; o terceiro nem é perguntado.',
      code: code.grades,
      steps: [
        {
          value: '8',
          caption: 'Conceito pela nota: as perguntas são feitas de cima para baixo.',
          activeLine: 2,
          flow: at(GRADES),
        },
        {
          caption: 'Nota 8. 8 >= 9? false: desce para o próximo else if.',
          activeLine: 4,
          skip: [3],
          flow: at(GRADES, false),
        },
        {
          caption: '8 >= 7? true: aparece B, e as perguntas de baixo nem são feitas.',
          activeLine: 5,
          skip: [3, 6, 7, 8, 9],
          flow: at(GRADES, false, true),
        },
      ],
      notes: [
        'else if é um else que tem outra pergunta dentro',
        'Para no primeiro true: só um bloco roda, mesmo que outras perguntas também fossem true',
        'O else do fim pega quem não passou em nenhuma pergunta',
        'Pergunta: e com nota 4?',
      ],
    },

    // 8 · E
    {
      id: 'ordem',
      kind: 'scene',
      depth: 'core',
      title: 'A ordem importa',
      description:
        'As mesmas perguntas na ordem nota >= 5, nota >= 7, nota >= 9. Com nota 9,5, a primeira já dá true e aparece C.',
      code: code.gradesWrongOrder,
      steps: [
        {
          value: '9.5',
          caption: 'As mesmas perguntas, começando pela mais fácil. Nota 9,5:',
          activeLine: 2,
          flow: at(GRADES_WRONG),
        },
        {
          caption: '9.5 >= 5 já é true: aparece C para a nota mais alta da turma.',
          activeLine: 3,
          skip: [4, 5, 6, 7, 8, 9],
          flow: at(GRADES_WRONG, true),
        },
        {
          caption: 'Regra: da condição mais exigente para a menos exigente.',
        },
      ],
      notes: [
        'Nenhum erro aparece: o programa roda, só que responde errado',
        'Como as perguntas param no primeiro true, a mais abrangente "engole" as outras',
        'Outra saída: perguntas que não se sobrepõem (nota >= 5 && nota < 7)',
      ],
    },

    // 9 · A
    {
      id: 'exercicio-conceito',
      kind: 'sort',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Qual conceito?',
      lead: 'Com as perguntas na ordem certa (9, 7, 5), em qual escaninho cai cada nota?',
      bins: [
        { id: 'a', shape: 'text', label: 'A' },
        { id: 'b', shape: 'text', label: 'B' },
        { id: 'c', shape: 'text', label: 'C' },
        { id: 'reprovado', shape: 'text', label: 'Reprovado' },
      ],
      items: [
        { value: '9.5', bin: 'a' },
        { value: '7', bin: 'b' },
        { value: '6.9', bin: 'c' },
        { value: '5', bin: 'c' },
        { value: '4.9', bin: 'reprovado' },
        { value: '10', bin: 'a' },
        { value: '0', bin: 'reprovado' },
        { value: '8', bin: 'b' },
      ],
      notes: [
        'Para cada nota, fazer as perguntas em voz alta, de cima para baixo',
        'Bordas: 7 dá B (7 >= 7 é true) e 6.9 dá C',
        '4.9 não passa em nenhuma pergunta: vai para o else',
      ],
    },

    // 10 · A
    {
      id: 'exercicio-valor',
      kind: 'branch',
      depth: 'extra',
      tag: 'Exercício',
      title: 'Escolha a nota',
      lead: 'Troque a nota e veja o caminho acender.',
      variable: 'nota',
      code: code.grades,
      flow: GRADES,
      start: 1,
      choices: [
        { value: '9.5', answers: [true], output: 'A' },
        { value: '8', answers: [false, true], output: 'B' },
        { value: '6', answers: [false, false, true], output: 'C' },
        { value: '3', answers: [false, false, false], output: 'Reprovado' },
      ],
      goals: ['A', 'Reprovado', 'C'],
      notes: [
        'Chamar alguém da turma para escolher a nota',
        'Antes de clicar, pedir para a pessoa dizer quais perguntas o programa vai fazer',
        'Desafio 2: com 3, as três perguntas dão false e o else roda',
      ],
    },

    // 11 · E
    {
      id: 'blocos',
      kind: 'cards',
      depth: 'core',
      title: 'Bloco e indentação',
      lead: 'As chaves dizem ao computador o que roda junto.',
      cards: [
        { title: 'Chaves', value: '{ }', text: 'Abrem e fecham o bloco: tudo o que roda quando a resposta é true.' },
        { title: 'Indentação', value: '{k:if} (…) {\n  …\n}', text: 'Os espaços no começo da linha são para quem lê. O computador olha as chaves.' },
        { title: 'else', value: '} {k:else} {', text: 'Pertence ao if logo acima, colado no fecha-chaves.' },
      ],
      notes: [
        'Combinar com a turma: dois espaços (ou um Tab) por nível, sempre',
        'O editor indenta sozinho (Format Document): usar e confiar',
        'Curiosidade: em Python a indentação é obrigatória e faz o papel das chaves',
      ],
    },

    // 12 · A
    {
      id: 'sem-chaves',
      kind: 'scene',
      depth: 'extra',
      tag: 'Curiosidade',
      title: 'if sem chaves',
      code: code.noBraces,
      steps: [
        {
          caption: 'Sem chaves, só a primeira linha depois do if pertence a ele.',
          activeLine: 2,
        },
        {
          caption: 'saldo > 0 é false: pula o "Pode sacar"… mas o "Saque feito" roda sempre, mesmo indentado.',
          activeLine: 4,
          skip: [3],
          output: 'Saque feito',
        },
      ],
      notes: [
        'As três linguagens aceitam if sem chaves, e a indentação engana quem lê',
        'Caso real: em 2014, um erro chamado "goto fail" deixou o iPhone e o Mac aceitarem conexões seguras falsas',
        'O motivo foi uma linha repetida logo depois de um if sem chaves: a cópia rodava sempre',
        'Regra da turma: sempre com chaves, mesmo com uma linha só',
      ],
    },

    // 13 · A
    {
      id: 'atribuir-no-if',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: '= dentro do if',
      code: code.assignInIf,
      steps: [
        {
          caption: {
            js: 'Um = só guarda 5 em x. E 5 conta como verdadeiro: entra sempre.',
            ts: 'Um = só guarda 5 em x. E 5 conta como verdadeiro: entra sempre, sem aviso.',
            java: 'Um = só guarda 5 em x, e um int não é uma resposta de true ou false.',
          },
          activeLine: 2,
        },
        {
          caption: {
            js: 'Entrou, e x agora vale 5. Para comparar: x === 5.',
            ts: 'Entrou, e x agora vale 5. Para comparar: x === 5.',
            java: 'O Java recusa antes de rodar. Para comparar: x == 5.',
          },
          activeLine: { js: 5, ts: 5, java: 2 },
          output: { js: 'Entrou\n5', ts: 'Entrou\n5', java: JAVA_NOT_BOOLEAN },
          outputTone: { js: 'ok', ts: 'ok', java: 'error' },
        },
      ],
      notes: [
        'Retomar a aula 3: = guarda, == e === comparam',
        'JS e TS: qualquer número diferente de 0 conta como verdadeiro (aula 4)',
        'Java só aceita boolean no if, então esse erro não passa',
        'Com boolean o Java também cai: if (pago = true) guarda true e entra sempre',
      ],
    },

    // 14 · A (só JS/TS)
    {
      id: 'verdadeiro-por-conversao',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['js', 'ts'],
      title: 'Verdadeiro por conversão',
      code: only.truthy,
      steps: [
        {
          caption: 'Em JS e TS, a condição pode ser qualquer valor.',
          activeLine: 2,
          flow: { conditions: ['nome'], outcomes: ['"Olá, " + nome', '"Digite seu nome"'], answers: [] },
        },
        {
          caption: 'Texto vazio conta como falso: cai no else.',
          activeLine: 5,
          skip: [3],
          flow: {
            conditions: ['nome'],
            outcomes: ['"Olá, " + nome', '"Digite seu nome"'],
            answers: [false],
          },
          output: 'Digite seu nome',
        },
      ],
      notes: [
        'Contam como falso: false, 0, "", null, undefined e NaN (aula 4); todo o resto conta como verdadeiro',
        'if (nome) é um jeito curto de perguntar "tem alguma coisa escrita?"',
        'Cuidado com números: if (qtd) não entra com 0, mesmo que 0 seja uma quantidade válida',
      ],
    },

    // 15 · A (só Java)
    {
      id: 'java-so-boolean',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      syntaxes: ['java'],
      title: 'O if do Java só aceita boolean',
      code: only.javaBoolean,
      steps: [
        {
          caption: 'Em Java, a condição precisa ser true ou false. Um número não serve.',
          activeLine: 2,
          output: JAVA_NOT_BOOLEAN,
          outputTone: 'error',
        },
        {
          caption: 'Compare para ter um boolean: if (x != 0). Para texto: if (!nome.isEmpty()).',
        },
      ],
      notes: [
        'Em JS e TS, if (x) e if (nome) funcionam por conversão; em Java não compilam',
        'É mais trabalho, mas a pergunta fica escrita: x != 0 diz exatamente o que se quer',
        'O mesmo vale para &&, || e ! (aula 4): só com boolean',
      ],
    },

    // 16 · A
    {
      id: 'aninhado',
      kind: 'scene',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'if dentro de if',
      code: code.nested,
      steps: [
        {
          caption: 'idade 20: passa na primeira pergunta e entra no bloco…',
          activeLine: 3,
        },
        {
          caption: '…e lá dentro vem a segunda. Sem ingresso, cai no else de dentro.',
          activeLine: 7,
          skip: [5],
          output: 'Compre o ingresso',
        },
      ],
      notes: [
        'Se as duas perguntas levam à mesma mensagem, um && resolve: if (idade >= 18 && ingresso)',
        'O aninhado vale quando cada falta tem uma resposta diferente',
        'Cada nível de if ganha mais um nível de indentação',
        'Mais de dois níveis fica difícil de ler: hora de repensar as perguntas',
      ],
    },

    // 17 · A
    {
      id: 'ternario',
      kind: 'expr',
      depth: 'extra',
      tag: 'Aprofundamento',
      title: 'Operador ternário',
      description:
        'A conta 20 >= 18 ? "adulto" : "menor" resolve a comparação, dá true e escolhe "adulto".',
      steps: [
        {
          expr: '{v:20} >= {v:18} ? {v:"adulto"} : {v:"menor"}',
          caption: 'Um if / else que devolve um valor. Idade 20:',
        },
        {
          expr: '[[{v:20} >= {v:18}]] ? {v:"adulto"} : {v:"menor"}',
          replace: true,
          caption: 'A pergunta vem antes do ?…',
        },
        {
          expr: '[[{v:true} ? {v:"adulto"} : {v:"menor"}]]',
          caption: '…true escolhe o valor depois do ?, false o valor depois do :.',
        },
        {
          expr: '{v:"adulto"}',
          result: true,
          caption: 'O resultado cabe num baú: status = idade >= 18 ? "adulto" : "menor".',
        },
      ],
      notes: [
        'Igual nas três linguagens: condição ? valorSeTrue : valorSeFalse',
        'Bom para escolher entre dois valores; para rodar várias linhas, if / else',
        'Ternário dentro de ternário fica ilegível: evitar',
      ],
    },

    // 18 · E
    {
      id: 'par-ou-impar',
      kind: 'scene',
      depth: 'core',
      title: 'Desafio: par ou ímpar',
      description:
        'Fluxograma com a pergunta numero % 2 é igual a 0. Com 7, a resposta é false e aparece Ímpar; com 10, é true e aparece Par.',
      code: code.evenOdd,
      steps: [
        {
          value: '7',
          caption: 'Como saber se um número é par? O resto da divisão por 2 (aula 2).',
          activeLine: 2,
          flow: { js: at(EVEN('===')), ts: at(EVEN('===')), java: at(EVEN('==')) },
        },
        {
          caption: '7 % 2 dá 1, e 1 não é 0: false, Ímpar.',
          activeLine: 5,
          skip: [3],
          flow: { js: at(EVEN('==='), false), ts: at(EVEN('==='), false), java: at(EVEN('=='), false) },
          output: 'Ímpar',
        },
        {
          value: '10',
          caption: '10 % 2 dá 0: true, Par.',
          activeLine: 3,
          skip: [5],
          flow: { js: at(EVEN('==='), true), ts: at(EVEN('==='), true), java: at(EVEN('=='), true) },
          output: 'Par',
        },
      ],
      notes: [
        'Pedir para a turma escrever o if antes da etapa 2',
        'Junta as aulas: % (aula 2), === e == (aula 3) e o if de hoje',
        'Outro uso prometido na aula 2: dividir só quando o divisor não é zero, if (divisor !== 0)',
        'Java: == 0 no lugar de === 0',
      ],
    },

    // 19 · E
    {
      id: 'resumo',
      kind: 'cards',
      depth: 'core',
      title: 'Resumo',
      columns: 4,
      cards: [
        { title: 'if', value: '{k:if} (…)', text: 'Roda o bloco só se a resposta for true.' },
        { title: 'else', value: '{k:else}', text: 'O caminho do false. Sempre um dos dois.' },
        { title: 'else if', value: '{k:else} {k:if}', text: 'Perguntas em fila: para no primeiro true.' },
        { title: 'Ordem', value: '{v:9}, {v:7}, {v:5}', text: 'Da condição mais exigente para a menos.' },
      ],
      notes: [
        'Pedir para a turma montar um else if com faixas de idade (criança, adolescente, adulto)',
        'Lembrar: chaves sempre, e a linha apagada é a que não rodou',
        'Próxima aula: switch case, escolher entre muitos valores sem repetir else if',
        'Abrir para perguntas',
      ],
    },
  ],
};
