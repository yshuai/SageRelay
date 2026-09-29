// 一键部署：构建（含 prebuild 文档/语料/校验看板/RSS 同步）→ gh-pages 分支推送 → 触发 Pages 构建。
// 用法：npm run deploy ["提交说明"]
// 说明：从 Node 直接调用，不经 Git Bash 的 MSYS 路径转换，VP_BASE 无需排除参数。
import { execSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'web', '.vitepress', 'dist')
const msg = process.argv[2] || 'deploy: site update'
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts })

process.env.VP_BASE = '/SageRelay/'
run('npm run build', { cwd: root })
writeFileSync(join(dist, '.nojekyll'), '')

if (!existsSync(join(dist, '.git'))) run('git init -q -b gh-pages', { cwd: dist })
let remote = ''
try {
  remote = execSync('git remote get-url origin', { cwd: dist }).toString()
} catch {}
if (!remote.includes('SageRelay'))
  run('git remote add origin git@github.com:yshuai/SageRelay.git', { cwd: dist })
run('git add -A', { cwd: dist })
try {
  run(
    `git -c user.name=yshuai -c user.email="13953723+yshuai@users.noreply.github.com" commit -q -m "${msg}"`,
    { cwd: dist },
  )
} catch {
  console.log('nothing to commit on gh-pages')
}
run('git push -q -f origin gh-pages', { cwd: dist })

const ghCandidates = ['gh', '"C:\\Program Files\\GitHub CLI\\gh.exe"']
for (const gh of ghCandidates) {
  try {
    run(`${gh} api -X POST repos/yshuai/SageRelay/pages/builds`, { cwd: root })
    break
  } catch {
    console.log(`gh command failed: ${gh}`)
  }
}
console.log('deployed. 线上生效约 1-2 分钟：https://yshuai.github.io/SageRelay/')
