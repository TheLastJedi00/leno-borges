// Gera os currículos em PDF (EN, FR, PT) a partir de content.mjs.
// Uso (na raiz do projeto): node resume/build.mjs
// Requer Google Chrome; outro caminho via variável CHROME_PATH.
//
// Pensado para ATS: uma coluna, texto real e selecionável (sem texto em imagem), títulos de seção
// padrão, contatos no corpo (não em cabeçalho/rodapé), fontes padrão e marcadores simples.
// O QR code (portfólio) é a única imagem e não carrega informação que não esteja também em texto.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resumes } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'pdf');
const tmpDir = join(here, '.tmp');
const chrome =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const qrSvg = readFileSync(join(here, 'qr-portfolio.svg'), 'utf8').replace(
  '<svg ',
  '<svg role="img" aria-label="QR code" ',
);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Transforma os endereços conhecidos em links clicáveis, mantendo o texto visível igual. */
function linkify(line, c) {
  let html = esc(line);
  const links = [
    [c.email, `mailto:${c.email}`],
    [c.linkedin, `https://www.${c.linkedin}`],
    [c.github, `https://${c.github}`],
    [c.portfolio, `https://${c.portfolio}`],
  ];
  for (const [text, href] of links) html = html.replace(esc(text), `<a href="${href}">${esc(text)}</a>`);
  return html;
}

const bullets = (items = []) =>
  items.length ? `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '';

function render(r) {
  const s = r.sections;
  // Francês (OQLF): espaço inseparável antes dos dois-pontos.
  const colon = r.htmlLang === 'fr-CA' ? '&nbsp;:' : ':';
  const sec = {
    summary: `<section><h2>${esc(s.summary)}</h2><p>${esc(r.summary)}</p></section>`,
    skills: `<section><h2>${esc(s.skills)}</h2><ul class="skills">${r.skills
      .map(([k, v]) => `<li><strong>${esc(k)}${colon}</strong> ${esc(v)}</li>`)
      .join('')}</ul></section>`,
    experience: `<section><h2>${esc(s.experience)}</h2>${r.experience
      .map(
        (e) => `<article>
          <h3><strong>${esc(e.role)}</strong> | ${esc(e.company)}</h3>
          <p class="meta">${esc(e.location)} | ${esc(e.dates)}</p>
          ${bullets(e.bullets)}
        </article>`,
      )
      .join('')}</section>`,
    education: `<section><h2>${esc(s.education)}</h2>${r.education
      .map(
        (e) => `<article>
          <h3><strong>${esc(e.title)}</strong> | ${esc(e.institution)}</h3>
          <p class="meta">${esc(e.dates)}</p>
          ${bullets(e.bullets)}
        </article>`,
      )
      .join('')}</section>`,
    languages: `<section><h2>${esc(s.languages)}</h2><p>${esc(r.languages)}</p></section>`,
  };
  // Canadá: competências logo após o resumo. Brasil: objetivo no topo e competências após a experiência.
  const order = r.objective
    ? ['summary', 'experience', 'education', 'skills', 'languages']
    : ['summary', 'skills', 'experience', 'education', 'languages'];
  const objective = r.objective
    ? `<section><h2>${esc(r.objective[0])}</h2><p>${esc(r.objective[1])}</p></section>`
    : '';

  return `<!doctype html>
<html lang="${r.htmlLang}">
<head>
<meta charset="utf-8">
<title>${esc(r.docTitle)}</title>
<meta name="author" content="${esc(r.name)}">
<style>
  @page { size: ${r.page}; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 9.8pt; line-height: 1.38; color: #111; }
  a { color: inherit; text-decoration: none; }
  header { position: relative; padding-right: 27mm; min-height: 24mm; }
  h1 { margin: 0; font-size: 20pt; line-height: 1.1; letter-spacing: 0.2pt; }
  .headline { margin: 1.5mm 0 2mm; font-size: 10.6pt; font-weight: bold; color: #1f4fa8; }
  .contact { margin: 0; font-size: 9.2pt; color: #333; }
  .qr { position: absolute; top: 0; right: 0; width: 23mm; text-align: center; font-size: 7.5pt; color: #444; }
  .qr svg { display: block; width: 23mm; height: 23mm; }
  .qr span { display: block; margin-top: 1mm; }
  h2 { margin: 4.2mm 0 1.6mm; padding-bottom: 0.8mm; border-bottom: 0.6pt solid #1f4fa8; font-size: 10.8pt; text-transform: uppercase; letter-spacing: 0.5pt; color: #1f4fa8; break-after: avoid; }
  h3 { margin: 0; font-size: 10pt; font-weight: normal; }
  p { margin: 0; }
  .meta { color: #444; font-size: 9.2pt; }
  article { margin-bottom: 2.4mm; break-inside: avoid; }
  ul { margin: 0.8mm 0 0; padding-left: 4.5mm; }
  li { margin: 0 0 0.6mm; }
  ul.skills { list-style: none; padding-left: 0; margin-top: 0; }
</style>
</head>
<body>
<header>
  <h1>${esc(r.name)}</h1>
  <p class="headline">${esc(r.headline)}</p>
  ${r.contactLines.map((l) => `<p class="contact">${linkify(l, r.contact)}</p>`).join('\n  ')}
  <a class="qr" href="https://${r.contact.portfolio}">${qrSvg}<span>${esc(r.qrCaption)}</span></a>
</header>
<main>
${objective}
${order.map((k) => sec[k]).join('\n')}
</main>
</body>
</html>`;
}

mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });
try {
  for (const [lang, r] of Object.entries(resumes)) {
    const html = join(tmpDir, `${lang}.html`);
    writeFileSync(html, render(r));
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${join(outDir, r.file)}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' });
    console.log(`${lang}: resume/pdf/${r.file}`);
  }
} finally {
  if (!process.env.KEEP_HTML) rmSync(tmpDir, { recursive: true, force: true });
}
