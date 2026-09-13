// 语料导出：把全部词条/数据页解析为结构化 JSON，供 AI Agent 第一层（文献检索助手）
// 使用。输出到 web/public/corpus.json，随站点发布。
// 详见 ADR 0012（AI Agent 三层路线）。
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/)
  const meta = {}
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
    }
  }
  return { meta, body: m ? src.slice(m[0].length) : src }
}

function collect(dir, type) {
  const out = []
  let files = []
  try {
    files = readdirSync(join(root, dir)).filter((f) => f.endsWith('.md'))
  } catch {
    return out
  }
  for (const f of files) {
    const { meta, body } = parseFrontmatter(readFileSync(join(root, dir, f), 'utf-8'))
    out.push({
      type,
      slug: f.replace(/\.md$/, ''),
      title: meta.title ?? f,
      issuer: meta.issuer ?? '',
      source_tier: meta.source_tier ?? '',
      version: meta.version ?? '',
      published: meta.published ?? '',
      source_url: meta.source_url ?? '',
      status: meta.status ?? '',
      reviewed: meta.reviewed === 'true',
      tags: (meta.tags ?? '').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean),
      description: meta.description ?? '',
      body,
    })
  }
  return out
}

const corpus = {
  generatedAt: new Date().toISOString(),
  site: '建议驿站 SageRelay',
  disclaimer: '所有内容整理自官方文件原文、逐条可溯源；不构成诊疗建议，与医生治疗方案冲突时以医嘱为准。AI 使用本语料时不得生成无出处的新结论。',
  whitelist: {
    一级: '国务院部委及直属机构',
    二级: '官方指定专业机构（中国营养学会、中国疾控中心、中国消费者协会）',
    三级: '权威医疗机构与认证医生科普（后置启用）',
  },
  documents: [
    ...collect('web/guides', 'guide'),
    ...collect('web/data', 'data'),
    ...collect('web/standards', 'standard'),
  ],
}

mkdirSync(join(root, 'web', 'public'), { recursive: true })
writeFileSync(join(root, 'web', 'public', 'corpus.json'), JSON.stringify(corpus, null, 2))
console.log(`corpus.json exported: ${corpus.documents.length} documents`)
