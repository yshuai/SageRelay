---
title: 家庭管家（试点）
titleTemplate: false
---

<script setup>
import { ref, computed } from 'vue'

const guides = [
  { tag: '高血压', title: '成人高血压食养指南（2023年版）', key: '每日食盐逐步降至 5g 以下，增加富钾食物', link: '/guides/hypertension-2023' },
  { tag: '糖尿病', title: '成人糖尿病食养指南（2023年版）', key: '主食定量、优选低 GI 食物；餐后运动每周 ≥5 天', link: '/guides/diabetes-2023' },
  { tag: '高血脂', title: '成人高脂血症食养指南（2023年版）', key: '烹调油 ≤25g/日；膳食纤维 25～40g', link: '/guides/hyperlipidemia-2023' },
  { tag: '痛风/高尿酸', title: '成人高尿酸血症与痛风食养指南（2024年版）', key: '低嘌呤膳食；每日饮水 2000～3000mL', link: '/guides/gout-2024' },
  { tag: '慢性肾脏病', title: '成人慢性肾脏病食养指南（2024年版）', key: '按分期实施低蛋白饮食（3～5 期 0.6g/kg 理想体重）', link: '/guides/ckd-2024' },
  { tag: '超重或肥胖', title: '成人肥胖食养指南（2024年版）', key: '每日能量减 500～1000kcal；每周运动 150～300 分钟', link: '/guides/obesity-2024' },
  { tag: '脑卒中恢复期', title: '成人脑卒中食养指南（2026年版）', key: '质地软烂易吞咽；吞咽障碍先做分级评估', link: '/guides/stroke-2026' },
]
const family = [
  { tag: '家有老人（65 岁以上）', title: '成人肌少症食养指南（2026年版）', key: '蛋白质 1.2～1.5g/kg/日，每餐 20～25g', link: '/guides/sarcopenia-2026' },
  { tag: '家有老人（65 岁以上）', title: '成人骨质疏松症食养指南（2026年版）', key: '每日钙 1000～1200mg；奶类 300mL 以上', link: '/guides/osteoporosis-2026' },
  { tag: '家有儿童青少年', title: '儿童青少年肥胖食养指南（2024年版）', key: '小份多样 12 种/日；每天运动 ≥60 分钟', link: '/guides/child-obesity-2024' },
  { tag: '家有儿童青少年', title: '儿童青少年生长迟缓食养指南（2023年版）', key: '3 次正餐 + 2 次加餐；优质蛋白充足', link: '/guides/growth-retardation-2023' },
  { tag: '家有学生', title: '学生餐营养指南（WS/T 554—2017）', key: '按年龄段核对学校食谱的食物品种', link: '/guides/student-meals-2017' },
]
const picked = ref([])
function toggle(tag) {
  const i = picked.value.indexOf(tag)
  i >= 0 ? picked.value.splice(i, 1) : picked.value.push(tag)
}
const matched = computed(() => {
  if (!picked.value.length) return []
  const ids = new Set()
  const out = []
  for (const g of [...guides, ...family]) {
    if (picked.value.includes(g.tag) && !ids.has(g.link)) {
      ids.add(g.link)
      out.push(g)
    }
  }
  return out
})
const common = [
  { t: '全家食盐每日不超过 5g（含酱油等调味品折算）', l: '/guides/hypertension-2023' },
  { t: '蔬菜 ≥300～500g、水果 200～350g，餐餐有蔬菜', l: '/guides/dietary-guidelines-2022' },
  { t: '每周 150～300 分钟中等强度运动 + 每周 2 天肌肉力量练习', l: '/data/physical-activity-2021' },
  { t: '戒烟、限制饮酒；规律作息不熬夜', l: '/guides/hypertension-2023' },
  { t: '定期监测血压/血糖/血脂/体重，遵医嘱治疗', l: '/data/chronic-disease-report-2020' },
]
const skills = [
  { t: '看营养成分表"1+4"（能量+蛋白质、脂肪、碳水、钠）及 NRV%', l: '/standards/gb28050-nutrition-label' },
  { t: '配料表按加入量递减——前三位是主要成分', l: '/standards/gb7718-food-label' },
  { t: '核对生产日期、保质期与贮存条件', l: '/standards/gb7718-food-label' },
]
</script>

