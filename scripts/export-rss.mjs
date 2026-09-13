// RSS 订阅源：从语料生成 rss.xml，随站点发布。
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://yshuai.github.io/SageRelay'
const corpus = JSON.parse(readFileSync(join(root, 'web', 'public', 'corpus.json'), 'utf-8'))

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pathOf = (d) =>
  d.type === 'guide' ? `/guides/${d.slug}.html`
  : d.type === 'data' ? `/data/${d.slug}.html`
  : `/standards/${d.slug}.html`

const items = corpus.documents
  .map((d) => `
    <item>
      <title>${esc(d.title)}</title>
      <link>${SITE}${pathOf(d)}</link>
      <guid>${SITE}${pathOf(d)}</guid>
      <description>${esc(d.description)}</description>
      <category>${esc(d.type)}</category>
      <category>${esc(d.source_tier)}</category>
      <pubDate>${new Date(`${d.published || '2026-01-01'}Z`).toUTCString()}</pubDate>
    </item>`)
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>建议驿站 SageRelay</title>
    <link>${SITE}/</link>
    <description>官方指南科普汇编：每条建议整理自权威原文、逐条可溯源。</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>`

writeFileSync(join(root, 'web', 'public', 'rss.xml'), rss)
console.log(`rss.xml exported: ${corpus.documents.length} items`)
