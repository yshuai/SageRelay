---
title: 延伸工具站导航 · 官方优先，境外补充
issuer: 混合来源（官方平台 + 境外工具站，见 ADR 0019）
source_tier: 混合（官方 + 显式例外）
version: —
published: —
source_url: https://www.piyao.org.cn/
status: 现行服务
tags: [工具站, 健身, 营养, 辟谣, 实用网站]
type: 查询页
reviewed: false
description: 家庭实用工具站合集：辟谣平台/科普中国/天气网等官方阵营 + MuscleWiki 等境外工具站（显式例外收录），每条注明与官方内容的配对。
---

# 延伸工具站导航 · 官方优先，境外补充

::: warning 收录说明
本页包含**两类**工具站：**官方阵营**（白名单内，一级来源）与**境外/市场化延伸**（[ADR 0019](/project/adr/0019-tool-sites.md) 显式例外：免费核心、无佣金无利益关联、非官方背书、可随时下架）。境外工具的数据标准（如美国 USDA）**不等于中国官方推荐量**，膳食与运动决策以本站官方内容为准。
:::

## 官方阵营（一级来源）

| 工具站 | 查什么 | 入口 |
| --- | --- | --- |
| **中国互联网联合辟谣平台**（网信办） | 谣言查证——家庭群里转来的"震惊体"先来这查 | [piyao.org.cn](https://www.piyao.org.cn/)（已核验） |
| **科普中国**（中国科协） | 权威科普内容库（健康、食品安全、应急等） | [kepuchina.cn](https://www.kepuchina.cn/)（已核验） |
| **中国天气网**（中国气象局） | 官方天气预报与预警（比商业 App 少广告） | [weather.com.cn](https://www.weather.com.cn/)（已核验） |
| **国家智慧教育公共服务平台**（教育部） | **免费**中小学课程资源、职业教育、老年教育 | [smartedu.cn](https://www.smartedu.cn/)（已核验） |
| **国家图书馆** | 读者注册后免费使用数字图书、期刊、古籍资源 | [nlc.cn](https://www.nlc.cn/)（已核验） |

## 延伸阵营（境外工具站 · ADR 0019 例外）

| 工具站 | 查什么 | 入口与提示 |
| --- | --- | --- |
| **MuscleWiki** | 按肌群点选 → 对应训练动作视频（中文界面），健身"看图点菜" | [musclewiki.com](https://musclewiki.com/)（已核验，境外加载稍慢） |
| **USDA FoodData Central** | 美国农业部食物营养数据库——查某种食物的热量/营养素明细 | [fdc.nal.usda.gov](https://fdc.nal.usda.gov/)（境外站点加载较慢，英文） |
| **NutritionFacts.org** | 非营利营养研究科普（按食物/健康话题检索文献综述） | [nutritionfacts.org](https://nutritionfacts.org/)（境外较慢，英文） |

**配对使用原则**（官方优先）：

- 练什么、练多少 → 以[身体活动指南推荐量](/data/physical-activity-2021)和[健身一张图](/query/fitness-map)为准；**具体动作怎么标准地做** → MuscleWiki 补细节。
- 吃多少、怎么搭配 → 以[膳食指南](/guides/dietary-guidelines-2022)和对应[食养指南](/guides/hypertension-2023)为准；**某种食物的营养细节** → USDA 数据库补查询（美国数据，参考用）。
- 补剂、某种食物的"功效"传言 → 先查[辟谣平台](https://www.piyao.org.cn/)，再看 nutritionfacts 的文献综述。

## 相关页面

- 健身设施：[健身一张图](/query/fitness-map) · 饮食总纲：[膳食指南](/guides/dietary-guidelines-2022) · 谣言治理：[投诉渠道全景](/query/complaint-channels)

## 溯源

| 字段 | 内容 |
| --- | --- |
| 官方阵营 | 网信办、中国科协、中国气象局、教育部、国家图书馆（一级来源，均已核验） |
| 延伸阵营 | MuscleWiki、USDA、NutritionFacts.org——ADR 0019 显式例外，无佣金无利益关联 |
