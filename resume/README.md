# Currículos em PDF

Três versões do currículo, otimizadas para ATS, com QR code para o portfólio (`https://lenoborges.com.br`):

| Arquivo | Idioma | Padrão | Papel |
|---|---|---|---|
| `pdf/Leno-Borges-Resume-EN.pdf` | Inglês (Canadá) | Canadense: sem foto e sem dados pessoais, competências logo após o resumo | Letter |
| `pdf/Leno-Borges-CV-FR.pdf` | Francês (Canadá) | Canadense, vocabulário OQLF (`courriel`, `infonuagique`) | Letter |
| `pdf/Leno-Borges-Curriculo-PT.pdf` | Português (Brasil) | Brasileiro: objetivo no topo, competências após a formação | A4 |

## Como atualizar

1. Atualize os fatos em `.specs/001 - Rebuild/resume.md`, que é a fonte de verdade.
2. Reflita a mudança nos três idiomas em `content.mjs`.
3. Gere os PDFs na raiz do projeto: `node resume/build.mjs`. É preciso ter o Google Chrome instalado; se ele estiver em outro caminho, defina `CHROME_PATH`.
4. Confira o texto extraído, que é o que o ATS lê: `pdftotext resume/pdf/<arquivo>.pdf -`.

O QR code (`qr-portfolio.svg`) foi gerado uma vez com o pacote `qrcode` e só precisa ser refeito se a URL do portfólio mudar.

## Regras de ATS seguidas

- Uma coluna, texto real e selecionável, fonte padrão (Arial).
- Títulos de seção convencionais (Summary/Profil/Resumo, Experience, Education…).
- Contatos no corpo do documento, não em cabeçalho ou rodapé de página.
- Cargo, empresa, local e datas em linhas próprias, com datas no formato `Mês AAAA - Present`. O hífen é intencional: é o separador que os ATS leem melhor, e não é travessão.
- Marcadores simples, sem tabelas, ícones ou texto em imagem. O QR code é a única imagem, e o link dele também aparece em texto.
- Título do PDF preenchido (vem do `<title>` do HTML).