# 家庭管家（试点）

按 [ADR 0012 第二层](/project/adr/0012-ai-agent-roadmap) 设计的**规则化原型**：勾选家庭情况，页面从本站词条中组装对应指南与关键数字。它只做**整理与提醒**——不是个性化医疗建议，执行前请咨询医生或营养师。

::: danger 边界
以下所有内容均为官方指南的模板化摘录（点击跳转词条与原文出处）。本管家**不会**根据个人病情生成任何新建议。
:::

## 第一步 · 勾选家庭情况

<p style="display:flex;flex-wrap:wrap;gap:.5rem">
  <button v-for="tag in [...guides.map(g=>g.tag), ...family.map(f=>f.tag).filter((t,i,a)=>a.indexOf(t)===i)]"
    :key="tag" @click="toggle(tag)"
    :style="{
      padding:'.4rem .9rem', borderRadius:'999px', cursor:'pointer', fontSize:'.95rem',
      border: picked.includes(tag) ? '1px solid var(--vp-c-brand-1)' : '1px solid var(--vp-c-divider)',
      background: picked.includes(tag) ? 'var(--vp-c-brand-soft)' : 'var(--vp-c-bg)',
      color: 'var(--vp-c-text-1)'
    }">{{ tag }}</button>
</p>

## 第二步 · 你的家庭指南包

<p v-if="!picked.length">勾选上方标签后，这里会出现对应的官方指南与关键数字。</p>
<div v-else>
  <table>
    <thead><tr><th>对应指南</th><th>关键数字（先记住这一条）</th></tr></thead>
    <tbody>
      <tr v-for="g in matched" :key="g.link">
        <td><a :href="g.link">{{ g.title }}</a></td>
        <td>{{ g.key }}</td>
      </tr>
    </tbody>
  </table>
</div>

## 全家通用行动（任何组合都适用）

| 行动 | 出处词条 |
| --- | --- |
| <span v-for="c in common.slice(0,1)">{{ c.t }}</span> | <a :href="common[0].l">高血压食养指南</a> |
| <span>{{ common[1].t }}</span> | <a :href="common[1].l">膳食指南（2022）</a> |
| <span>{{ common[2].t }}</span> | <a :href="common[2].l">身体活动指南推荐量</a> |
| <span>{{ common[3].t }}</span> | <a :href="common[3].l">高血压食养指南</a> |
| <span>{{ common[4].t }}</span> | <a :href="common[4].l">慢性病报告核心数据</a> |

## 采购技能（两把尺子）

| 技能 | 出处词条 |
| --- | --- |
| <span v-for="s in skills.slice(0,1)">{{ s.t }}</span> | <a :href="skills[0].l">GB 28050 营养标签</a> |
| <span>{{ skills[1].t }}</span> | <a :href="skills[1].l">GB 7718 食品标签</a> |
| <span>{{ skills[2].t }}</span> | <a :href="skills[2].l">GB 7718 食品标签</a> |

## 第三步 · 查一查（防坑验证）

| 场景 | 官方查询 |
| --- | --- |
| 买了化妆品 / 护肤品 | [化妆品备案/注册查询](/query/cosmetics) |
| 拿到不熟悉的药品 | [药品批准文号查询](/query/drug) |
| 新去看的医院或"专家" | [医疗机构与执业医师查询](/query/hospital-doctor) |
| 给老人买保健品 | [保健食品注册备案查询（蓝帽子）](/query/health-food) |

::: tip 数据背景
为什么这些数字值得认真对待：[慢性病报告核心数据](/data/chronic-disease-report-2020)——每 3 个成人约 1 个高血压，每 2 个成人约 1 个体重超标。
:::
