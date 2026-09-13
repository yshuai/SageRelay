---
title: 官方怎么说 —— 检索
titleTemplate: false
---

<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

const q = ref('')
const docs = ref([])
const loaded = ref(false)
const err = ref('')

fetch(withBase('/corpus.json'))
  .then((r) => r.json())
  .then((d) => {
    docs.value = d.documents
    loaded.value = true
  })
  .catch(() => { err.value = '语料加载失败，请刷新重试' })

const pathOf = (d) => withBase(
  d.type === 'guide' ? `/guides/${d.slug}.html`
  : d.type === 'data' ? `/data/${d.slug}.html`
  : `/standards/${d.slug}.html`
)

const results = computed(() => {
  const t = q.value.trim()
  if (t.length < 2) return []
  const out = []
  for (const d of docs.value) {
    const i = d.body.indexOf(t)
    if (i === -1 && !d.title.includes(t) && !d.description.includes(t) && !d.tags.some((x) => x.includes(t))) continue
    const at = d.body.indexOf(t)
    out.push({
      title: d.title,
      issuer: d.issuer,
      tier: d.source_tier,
      link: pathOf(d),
      snippet: at >= 0
        ? '…' + d.body.slice(Math.max(0, at - 30), at + 50).replace(/\s+/g, ' ') + '…'
        : d.description,
    })
    if (out.length >= 12) break
  }
  return out
})
</script>

# 官方怎么说 —— 检索

在 [AI 语料库](https://yshuai.github.io/SageRelay/corpus.json)（19 篇指南 + 3 数据页 + 1 国标词条）中检索关键词，直接返回**本站整理内容片段与词条出处**。这是[文献检索助手（第一层）](/project/adr/0012-ai-agent-roadmap)的纯检索形态：**只定位原文，不生成任何结论**。

<div class="finder">
  <input
    v-model="q"
    type="search"
    placeholder="试试：限盐、嘌呤、保质期、血糖……（至少 2 个字）"
    style="width:100%;padding:.6rem .9rem;font-size:1.05rem;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg);color:var(--vp-c-text-1)"
  />
  <p v-if="err" style="color:var(--vp-c-danger)">{{ err }}</p>
  <p v-else-if="!loaded">语料加载中……</p>
  <p v-else-if="q.trim().length < 2">输入关键词开始检索（≥2 个字）。</p>
  <p v-else-if="results.length === 0">没有匹配的词条——换个关键词试试，或用上方全文搜索。</p>
  <ol v-else>
    <li v-for="r in results" :key="r.link" style="margin:.8rem 0">
      <a :href="r.link" style="font-weight:600">{{ r.title }}</a>
      <span style="opacity:.6">（{{ r.issuer }} · {{ r.tier }}）</span>
      <p style="margin:.2rem 0 0;font-size:.95em">{{ r.snippet }}</p>
    </li>
  </ol>
</div>

::: tip 边界声明
本检索只做**语料定位**，返回的是整理稿片段及其词条链接（词条内每条建议可继续溯源到官方原文）。它不生成任何医学结论——需要个性化建议请咨询专业机构。
:::
