import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'

// Git Bash 会把 VP_BASE=/SageRelay/ 环境变量值转换成 Windows 盘符路径（MSYS path
// conversion），此处识别并回退到本仓库的正确子路径，防污染。
const rawBase = process.env.VP_BASE
const base = !rawBase || /^[A-Za-z]:[\\/]/.test(rawBase) ? '/SageRelay/' : rawBase

const adrManifest = JSON.parse(
  readFileSync(new URL('../project/adr-manifest.json', import.meta.url), 'utf-8'),
)

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: '建议驿站',
  titleTemplate: ':title | 建议驿站 SageRelay',
  description:
    '建议驿站（SageRelay）——官方饮食与健康指南科普汇编：高血压、高血脂、糖尿病、肥胖食养指南与《中国居民膳食指南》要点导读，每篇附原文出处。',
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content:
          '建议驿站,SageRelay,食养指南,高血压饮食,高血脂饮食,糖尿病饮食,肥胖饮食,中国居民膳食指南,官方指南,国家标准',
      },
    ],
  ],
  sitemap: { hostname: 'https://yshuai.github.io' },
  themeConfig: {
    siteTitle: '建议驿站',
    nav: [
      { text: '首页', link: '/' },
      { text: '食养指南', link: '/guides/hypertension-2023' },
      { text: '权威数据', link: '/data/chronic-disease-report-2020' },
      { text: '国标科普', link: '/standards/gb28050-nutrition-label' },
      { text: '检索', link: '/find' },
      { text: '项目文档', link: '/project/' },
      { text: '关于本站', link: '/about' },
    ],
    sidebar: {
      '/guides/': [        {
          text: '总纲',
          items: [
            { text: '中国居民膳食指南（2022）', link: '/guides/dietary-guidelines-2022' },
          ],
        },
        {
          text: '成人慢病食养',
          items: [
            { text: '成人高血压食养指南（2023年版）', link: '/guides/hypertension-2023' },
            { text: '成人高脂血症食养指南（2023年版）', link: '/guides/hyperlipidemia-2023' },
            { text: '成人糖尿病食养指南（2023年版）', link: '/guides/diabetes-2023' },
            { text: '成人肥胖食养指南（2024年版）', link: '/guides/obesity-2024' },
            { text: '成人高尿酸血症与痛风食养指南（2024年版）', link: '/guides/gout-2024' },
            { text: '成人慢性肾脏病食养指南（2024年版）', link: '/guides/ckd-2024' },
            { text: '成人脑卒中食养指南（2026年版）', link: '/guides/stroke-2026' },
            { text: '成人肌少症食养指南（2026年版）', link: '/guides/sarcopenia-2026' },
            { text: '成人骨质疏松症食养指南（2026年版）', link: '/guides/osteoporosis-2026' },
          ],
        },
        {
          text: '儿童青少年',
          items: [
            { text: '儿童青少年生长迟缓食养指南（2023年版）', link: '/guides/growth-retardation-2023' },
            { text: '儿童青少年肥胖食养指南（2024年版）', link: '/guides/child-obesity-2024' },
            { text: '学生餐营养指南（WS/T 554—2017）', link: '/guides/student-meals-2017' },
          ],
        },
        {
          text: '诊疗与体重管理',
          items: [
            { text: '肥胖症诊疗指南（2024年版）', link: '/guides/obesity-clinical-2024' },
            { text: '体重管理指导原则（2024年版）', link: '/guides/weight-management-2024' },
          ],
        },
        {
          text: '营养健康环境',
          items: [
            { text: '餐饮食品营养标识指南', link: '/guides/nutrition-labeling-2020' },
            { text: '营养健康食堂建设指南', link: '/guides/canteen-guide-2020' },
            { text: '营养健康餐厅建设指南', link: '/guides/restaurant-guide-2020' },
            { text: '营养指导员服务技术指南（试行）', link: '/guides/nutrition-instructor-2026' },
          ],
        },
      ],
      '/data/': [
        {
          text: '权威数据',
          items: [
            { text: '营养与慢性病状况报告（2020）核心数据', link: '/data/chronic-disease-report-2020' },
            { text: '中国人群身体活动指南（2021）推荐量', link: '/data/physical-activity-2021' },
          ],
        },
      ],
      '/standards/': [
        {
          text: '国标科普（试点）',
          items: [
            { text: 'GB 28050 预包装食品营养标签通则', link: '/standards/gb28050-nutrition-label' },
            { text: 'GB 7718 预包装食品标签通则', link: '/standards/gb7718-food-label' },
          ],
        },
      ],
      '/project/': [
        {
          text: '项目文档',
          items: [
            { text: '术语表（CONTEXT）', link: '/project/CONTEXT' },
            ...adrManifest.map((m) => ({ text: m.title, link: '/project/adr/' + m.slug })),
          ],
        },
      ],
    },
    search: { provider: 'local' },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    footer: {
      message: '本站为非官方科普项目，内容以权威原文为准，不构成诊疗建议',
      copyright:
        '原文版权归发布机构所有（政府公文属公共领域）；导读与整理内容以 CC BY-NC-SA 4.0 授权',
    },
  },
})
