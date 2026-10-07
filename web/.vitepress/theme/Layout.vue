<script setup>
import { onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const Default = DefaultTheme.Layout

onMounted(() => {
  // —— 行动清单可勾选：点击行打勾（localStorage 按页面持久化） ——
  const doc = document.querySelector('.vp-doc')
  if (!doc) return
  const pathKey = 'sagerelay-checks:' + (page.value.relativePath || location.pathname)
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(pathKey) || '{}')
  } catch {}
  const CHECKABLE = new Set(['怎么做', '怎么吃', '怎么动', '查什么', '达标项', '场景'])
  const tables = [...doc.querySelectorAll('table')].filter((tb) => {
    const head = tb.querySelector('tr th')
    return head && CHECKABLE.has(head.textContent.trim())
  })
  const applyRow = (tr, on) => {
    tr.classList.toggle('row-done', on)
    const td = tr.querySelector('td')
    if (td) td.innerHTML = (on ? '✅ ' : '') + (td.getAttribute('data-orig') || td.innerHTML)
  }
  tables.forEach((tb) => {
    tb.classList.add('checkable')
    tb.querySelectorAll('tbody tr').forEach((tr) => {
      const td = tr.querySelector('td')
      if (!td) return
      const text = td.textContent.trim()
      if (!text) return
      td.setAttribute('data-orig', td.innerHTML)
      if (saved[text]) applyRow(tr, true)
      tr.addEventListener('click', (e) => {
        if (e.target.closest('a')) return
        const on = !tr.classList.contains('row-done')
        applyRow(tr, on)
        if (on) saved[text] = 1
        else delete saved[text]
        try {
          localStorage.setItem(pathKey, JSON.stringify(saved))
        } catch {}
      })
    })
  })
})
</script>

<template>
  <Default>
    <template #doc-top>
      <div
        v-if="frontmatter.value.reviewed === true"
        class="verified-badge"
      >
        ✅ 已人工核验<span v-if="frontmatter.value.reviewed_date">（核验日期：{{ frontmatter.value.reviewed_date }}）</span>
      </div>
    </template>
  </Default>
</template>

<style>
.verified-badge {
  margin: -8px 0 16px;
  padding: 8px 14px;
  border: 1px solid var(--vp-c-green-2);
  border-radius: 8px;
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  font-weight: 600;
  font-size: 0.92rem;
}
/* 可勾选行动清单 */
.vp-doc table.checkable tbody tr {
  cursor: pointer;
}
.vp-doc tr.row-done td {
  opacity: 0.5;
  text-decoration: line-through;
}
.vp-doc tr.row-done td:first-child {
  text-decoration: none;
}
/* 移动端表格优化：横向可滑、收紧间距 */
@media (max-width: 768px) {
  .vp-doc table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .vp-doc th,
  .vp-doc td {
    padding: 6px 9px;
    font-size: 0.9rem;
  }
  .vp-doc h1 {
    font-size: 1.35rem;
  }
  .vp-doc h2 {
    font-size: 1.2rem;
  }
}
/* 打印：只留正文 */
@media print {
  .VPNavBar,
  .VPSidebar,
  .VPBackTop,
  .VPDocFooter,
  .VPPageNav,
  .verified-badge ~ .vp-doc .co,
  #VPContent > .container > .content > .aside {
    display: none !important;
  }
  .vp-doc {
    max-width: 100%;
  }
  .vp-doc table {
    display: table;
    width: 100%;
  }
}
</style>
