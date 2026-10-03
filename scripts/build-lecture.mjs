// Usage: node scripts/build-lecture.mjs [path/to/marked.esm.js]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { Marked } = await import(process.argv[2] ? pathToFileURL(path.resolve(process.argv[2])).href : 'marked');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'lectures/manifest.json'), 'utf8'));
const hasFile = async file => { try { await fs.access(path.join(root, file)); return true; } catch { return false; } };
const hasPdf = await hasFile('유민준_최종보고서.pdf');
const statusFile = await hasFile('STATUS.md') ? 'STATUS.md' : 'VERIFICATION.md';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = value => value.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const docs = [];
for (const chapter of manifest.chapters) {
  for (const [key, title, file] of chapter.units) docs.push({ id: `${chapter.id}-${key}`, title, file, chapter: chapter.id });
}
for (const [id, title, file] of manifest.appendices) docs.push({ id, title, file, chapter: 'references' });
const byPath = new Map(docs.map(doc => [path.resolve(root, doc.file), doc]));

for (const doc of docs) {
  doc.markdown = await fs.readFile(path.join(root, doc.file), 'utf8');
  doc.anchors = new Map();
  doc.headings = [];
  const counts = new Map();
  const parser = new Marked({ gfm: true });
  parser.use({ renderer: {
    heading(token) {
      const base = slug(token.text);
      const count = counts.get(base) || 0;
      counts.set(base, count + 1);
      const original = base + (count ? `-${count}` : '');
      const id = token.depth === 1 ? doc.id : `${doc.id}-${original}`;
      doc.anchors.set(original, id);
      if (token.depth === 1) return '';
      if (token.depth === 2) doc.headings.push({ id, title: token.text });
      return `<h${token.depth + 1} id="${esc(id)}">${this.parser.parseInline(token.tokens)}</h${token.depth + 1}>\n`;
    },
    blockquote(token) {
      const isPdf = token.text.includes('PDF 연결');
      const body = this.parser.parse(token.tokens).replace(/<p>\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/g, '<p>');
      return `<blockquote${isPdf ? ' class="pdf-callout"' : ''}>${body}</blockquote>\n`;
    },
    html(token) { return esc(token.text); },
  } });
  doc.html = parser.parse(doc.markdown);
}

// Resolve links after all documents' heading anchors are known.
for (const doc of docs) {
  doc.html = doc.html.replace(/href="([^"]*)"/g, (whole, rawHref) => {
    const href = rawHref.replaceAll('&amp;', '&');
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return whole;
    const hashAt = href.indexOf('#');
    const filePart = hashAt < 0 ? href : href.slice(0, hashAt);
    const fragment = hashAt < 0 ? '' : decodeURIComponent(href.slice(hashAt + 1));
    const target = filePart ? path.resolve(root, path.dirname(doc.file), decodeURIComponent(filePart)) : path.resolve(root, doc.file);
    const embedded = byPath.get(target);
    if (embedded) {
      const anchor = fragment ? embedded.anchors.get(fragment) : embedded.id;
      if (!anchor) throw new Error(`Unknown heading: ${doc.file} -> ${href}`);
      return `href="#${esc(anchor)}"`;
    }
    const relative = path.relative(root, target).split(path.sep).join('/');
    return `href="${esc(encodeURI(relative) + (fragment ? '#' + encodeURI(fragment) : ''))}"`;
  });
  doc.html = doc.html.replaceAll('<table>', '<div class="table-scroll" tabindex="0" role="region" aria-label="가로로 스크롤할 수 있는 표"><table>').replaceAll('</table>', '</table></div>');
}

