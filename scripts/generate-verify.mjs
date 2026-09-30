// 校验看板：从语料生成人工核验进度页 web/verify.md（构建期自动刷新）。
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const corpus = JSON.parse(readFileSync(join(root, 'web', 'public', 'corpus.json'), 'utf-8'))

const typeZh = { guide: '指南词条', data: '数据页', standard: '国标科普', query: '查询页', social: '社保词条', family: '家庭办事' }
const fileOf = (d) => `web/${d.type === 'guide' ? 'guides' : d.type === 'data' ? 'data' : d.type === 'standard' ? 'standards' : d.type === 'social' ? 'social' : d.type === 'family' ? 'family' : 'query'}/${d.slug}.md`
const pageOf = (d) =>
  d.type === 'guide' ? `/guides/${d.slug}.html` : d.type === 'data' ? `/data/${d.slug}.html` : d.type === 'standard' ? `/standards/${d.slug}.html` : d.type === 'social' ? `/social/${d.slug}.html` : d.type === 'family' ? `/family/${d.slug}.html` : `/query/${d.slug}.html`

const docs = [...corpus.documents].sort((a, b) => a.reviewed - b.reviewed)
const done = corpus.documents.filter((d) => d.reviewed).length

const rows = docs
  .map(
    (d) =>
      `| ${d.reviewed ? '✅' : '⏳'} | [${d.title}](${pageOf(d)}) | ${typeZh[d.type] ?? d.type} | ${d.source_tier} | [原文](${d.source_url}) | \`${fileOf(d)}\` |`,
  )
  .join('\n')

writeFileSync(
  join(root, 'web', 'verify.md'),
  `# 校验看板（构建时自动生成）

**核验进度：${done} / ${corpus.documents.length}**

核验流程：打开站点页 → 逐条点击"出处"对照"原文" → 编辑对应 Markdown 文件把 frontmatter 的 \`reviewed: false\` 改为 \`true\` → 运行 \`npm run deploy\` 上线。

> 核验标准（ADR 0010）：每条建议的数字与结论都能在原文对应位置找到；【本站提示】不超过中性工具范畴；发文字号等无法核验的字段不得出现。

| 状态 | 标题（站点页） | 类型 | 来源级别 | 原文 | 源文件 |
| --- | --- | --- | --- | --- | --- |
${rows}
`,
)
console.log(`verify.md generated: ${done}/${corpus.documents.length} reviewed`)
