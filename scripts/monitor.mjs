// 官方来源监控：每日检查中国疾控营养与健康所"技术指南"栏目是否有新文章。
// 新文章出现时：CI 内自动开 issue 提醒；本地运行仅打印。
// 快照存 monitor/known.json（随仓库提交，作为对比基线）。
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = [
  'https://www.chinanutri.cn/fgbz/fgbzjszn/index.html',
  'https://www.chinanutri.cn/fgbz/fgbzjszn/index_1.html',
]
const BASE = 'https://www.chinanutri.cn/fgbz/fgbzjszn/'
const KNOWN = join(root, 'monitor', 'known.json')
const REPO = 'yshuai/SageRelay'

function fetchPage(url) {
  // chinanutri 证书链不全，curl -k 跳过校验（与建站期采集方式一致）
  return execSync(`curl -sk -A "Mozilla/5.0" --max-time 30 "${url}"`, {
    maxBuffer: 16 * 1024 * 1024,
  }).toString()
}

function parseTitles(html) {
  const out = {}
  const re = /href="\.\/(\d{6}\/t\d+_\d+\.html)"[^>]*>([\s\S]*?)<\/a>/g
  let m
  while ((m = re.exec(html))) {
    const text = m[2]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/^>\s*/, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) out[BASE + m[1]] = text
  }
  return out
}

const current = {}
for (const p of PAGES) Object.assign(current, parseTitles(fetchPage(p)))
const known = existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, 'utf-8')) : {}

if (!Object.keys(known).length) {
  mkdirSync(join(root, 'monitor'), { recursive: true })
  writeFileSync(KNOWN, JSON.stringify(current, null, 2))
  console.log(`first run: snapshot saved with ${Object.keys(current).length} items (no issue)`)
  process.exit(0)
}

const fresh = Object.entries(current).filter(([u]) => !known[u])

if (!fresh.length) {
  console.log(`no updates (${Object.keys(current).length} items checked)`)
} else {
  const lines = fresh.map(([u, t]) => `- [${t}](${u})`)
  console.log(`NEW: ${fresh.length}\n${lines.join('\n')}`)
  const token = process.env.GITHUB_TOKEN
  if (token && process.env.CI) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'sagerelay-monitor',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `📋 栏目更新：发现 ${fresh.length} 篇新文章`,
        body: `技术指南栏目出现新内容，请评估是否新增词条：\n\n${lines.join('\n')}\n\n> 由 monitor.mjs 自动创建（每日检查 chinanutri 技术指南栏目）。`,
      }),
    })
    console.log('issue created:', res.status)
  }
}

mkdirSync(join(root, 'monitor'), { recursive: true })
writeFileSync(KNOWN, JSON.stringify({ ...known, ...current }, null, 2))
