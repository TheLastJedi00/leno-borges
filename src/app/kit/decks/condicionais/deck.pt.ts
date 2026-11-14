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
        { title: 'if', value: '{k:if} (…) { }', text: 'Roda o bloco só se a resposta for true.' },
        { title: 'else', value: '{k:else} { }', text: 'O caminho do false. Sempre um dos dois.' },
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
