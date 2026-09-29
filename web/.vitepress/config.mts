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
      { text: '官方查询', link: '/query/hospital-doctor' },
      { text: '检索', link: '/find' },
      { text: '家庭管家', link: '/assist' },
      { text: '校验看板', link: '/verify' },
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
            { text: '健康中国行动 · 15 个行动总览', link: '/data/healthy-china-action' },
            { text: '健康中国行动 · 生活方式与基础', link: '/data/hc-action-lifestyle' },
            { text: '健康中国行动 · 重点人群', link: '/data/hc-action-people' },
            { text: '健康中国行动 · 疾病防治', link: '/data/hc-action-disease' },
          ],
        },
      ],
      '/standards/': [
        {
          text: '国标科普（试点）',
          items: [
            { text: 'GB 28050 预包装食品营养标签通则', link: '/standards/gb28050-nutrition-label' },
            { text: 'GB 7718 预包装食品标签通则', link: '/standards/gb7718-food-label' },
            { text: '标签要变什么 · 新旧对比预告', link: '/standards/gb28050-2025-preview' },
            { text: 'GB 7718 新旧对比预告', link: '/standards/gb7718-2025-preview' },
            { text: '营养标签 2027 新版 · 消费者问答精选', link: '/standards/gb28050-qa-detail' },
            { text: '食品标签 2027 新版 · 消费者问答精选', link: '/standards/gb7718-qa-detail' },
          ],
        },
      ],
      '/query/': [
        {
          text: '场景导航',
          items: [{ text: '官方查询导航 · 按生活场景', link: '/query/' }],
        },
        {
          text: '吃 & 购',
          items: [
            { text: '食品抽检结果查询（食安查）', link: '/query/food-spot-check' },
            { text: '溯源码查询（农产品/婴幼儿乳粉）', link: '/query/traceability' },
            { text: '食品生产许可 SC 查询', link: '/query/sc-food' },
            { text: '化妆品备案/注册查询', link: '/query/cosmetics' },
            { text: '医疗器械查询', link: '/query/medical-device' },
            { text: '保健食品注册备案查询', link: '/query/health-food' },
            { text: '药品批准文号查询', link: '/query/drug' },
          ],
        },
        {
          text: '维权 & 信用',
          items: [
            { text: '消协智慧 315 · 扫码辨商品', link: '/query/cca-315' },
            { text: '消费品召回查询', link: '/query/recall' },
            { text: '企业信用查询', link: '/query/enterprise-credit' },
          ],
        },
        {
          text: '就医 & 家庭 & 出行',
          items: [
            { text: '医疗机构与执业医师查询', link: '/query/hospital-doctor' },
            { text: '医保定点机构查询', link: '/query/yibao' },
            { text: '医保药品目录查询', link: '/query/yibao-drug' },
            { text: '养老机构查询（养老地图）', link: '/query/elder-care' },
            { text: '健身一张图', link: '/query/fitness-map' },
            { text: '导游与旅行社核验', link: '/query/tour-guide' },
            { text: '空气质量与水质查询', link: '/query/environment' },
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
