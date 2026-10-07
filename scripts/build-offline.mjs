// 家庭健康速查 · 离线单文件版：从语料生成零依赖 HTML，微信可传、断网可读。
// 借鉴 how-to-live-better 的阅读器思路（见项目分析），产物输出 web/public/offline/index.html。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://yshuai.github.io/SageRelay'
const corpus = JSON.parse(readFileSync(join(root, 'web', 'public', 'corpus.json'), 'utf-8'))

const docs = corpus.documents.filter((d) => ['guide', 'social', 'family'].includes(d.type))
const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pathOf = (d) =>
  d.type === 'guide' ? `/guides/${d.slug}.html`
  : d.type === 'data' ? `/data/${d.slug}.html`
  : d.type === 'standard' ? `/standards/${d.slug}.html`
  : d.type === 'social' ? `/social/${d.slug}.html`
  : d.type === 'family' ? `/family/${d.slug}.html`
  : `/query/${d.slug}.html`

const slugSet = new Set(docs.map((d) => d.type + '/' + d.slug))

// 极简 markdown → html（覆盖本站语料用到的元素：标题/表格/列表/引用/提示块/链接/加粗）
function md2html(md) {
  const refs = {}
  md = md.replace(/^\[([^\]]+)\]:\s*(\S+).*$/gm, (m, k, u) => {
    refs[k] = u
    return ''
  })
  md = md.replace(/^# .+\n/, '') // 去掉首个 h1（标题已作节头）
  const out = []
  let inTable = false
  let inList = false
  let inTip = null
  const closeBlock = () => {
    if (inTable) { out.push('</tbody></table>'); inTable = false }
    if (inList) { out.push('</ul>'); inList = false }
  }
  const inline = (s) => {
    s = esc(s)
    s = s.replace(/\[([^\]]+)\]\[([^\]]+)\]/g, (m, t, r) =>
      refs[r] ? `<a href="${refs[r]}" target="_blank" rel="noopener">${t}</a>` : t)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => {
      let href = u
      if (u.startsWith('/')) {
        const m2 = u.match(/^\/(guides|data|standards|social|family|query)\/([^/.]+?)(\.html)?$/)
        if (m2 && slugSet.has(m2[1] + '/' + m2[2])) href = '#' + m2[1] + '-' + m2[2]
        else href = SITE + u + (u.endsWith('.html') ? '' : '.html')
      }
      return href.startsWith('#')
        ? `<a href="${href}">${t}</a>`
        : `<a href="${href}" target="_blank" rel="noopener">${t}</a>`
    })
    return s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  }
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '')
    if (/^:::(tip|warning|danger|info)/.test(line.trim())) {
      closeBlock()
      inTip = line.trim().match(/^:::(\w+)/)[1]
      out.push(`<div class="co co-${inTip}"><b>${inTip === 'danger' ? '⚠️ 重要须知' : inTip === 'warning' ? '⚠️ 注意' : '💡 提示'}</b>`)
      continue
    }
    if (line.trim() === ':::') {
      if (inTip) { out.push('</div>'); inTip = null; continue }
      closeBlock()
      continue
    }
    if (/^\|/.test(line.trim())) {
      const cells = line.trim().split('|').slice(1, -1).map((c) => c.trim())
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue
      if (!inTable) { out.push('<table><tbody>'); inTable = true }
      out.push('<tr>' + cells.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>')
      continue
    }
    closeBlock()
    if (/^[-*] /.test(line.trim())) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.trim().replace(/^[-*] /, ''))}</li>`)
      continue
    }
    if (inList) { out.push('</ul>'); inList = false }
    const h = line.trim().match(/^(#{1,4}) (.+)/)
    if (h) {
      const lvl = Math.min(h[1].length + 1, 5)
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`)
      continue
    }
    if (/^> /.test(line.trim())) {
      out.push(`<blockquote>${inline(line.trim().replace(/^> /, ''))}</blockquote>`)
      continue
    }
    if (line.trim() === '') continue
    out.push(`<p>${inline(line.trim())}</p>`)
  }
  closeBlock()
  return out.join('\n')
}

const sections = docs
  .map((d) => {
    const id = d.type + '-' + d.slug
    const body = md2html(d.body)
    return `<section id="${id}" data-title="${esc(d.title)}">
<h2><a href="#${id}">${esc(d.title)}</a></h2>
<p class="meta">${esc(d.issuer)} · ${esc(d.source_tier)} · ${esc(d.version)} · <a href="${SITE}${pathOf(d)}" target="_blank" rel="noopener">在线版</a></p>
${body}
</section>`
  })
  .join('\n')

