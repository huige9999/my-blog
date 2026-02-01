---
name: blog-writing
description: 写博客文章与发布流程（仅在写文章任务时使用）
---

# 博客文章编写规范

本文档记录了在此博客项目中创建和发布新文章的完整流程。

## 文章位置分类

根据内容类型，文章应放在对应目录：
- `tutorials/` - 教程类文章（路线式整理，从 0 到能做）
- `projects/` - 项目复盘（真实业务的方案、架构决策与复盘）
- `notes/` - 学习笔记（术语/碎片/小结，快速查、快速补）
- `opinions/` - 观点文章（原则、方法论与思考）

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
在对应目录创建 Markdown 文件（推荐使用 kebab-case 命名）：
```bash
# 例如：notes/worktree-parallel-development.md
```

### 2. 编写 frontmatter 和内容
确保包含正确的 title、date、description。

### 3. 更新索引页
在对应目录的 `index.md` 中添加文章链接（使用绝对路径）：

```markdown
- [文章标题](/目录名/文件名)
```

**示例：**
```markdown
- [用 Worktree 把本地并行开发变简单](/notes/worktree-parallel-development)
```

**注意：**
- ❌ 不要使用相对路径 `./article.md`
- ✅ 必须使用绝对路径 `/directory/article`
- ✅ 不要包含 `.md` 扩展名

### 4. 更新侧边栏配置
编辑 `.vitepress/config.mts`，在对应 section 的 `sidebar` 配置中添加文章：

```typescript
'/notes/': [
  {
    text: '笔记',
    items: [
      { text: '索引', link: '/notes/' },
      { text: '文章标题', link: '/notes/article-name' }
    ]
  }
],
```

**重要：**
- `text` 是显示在侧边栏的标题
- `link` 必须使用绝对路径，且不包含 `.md`
- 保持与索引页一致的路径格式

### 5. 检查 URL 生成逻辑

"近期发布"组件会自动读取所有文章，但需确保 `.vitepress/data/recent-posts.data.mts` 中的 `resolveUrl` 函数正确配置：

```typescript
const resolveUrl = (filePath: string) => {
  const relativePath = toPosixPath(relative(process.cwd(), filePath))
  const withoutExt = relativePath.replace(/\.md$/, '')
  const cleanPath = withoutExt.replace(/(^|\/)index$/, '$1')
  return `/my-blog/${cleanPath.replace(/^\//, '')}`
}
```

**关键点：**
- 必须包含 `base` 路径前缀 `/my-blog/`
- 确保前缀后有斜杠，避免 `/my-blognotes` 这样的错误
- 自动从文件路径生成正确的 URL

## 常见问题排查

### 文章在"近期发布"中不显示
- ✅ 检查 frontmatter 中是否有 `date` 字段
- ✅ 检查日期格式是否为 `YYYY-MM-DD`
- ✅ 检查文件是否在正确的目录（tutorials/projects/notes/opinions）

### 文章链接 404
- ✅ 检查索引页是否使用绝对路径（`/notes/article`）
- ✅ 检查配置文件中的 link 是否正确
- ✅ 检查 `resolveUrl` 函数是否包含 `/my-blog/` 前缀
- ✅ 检查前缀后是否有斜杠（避免 `/my-blognotes`）

### 侧边栏不显示文章
- ✅ 检查 `.vitepress/config.mts` 中是否添加了对应条目
- ✅ 检查 link 路径格式是否正确

## 快速检查清单

发布新文章前，确认以下事项：

- [ ] Frontmatter 包含 title、date、description
- [ ] 文件放在正确的目录（tutorials/projects/notes/opinions）
- [ ] 索引页已更新（使用绝对路径，不含 .md）
- [ ] 侧边栏配置已更新（.vitepress/config.mts）
- [ ] 日期格式正确（YYYY-MM-DD）
- [ ] 所有路径使用绝对路径格式