const toc = chapter => docs.filter(d => d.chapter === chapter).map(d => `<a data-unit-link="${d.id}" href="#${d.id}">${esc(d.title)}</a>`).join('');
const section = doc => `<details class="unit" id="${doc.id}" data-chapter="${doc.chapter}"${doc === docs[0] ? ' open' : ''}>
<summary><span>${esc(doc.title)}</span><small>${doc.chapter === 'references' ? '참고 자료' : '설명 · 대본 · 실습 · 풀이'}</small></summary>
<div class="unit-body"><div class="unit-tools"><a href="${encodeURI(doc.file)}">Markdown 원문</a><a href="#top">목차로</a></div>
<nav class="local-toc" aria-label="${esc(doc.title)} 절 목차">${doc.headings.map(h => `<a href="#${esc(h.id)}">${esc(h.title)}</a>`).join('')}</nav>
${doc.html}
</div></details>`;
const chapterHtml = manifest.chapters.map(ch => `<section class="chapter" id="chapter-${ch.id}"><div class="chapter-heading"><span>${ch.id === 'ai' ? '01' : '02'}</span><div><h2>${esc(ch.title)}</h2><p>${esc(ch.description)}</p></div></div>${docs.filter(d => d.chapter === ch.id).map(section).join('')}</section>`).join('');
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(manifest.title)} · 전체 강의</title>
<style>
:root{font-family:system-ui,-apple-system,"Segoe UI","Malgun Gothic",sans-serif;color:#273349;background:#f5f6f8;font-size:16px;line-height:1.85;--accent:#2557a7;--border:#dce2ea}*{box-sizing:border-box}body{margin:0}a{color:var(--accent);text-underline-offset:3px}button,input{font:inherit}button{cursor:pointer}a:focus-visible,button:focus-visible,summary:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:3px solid #2a70c9;outline-offset:3px}[hidden]{display:none!important}.skip{position:absolute;top:-80px;left:12px;z-index:10;background:white;padding:10px}.skip:focus{top:10px}.layout{max-width:1550px;margin:auto;padding:28px;display:grid;grid-template-columns:290px minmax(0,1fr);gap:32px}aside{position:sticky;top:24px;max-height:calc(100vh - 48px);overflow:auto;align-self:start;padding-right:10px;font-size:14px}.brand{display:block;font-weight:800;font-size:20px;color:#233653;text-decoration:none}.subtle{color:#647085}.nav-label{margin:22px 0 6px;font-size:13px;font-weight:750}.toc a{display:block;text-decoration:none;padding:6px 9px;border-radius:5px;color:#354763;line-height:1.55}.toc a:hover,.toc a[aria-current]{background:#e6edf8;color:#184881}.search-label{display:block;font-size:13px;margin:18px 0 6px}#search{width:100%;padding:10px 12px;border:1px solid #bac7d8;border-radius:6px;background:white}.search-count{font-size:12px;color:#657287;min-height:24px}main{min-width:0}.hero,.intro-panel{background:white;border:1px solid var(--border);border-radius:10px;padding:32px 36px}.eyebrow{font-size:12px;letter-spacing:.12em;color:#4d6690;font-weight:750}h1{font-size:clamp(28px,3vw,42px);line-height:1.35;letter-spacing:-.04em;margin:12px 0 16px}.lead{font-size:19px;margin:0 0 18px;color:#4d5e76}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span{background:#edf2f9;border-radius:5px;font-size:13px;padding:3px 10px}.hero-links{display:flex;gap:16px;flex-wrap:wrap;margin:20px 0 0;font-size:14px}.intro-panel{margin-top:18px;padding:24px 30px}.intro-panel h2{font-size:19px;margin:0 0 8px}.intro-panel p{font-size:14px;margin:6px 0}.controls{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0}.controls button{padding:7px 14px;border:1px solid #cbd5e3;border-radius:5px;background:white;font-size:14px;color:#344866}.chapter{margin:32px 0}.chapter-heading{display:flex;gap:16px;align-items:center;margin:28px 0 18px}.chapter-heading>span{font-size:36px;font-weight:800;color:#bac6d8}.chapter-heading h2{font-size:24px;margin:0;letter-spacing:-.03em}.chapter-heading p{font-size:14px;color:#68778b;margin:2px 0}.unit{background:white;border:1px solid var(--border);border-radius:7px;margin:12px 0;overflow:clip}.unit>summary{cursor:pointer;padding:19px 24px;font-weight:750;font-size:18px;list-style-position:outside;margin-left:22px;line-height:1.6}.unit>summary small{display:block;font-weight:400;font-size:12px;color:#77859a;margin-top:4px}.unit[open]>summary{border-bottom:1px solid var(--border);color:#204d89}.unit-body{padding:10px 34px 34px;overflow-wrap:anywhere}.unit-tools{display:flex;gap:18px;font-size:12px;margin:10px 0}.local-toc{display:flex;flex-wrap:wrap;gap:5px 16px;background:#f6f8fb;padding:14px 18px;border-radius:4px;font-size:12px}.unit-body h3{font-size:23px;line-height:1.5;margin:40px 0 16px;border-top:1px solid #e7ebf1;padding-top:24px;letter-spacing:-.025em}.unit-body h4{font-size:19px;margin:28px 0 10px}.unit-body h5{font-size:17px}p{margin:12px 0}li{margin:6px 0}ul,ol{padding-left:24px}code{font:0.9em Consolas,monospace;background:#eef2f7;padding:2px 5px;border-radius:3px}pre{overflow:auto;padding:18px 20px;background:#f3f5f8;border:1px solid #dfe5ed;border-radius:5px;font-size:14px;line-height:1.7}pre code{padding:0;background:none;white-space:pre;overflow-wrap:normal}blockquote{padding:4px 20px;margin:22px 0;border-left:4px solid #8ba7d0;background:#f5f8fd;color:#3b506f}.pdf-callout{background:#fff8e7;border-left-color:#d09932;color:#665022}.pdf-callout>p:first-child{font-size:15px}.table-scroll{overflow:auto;max-width:100%;margin:18px 0}table{border-collapse:collapse;min-width:100%;font-size:14px}td,th{padding:10px 12px;border:1px solid #dfe5ed;text-align:left;vertical-align:top;min-width:120px}th{background:#f3f6fa}img{max-width:100%}[id]{scroll-margin-top:22px}#no-results{padding:30px;background:white;border:1px solid var(--border)}footer{font-size:13px;color:#68778b;border-top:1px solid var(--border);padding:20px 0;margin-top:30px}
@media(max-width:950px){.layout{display:block;padding:16px}aside{position:static;max-height:none;padding:0;margin-bottom:20px}.toc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.nav-label{grid-column:1/-1}.hero{padding:26px}.unit-body{padding:8px 24px 26px}}
@media(max-width:560px){.layout{padding:10px}.toc{grid-template-columns:1fr}.hero,.intro-panel{padding:22px 18px}.unit-body{padding:8px 16px 24px}.unit>summary{padding:16px 12px;font-size:17px}.chapter-heading h2{font-size:21px}.unit-body h3{font-size:21px}.lead{font-size:17px}}
@media print{body{background:white}.layout{display:block;padding:0}aside,.skip,.controls,.local-toc,.unit-tools,.hero-links{display:none}.unit,.hero,.intro-panel{border:0}.unit-body{padding:0}.unit>summary{margin:0;padding:20px 0}.table-scroll{overflow:visible}pre,pre code{white-space:pre-wrap}a{color:inherit}.chapter{break-before:page}}
</style></head><body>
<a class="skip" href="#main">본문으로 이동</a><div class="layout">
<aside><a class="brand" href="#top">AI로 일하고,<br>Git으로 남기기</a><div class="subtle">공대생을 위한 전체 강의</div>
<label class="search-label" for="search">단원 제목·본문 검색</label><input id="search" type="search" placeholder="예: 프롬프트, stage, PDF"><div id="search-count" class="search-count" aria-live="polite">21개 단원 · 참고 자료 7개</div>
<nav class="toc" aria-label="전체 강의 목차"><div class="nav-label">CHAPTER 01 · AI 활용법</div>${toc('ai')}<div class="nav-label">CHAPTER 02 · Git과 경험 기록</div>${toc('git')}<div class="nav-label">원본과 참고 자료</div>${toc('references')}</nav></aside>
<main id="main"><header class="hero" id="top"><div class="eyebrow">ENGINEERING · AI · GIT · RECORDS</div><h1>${esc(manifest.title)}</h1><p class="lead">과제를 구체화하고, AI와 구현하고, 증거로 검증하고,<br>설명할 수 있는 경험으로 남기는 수업.</p><div class="chips"><span>2개 챕터 · 21개 단원</span><span>강사 대본 · 시연 · 실습 · 풀이</span><span>Codex + Claude Code</span></div><div class="hero-links"><a href="#report-map">PDF 배치 지도</a>${hasPdf ? `<a href="${encodeURI('유민준_최종보고서.pdf')}">원본 보고서</a>` : '<span>원본 PDF 별도 보관 · 쪽수로 연결</span>'}<a href="README.md">프로젝트 안내</a><a href="${statusFile}">검증·진행 상태</a></div></header>
<section class="intro-panel"><h2>이 강의를 읽는 방법</h2><p>단원 제목을 누르면 상세 원고가 펼쳐집니다. <strong>개념 설명 → 강사 대본 → 예제·실습 → 풀이·평가</strong> 순서로 읽습니다. 목차 링크는 해당 단원을 자동으로 펼칩니다.</p><p><strong>노란색 PDF 연결 상자</strong>는 원본 페이지, 수업에 넣을 위치, 교정할 내용입니다. “새로 추가”는 이번에 보강한 실용 내용입니다. 대본·예상 출력은 교육 설계이며 실제 학생 수행 결과와 구분합니다.</p><p>자료 기준 ${esc(manifest.date)} · 단원 구성과 난이도는 검토용 상세 원고입니다. 본문은 오프라인으로 읽을 수 있습니다. ${hasPdf ? 'PDF·원문 링크는 함께 받은 폴더에서 열립니다.' : '공개본에는 원본 PDF·내부 작업 기록·프로젝트 지침을 포함하지 않습니다. PDF 연결 상자에는 쪽수와 활용 설명을 남겼습니다.'}</p></section>
<div class="controls"><button id="expand" type="button">모두 펼치기</button><button id="collapse" type="button">모두 접기</button><button id="clear" type="button">검색 초기화</button><button id="print" type="button">전체 인쇄</button></div><p id="no-results" hidden>일치하는 단원이 없습니다. 다른 단어로 검색하거나 검색을 초기화하세요.</p>
${chapterHtml}<section class="chapter" id="chapter-references"><div class="chapter-heading"><span>＋</span><div><h2>원본 연결과 참고 자료</h2><p>배치 지도, 교정 근거, 공통 실습, 공식 출처.</p></div></div>${docs.filter(d => d.chapter === 'references').map(section).join('')}</section>
<footer>Markdown 원문에서 생성한 통합 강의입니다. 수정 후 <code>npm run build</code>로 다시 만듭니다. <a href="#top">맨 위로</a> · <a href="https://github.com/joon56/My_LECTURE">GitHub 저장소</a></footer></main></div>
<script>
const units = [...document.querySelectorAll('.unit')];
const links = [...document.querySelectorAll('[data-unit-link]')];
const search = document.getElementById('search');
const searchText = new Map(units.map(unit => [unit.id, unit.textContent.toLocaleLowerCase()]));
function filterUnits() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const unit of units) {
    const matches = !query || searchText.get(unit.id).includes(query);
    unit.hidden = !matches;
    if (matches) count++;
    if (query && matches) unit.open = true;
  }
  for (const link of links) link.hidden = document.getElementById(link.dataset.unitLink).hidden;
  for (const chapter of document.querySelectorAll('.chapter')) chapter.hidden = ![...chapter.querySelectorAll('.unit')].some(unit => !unit.hidden);
  document.getElementById('no-results').hidden = count > 0;
  document.getElementById('search-count').textContent = query ? count + '개 문서 일치' : '21개 단원 · 참고 자료 7개';
}
function reveal(hash) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  if (target.closest('[hidden]')) { search.value = ''; filterUnits(); }
  for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
  const unit = target.closest('.unit');
  links.forEach(link => { if (unit && link.dataset.unitLink === unit.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
search.addEventListener('input', filterUnits);
document.getElementById('clear').addEventListener('click', () => { search.value = ''; filterUnits(); search.focus(); });
document.getElementById('expand').addEventListener('click', () => units.forEach(unit => { if (!unit.hidden) unit.open = true; }));
document.getElementById('collapse').addEventListener('click', () => units.forEach(unit => { unit.open = false; }));
let printState;
window.addEventListener('beforeprint', () => { printState = { query: search.value, open: units.map(unit => unit.open) }; search.value = ''; filterUnits(); units.forEach(unit => { unit.open = true; }); });
window.addEventListener('afterprint', () => { if (!printState) return; search.value = printState.query; filterUnits(); units.forEach((unit, i) => { unit.open = printState.open[i]; }); printState = null; });
document.getElementById('print').addEventListener('click', () => window.print());
window.addEventListener('hashchange', () => reveal(location.hash));
document.addEventListener('click', event => { const link = event.target.closest('a[href^="#"]'); if (link) reveal(link.hash); });
if (location.hash) reveal(location.hash);
</script></body></html>`;
await fs.writeFile(path.join(root, 'lecture.html'), html, 'utf8');
console.log(JSON.stringify({ output: 'lecture.html', units: docs.filter(d => d.chapter !== 'references').length, references: manifest.appendices.length, bytes: Buffer.byteLength(html) }));
