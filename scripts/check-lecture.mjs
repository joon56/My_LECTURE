import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parser = new Marked();
const manifest = JSON.parse(await fs.readFile(path.join(root, 'lectures/manifest.json'), 'utf8'));
const units = manifest.chapters.flatMap(c => c.units.map(([id, title, file]) => ({ id: `${c.id}-${id}`, title, file })));
const practices = manifest.chapters.filter(c => c.practice).map(c => ({ id: c.practice[0], file: c.practice[2], chapter: c.id }));
const failures = [];
if (practices.length !== manifest.chapters.length) failures.push('Each chapter must have one practice document after its lectures');
for (const practice of practices) {
  if (manifest.appendices.some(entry => entry[2] === practice.file)) failures.push(`Practice duplicated in appendices: ${practice.file}`);
  if (practice.chapter === 'ai') {
    for (const file of ['BRIEF.md', 'TOOLS.md']) {
      try { await fs.access(path.join(root, path.dirname(practice.file), 'materials/blog', file)); }
      catch { failures.push(`Missing blog input material: ${file}`); }
    }
    const promptFile = 'lectures/01-ai-use/instructor-prompts.md';
    const promptText = await fs.readFile(path.join(root, promptFile), 'utf8');
    const prompts = parser.lexer(promptText).filter(token => token.type === 'code' && token.lang === 'text');
    if (prompts.length !== 1) failures.push('Chapter 1 needs one shared prompt');
    continue;
  }
  const sample = path.join(root, path.dirname(practice.file), 'materials/samples.csv');
  try {
    const lines = (await fs.readFile(sample, 'utf8')).replace(/^\uFEFF/, '').trim().split(/\r?\n/);
    const rows = lines.slice(1).map(line => line.split(',').map(Number));
    if (lines[0] !== 'time_ms,voltage_mv' || JSON.stringify(rows) !== JSON.stringify([[0, 1000], [1000, 2000], [2000, 3000]])) failures.push(`Starter CSV differs from the lesson's expected values: ${sample}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    failures.push(`Missing starter CSV: ${sample}`);
  }
}
const files = [];
async function collect(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'tmp', '.codex', '.agents'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full);
    else if (entry.name.endsWith('.md')) files.push(full);
  }
}
await collect(root);
let links = 0;
for (const file of files) {
  const content = await fs.readFile(file, 'utf8');
  if (content.includes('\uFFFD')) failures.push(`Invalid UTF-8: ${file}`);
  const found = [];
  parser.walkTokens(parser.lexer(content), token => { if (['link', 'image'].includes(token.type)) found.push(token.href); });
  for (const href of found) {
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) continue;
    const target = path.resolve(path.dirname(file), decodeURIComponent(href.split('#')[0]));
    try { await fs.access(target); links++; } catch { failures.push(`Missing link: ${path.relative(root, file)} -> ${href}`); }
  }
  let fence = null;
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (!match) continue;
    if (!fence) fence = match[1];
    else if (match[1][0] === fence[0] && match[1].length >= fence.length && !match[2].trim()) fence = null;
  }
  if (fence) failures.push(`Unclosed code fence: ${path.relative(root, file)}`);
}
for (const unit of units) {
  const content = await fs.readFile(path.join(root, unit.file), 'utf8');
  if (!content.includes('PDF 연결')) failures.push(`Missing PDF note: ${unit.file}`);
  if (!content.includes('장면 4')) failures.push(`Missing teaching scene: ${unit.file}`);
  const headings = parser.lexer(content).filter(token => token.type === 'heading').map(token => token.text);
  if (headings.some(title => /^(?:학생 (?:실습|활동)|실습.*(?:풀이|채점)|제출물|제출 기준|채점 기준)/.test(title))) failures.push(`Student practice section remains in lecture: ${unit.file}`);
}
const html = await fs.readFile(path.join(root, 'lecture.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const idSet = new Set(ids);
if (ids.length !== idSet.size) failures.push('Duplicate HTML IDs');
for (const unit of units) if (!idSet.has(unit.id)) failures.push(`Missing unit in HTML: ${unit.id}`);
const expectedOrder = manifest.chapters.flatMap(chapter => [...chapter.units.map(([id]) => `${chapter.id}-${id}`), ...(chapter.practice ? [chapter.practice[0]] : [])]);
const actualOrder = [...html.matchAll(/<details class="unit" id="([^"]+)"/g)].map(match => match[1]).filter(id => expectedOrder.includes(id));
if (JSON.stringify(expectedOrder) !== JSON.stringify(actualOrder)) failures.push('HTML lecture/practice sequence does not match the chapter flow');
for (const practice of practices) {
  if (!idSet.has(practice.id)) failures.push(`Practice missing from HTML: ${practice.file}`);
  const content = await fs.readFile(path.join(root, practice.file), 'utf8');
  if (!content.includes('준비') || !content.includes('예상') || !content.includes('풀이')) failures.push(`Practice needs preparation, expected results and answers: ${practice.file}`);
}
for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
  if (href.startsWith('#')) {
    if (!idSet.has(decodeURIComponent(href.slice(1)).replaceAll('&amp;', '&'))) failures.push(`Missing HTML anchor: ${href}`);
  } else {
    const target = path.resolve(root, decodeURIComponent(href.split('#')[0]).replaceAll('&amp;', '&'));
    try { await fs.access(target); } catch { failures.push(`Missing HTML file: ${href}`); }
  }
}
let pdfIncluded = true;
let pdfUnchanged = null;
try {
  const pdf = await fs.readFile(path.join(root, '유민준_최종보고서.pdf'));
  pdfUnchanged = crypto.createHash('sha256').update(pdf).digest('hex') === '1ed394ab591531f0488283a33f22f412d37fa86d47567b525c4976e87c76e088';
  if (!pdfUnchanged) failures.push('Original PDF changed');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  pdfIncluded = false;
}
console.log(JSON.stringify({ units: units.length, practices: practices.length, markdownDocuments: files.length, localMarkdownLinks: links, htmlIds: ids.length, pdfIncluded, pdfUnchanged, failures }, null, 2));
if (failures.length) process.exitCode = 1;
