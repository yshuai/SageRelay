<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const Default = DefaultTheme.Layout
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
</style>