const toc = docs
  .map((d) => `<li><a href="#${d.type}-${d.slug}">${esc(d.title)}</a></li>`)
  .join('\n')

const generated = new Date().toISOString().slice(0, 10)

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>家庭健康速查 · 离线版 | 建议驿站</title>
<style>
:root{--bg:#fff;--fg:#213547;--muted:#6a737d;--brand:#3eaf7c;--bd:#e2e8f0;--soft:#f6f8fa}
@media (prefers-color-scheme:dark){:root{--bg:#1a1a1f;--fg:#d8dde4;--muted:#8b949e;--bd:#33363d;--soft:#22252b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.75 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif;max-width:860px;margin:0 auto;padding:16px}
header{border-bottom:2px solid var(--bd);padding-bottom:12px;margin-bottom:16px}
h1{font-size:1.5rem;margin:0 0 6px}.sub{color:var(--muted);font-size:.9rem}
#q{width:100%;padding:10px 12px;font-size:1rem;border:1px solid var(--bd);border-radius:8px;background:var(--soft);color:var(--fg);margin:12px 0}
.toc{background:var(--soft);border-radius:8px;padding:10px 14px;margin-bottom:16px;column-count:2}
@media(max-width:640px){.toc{column-count:1}}
.toc a{color:var(--brand);text-decoration:none;font-size:.92rem}
section{border-top:1px solid var(--bd);padding-top:8px;margin-top:20px}
h2{font-size:1.25rem}h2 a{color:var(--fg);text-decoration:none}
h3{font-size:1.08rem;margin-top:1.4em}
.meta{color:var(--muted);font-size:.85rem;margin-top:-6px}
table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.95rem}
td{border:1px solid var(--bd);padding:7px 10px;vertical-align:top}
tr:nth-child(odd){background:var(--soft)}
blockquote{border-left:3px solid var(--brand);margin:8px 0;padding:2px 12px;color:var(--muted)}
.co{border:1px solid var(--bd);border-left:4px solid var(--brand);border-radius:6px;padding:10px 14px;margin:12px 0;font-size:.95rem}
.co-warning{border-left-color:#e8a23a}.co-danger{border-left-color:#e05555}
a{color:var(--brand)}li{margin:3px 0}
footer{margin-top:28px;border-top:1px solid var(--bd);padding-top:10px;color:var(--muted);font-size:.85rem}
@media print{#q,.toc,footer .noprint{display:none}body{max-width:none}section{page-break-before:always}section:first-of-type{page-break-before:auto}}
</style>
</head>
<body>
<header>
<h1>家庭健康速查 · 离线版</h1>
<div class="sub">建议驿站 · 生成于 ${generated} · 共 ${docs.length} 篇（食养指南 + 办事权益）· 本页零依赖，可保存/转发，断网可读</div>
</header>
<input id="q" type="search" placeholder="搜索：限盐、嘌呤、补贴……">
<ul class="toc">
${toc}
</ul>
<main id="content">
${sections}
</main>
<footer>
本页由建议驿站整理：所有内容均整理自官方文件原文，在线版可逐条溯源（每篇右上"在线版"链接）。
<span class="noprint">本站不构成诊疗建议，与医生方案冲突时以医嘱为准。在线版：<a href="${SITE}/" target="_blank" rel="noopener">${SITE}</a></span>
<br>待人工核验状态与最新更新，请以在线版为准。
</footer>
<script>
document.getElementById('q').addEventListener('input', function () {
  var q = this.value.trim().toLowerCase();
  var secs = document.querySelectorAll('main > section');
  secs.forEach(function (s) {
    s.style.display = !q || s.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none';
  });
  document.querySelectorAll('.toc a').forEach(function (a) {
    var sec = document.querySelector(a.getAttribute('href'));
    a.parentElement.style.display = sec && sec.style.display === 'none' ? 'none' : '';
  });
});
</script>
</body>
</html>`

mkdirSync(join(root, 'web', 'public', 'offline'), { recursive: true })
writeFileSync(join(root, 'web', 'public', 'offline', 'index.html'), html)
console.log(`offline/index.html generated: ${docs.length} sections, ${Math.round(html.length / 1024)} KB`)
