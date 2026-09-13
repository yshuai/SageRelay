# 建议驿站（SageRelay）

> 驿站，是古代官方文书接力传递的节点——我们收录官方指南、附上出处，一站站寄给需要的人。

非官方的权威指南科普汇编站：把国家权威部门发布的食养指南、膳食指南等文件整理成**可溯源、受版本控制**的词条。核心立场：不做自创健康论断，一切以原文为准。

## 快速开始

```bash
# 需要 Node.js >= 18
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 产物在 web/.vitepress/dist
npm run preview  # 本地预览构建产物
```

## 仓库结构

```
├── CONTEXT.md              # 术语表（领域语言，非规格文档）
├── docs/adr/               # 架构与边界决策记录
├── .github/workflows/deploy.yml  # 推送 main 自动部署 GitHub Pages
├── package.json
└── web/                    # VitePress 站点
    ├── .vitepress/config.mts
    ├── index.md            # 首页
    ├── about.md            # 关于本站（收录标准/免责声明/授权）
    └── guides/             # 词条（19 篇：chinanutri 技术指南栏目全量收录）
```

## 部署

- 线上地址：**https://yshuai.github.io/SageRelay/**
- 当前方式：`web/.vitepress/dist` 以 `VP_BASE=/SageRelay/` 构建后，整目录推送到 `gh-pages` 分支（含 `.nojekyll`），Pages 源 = gh-pages 分支（legacy 构建）。更新词条后重新执行同样的构建与分支推送即可。
- 备用方式：仓库内 Actions 工作流（`gh workflow run deploy.yml --manual`）已保留，但当前仅限手动触发——近期该账号的 Actions runner 长时间不接活，故切换为分支直发。想切回 Actions 部署：Settings → Pages → Source 选 **GitHub Actions**，并把工作流 trigger 恢复为 `push: branches: [main]`。

## 词条规范

每个词条 = **权威原文引用 + 地图式导读 + 溯源信息**。frontmatter 字段：

| 字段 | 说明 |
| --- | --- |
| `issuer` | 发布机构 |
| `source_tier` | 来源级别（一级/二级/三级，见 ADR 0002、0007） |
| `version` | 版本（如 2023年版） |
| `published` | 印发/发布年月 |
| `document_no` | 发文字号（核对原文后填，禁止凭记忆编造） |
| `source_url` | 原文链接 |
| `status` | `现行` / `已废止（被XX年版替代）` |
| `reviewed` | `false` = AI 初稿未人工校验；`true` = 已逐条对照原文校验 |

**编辑纪律**（见 ADR 0004、0006）：

1. 导读只做地图：说明"适合谁、关键是什么"，**不新增任何医学论断**；引用数值必须出自原文。
2. `document_no`、日期等溯源字段必须对照原文填写，不确定就留待核对。
3. 新版指南发布后：旧版归档不删除，`status` 改为"已被 XX 年版替代"。
4. 每半年全库核查一次版本现行状态。
5. 白名单之外的来源一律不收；三级来源（医院/医生）后置启用，只链接摘要不整篇转载。

## 待办

- [ ] 「一枝春」全网查重（同名图书/公众号/商标）+ 域名注册（本机 DNS 异常，需到注册商查询）
- [ ] 19 篇导读逐条对照原文人工校验，`reviewed` 置 true（含复核全部发文字号）
- [ ] `git init` + 首次提交，建公开仓库，开启 Pages（见上方部署说明）
- [ ] 词条量增长后评估 Pagefind 替换本地搜索（中文索引质量更好）

## 收录范围

收录以[中国疾控中心营养与健康所"技术指南"栏目](https://www.chinanutri.cn/fgbz/fgbzjszn/index.html)全量清单为准（含分页，问答类附件不作独立词条，必要时在词条内链接）。栏目发布新指南或新版本时：新增词条，旧版本归档并把 `status` 改为"已被 XX 年版替代"——**新版覆盖旧版，永不删除**。

## 文档

- [CONTEXT.md](./CONTEXT.md)：领域术语表
- ADR：[0001 首期范围](./docs/adr/0001-mvp-scope.md) · [0002 来源白名单](./docs/adr/0002-source-whitelist.md) · [0003 静态文档站](./docs/adr/0003-static-docs-site.md) · [0004 AI 层缓行](./docs/adr/0004-ai-layer-deferred.md) · [0005 语料公开](./docs/adr/0005-open-corpus.md) · [0006 仅网站单端](./docs/adr/0006-single-end-website-only.md) · [0007 三级来源](./docs/adr/0007-third-tier-sources.md) · [0008 定名一枝春](./docs/adr/0008-name-yizhichun.md)
