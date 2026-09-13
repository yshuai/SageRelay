// 把仓库根部的项目文档（术语表 + ADR）同步进 VitePress 站点，
// 供 web/.vitepress/config.mts 读取生成"项目文档"栏目。
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const destAdr = join(root, 'web', 'project', 'adr')
mkdirSync(destAdr, { recursive: true })
cpSync(join(root, 'CONTEXT.md'), join(root, 'web', 'project', 'CONTEXT.md'))

const files = readdirSync(join(root, 'docs', 'adr')).filter((f) => f.endsWith('.md')).sort()
const manifest = []
for (const f of files) {
  cpSync(join(root, 'docs', 'adr', f), join(destAdr, f))
  const h1 = readFileSync(join(root, 'docs', 'adr', f), 'utf-8').match(/^# (.+)$/m)?.[1] ?? f
  manifest.push({ slug: f.replace(/\.md$/, ''), title: h1.trim() })
}
writeFileSync(
  join(root, 'web', 'project', 'adr-manifest.json'),
  JSON.stringify(manifest, null, 2),
)
console.log(`synced: CONTEXT.md + ${manifest.length} ADRs`)
