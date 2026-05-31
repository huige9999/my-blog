---
name: blog-writing
description: 写博客文章与发布流程（仅在写文章任务时使用）
---

# 博客文章编写规范

本文档记录了在此博客项目中创建和发布新文章的完整流程。

## 博客四大板块

根据首页定位，博客分为四个板块：

| 板块 | 目录 | 定位 | 内容特点 |
|------|------|------|----------|
| 输入笔记 | `input-notes/` | 外部输入转成自己的理解 | 看教程、文章、项目时的提取记录，不追求完整体系 |
| 实战手册 | `practical-guides/` | 可照着操作的技术实践指南 | 下次做同类事情可以直接照着走，含独立篇和系列篇 |
| 专题研究 | `research/` | 围绕一个问题深入钻研的系统性文章 | 持续补充，形成自己的判断框架 |
| 观点沉淀 | `opinions/` | 经过思考后形成的长期判断与方法论 | 技术判断力 + 职业判断力 + 学习判断力 |

## 文章 Frontmatter 格式

所有文章必须包含正确的 frontmatter：

```yaml
---
title: 文章标题
date: YYYY-MM-DD
description: 文章简短描述（用于 SEO 和列表展示）
---
```

**重要说明：**
- `date` 字段必须存在，否则文章不会出现在首页"近期发布"中
- `date` 使用 `YYYY-MM-DD` 格式（如：2025-11-13）
- `description` 建议控制在 50 字以内，简洁描述文章核心价值

## 完整发布流程

### 1. 创建文章文件

在对应目录创建 Markdown 文件（使用 kebab-case 命名）：

```
input-notes/my-new-article.md
practical-guides/my-new-guide.md
research/my-research-topic.md
opinions/my-opinion.md
```

对于系列文章，可使用子目录：
```
practical-guides/frontend-ai-infra/01-some-topic.md
```

### 2. 编写 frontmatter 和内容

确保包含正确的 title、date、description。

### 3. 更新索引页

在对应目录的 `index.md` 中，按**表格格式**添加文章链接（使用相对路径）：

```markdown
| [文章标题](./article-name) | 关键词1、关键词2 |
```

**示例（输入笔记）：**
```markdown
| [代码定位能力](./code-location-ability) | 代码阅读、定位、调试 |
```

**示例（专题研究，按分组）：**
```markdown
## 前端动画

| 文章 | 关键词 |
|------|--------|
| [CSS transition 与 animation 本质区别](./css-transition-vs-animation) | CSS、transition、animation |
```

**注意：**
- ✅ 使用相对路径 `./article-name`
- ✅ 不包含 `.md` 扩展名
- ✅ 关键词用中文顿号（、）分隔
- ✅ 新分组用 `## 分组名` 标题分隔

### 4. 更新侧边栏配置

编辑 `.vitepress/config.mts`，在对应板块的 `sidebar` 配置中添加文章：

**普通文章（平级列表）：**
```typescript
'/input-notes/': [
  {
    text: '输入笔记',
    items: [
      { text: '索引', link: '/input-notes/' },
      { text: '新文章标题', link: '/input-notes/new-article' }
    ]
  }
],
```

**带分组的文章（使用 collapsed 折叠）：**
```typescript
'/research/': [
  {
    text: '专题研究',
    items: [
      { text: '索引', link: '/research/' },
      {
        text: '分组名称',
        collapsed: true,
        items: [
          { text: '文章标题', link: '/research/article-name' }
        ]
      }
    ]
  }
],
```

**系列文章（子目录）：**
```typescript
{
  text: '系列名称',
  collapsed: true,
  items: [
    { text: '系列概述', link: '/practical-guides/series-name/' },
    { text: '01 篇章标题', link: '/practical-guides/series-name/first-article' }
  ]
}
```

**侧边栏配置要点：**
- `text` 是显示在侧边栏的标题
- `link` 使用绝对路径（以 `/` 开头），不含 `.md`
- 使用 `collapsed: true` 让分组默认折叠，保持侧边栏整洁
- 系列文章放在 collapsed 分组内，索引项用子目录的 `/` 结尾

### 5. URL 生成逻辑（无需手动修改）

"近期发布"组件由 `.vitepress/data/recent-posts.data.mts` 自动驱动：
- 自动扫描四个目录下的所有 `.md` 文件（排除 `index.md`）
- 自动从 frontmatter 提取 title/date
- URL 自动拼接 `/my-blog/` 前缀
- 板块标签自动映射（`input-notes` → `输入笔记` 等）
- 按日期倒序，取最新 5 篇

**无需手动修改此文件**，除非新增板块目录。

## 常见问题排查

### 文章在"近期发布"中不显示
- ✅ 检查 frontmatter 中是否有 `date` 字段
- ✅ 检查日期格式是否为 `YYYY-MM-DD`
- ✅ 检查文件是否在正确的目录（input-notes/practical-guides/research/opinions）
- ✅ 检查文件名是否为 `index.md`（会被自动排除）

### 文章链接 404
- ✅ 检查索引页链接格式（相对路径 `./article`，无 `.md`）
- ✅ 检查侧边栏配置的 link 路径（绝对路径 `/dir/article`，无 `.md`）
- ✅ 两者路径格式不同：索引页用相对，侧边栏用绝对

### 侧边栏不显示文章
- ✅ 检查 `.vitepress/config.mts` 中是否添加了对应条目
- ✅ 检查 link 路径格式（绝对路径，不含 `.md`）
- ✅ 确认 items 数组中位置正确

## 快速检查清单

发布新文章前，确认以下事项：

- [ ] Frontmatter 包含 title、date、description
- [ ] 文件放在正确的目录（input-notes/practical-guides/research/opinions）
- [ ] 索引页已更新（表格格式，相对路径 `./article`，含关键词）
- [ ] 侧边栏配置已更新（`.vitepress/config.mts`，绝对路径 `/dir/article`）
- [ ] 日期格式正确（YYYY-MM-DD）
- [ ] 文件名使用 kebab-case

## 写作风格指南

- 文章开头用简短的定位说明（一段话概括"读完能得到什么"）
- 技术文章用「你」而非「我们」，保持直接对话感
- 代码块标注语言类型（`typescript`、`bash` 等）
- 关键结论用加粗或引用块突出
- 文章末尾可附"下一步"或"延伸阅读"引导
