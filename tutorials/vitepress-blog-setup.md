---
title: VitePress 搭建个人博客（从 0 到上线）
date: 2024-03-12
description: 以 VitePress 为核心，从初始化到 GitHub Pages 自动部署的完整流程。
---

# VitePress 搭建个人博客（从 0 到上线）

本文给出一个可直接落地的最小闭环：**本地可写 → 可预览 → 可构建 → 可自动部署**。默认以
“项目页”发布到 `https://你的用户名.github.io/仓库名/`。

## 1. 准备环境

- Node.js 18+（建议 20）
- Git
- 包管理器：pnpm / npm / yarn 均可（本文示例用 pnpm）

## 2. 初始化项目

```bash
mkdir my-blog
cd my-blog

pnpm init
pnpm add -D vitepress
pnpm vitepress init
```

初始化向导推荐选择：

- 站点标题：随便（如 `huige9999 Blog`）
- 站点描述：随便
- 主题：Default Theme
- TypeScript：Yes
- Add scripts：Yes

启动本地预览：

```bash
pnpm docs:dev
```

浏览器打开提示的地址，能看到首页就说明骨架 OK。

## 3. 目录结构速览

你会看到类似结构（本文以**根目录**作为站点根）：

```
my-blog/
  .vitepress/
    config.mts
  index.md
  package.json
```

重点文件说明：

- `.vitepress/config.mts`：站点配置（导航、侧边栏、base 等）
- `index.md`：首页
- `tutorials/`、`projects/`、`notes/`、`opinions/`：内容分区

## 4. 写一篇文章并挂到导航

示例：新建 `tutorials/vitepress-blog-setup.md`（就是本文）。

然后在 `.vitepress/config.mts` 的 sidebar 增加一条：

```ts
sidebar: {
  '/tutorials/': [
    {
      text: '教程',
      items: [
        { text: '索引', link: '/tutorials/' },
        { text: '工程化实践', link: '/tutorials/engineering-practice' },
        { text: 'VitePress 搭建个人博客', link: '/tutorials/vitepress-blog-setup' }
      ]
    }
  ],
  // ...
}
```

## 5. GitHub Pages 部署（项目页）

### 5.1 创建仓库并推送

在 GitHub 新建仓库（如：`my-blog`），然后把本地代码推上去。

### 5.2 设置 `base`

项目页地址是：`https://你的用户名.github.io/仓库名/`  
所以 `base` 必须是 `"/仓库名/"`。

在 `.vitepress/config.mts` 顶层加：

```ts
base: "/my-blog/",
```

### 5.3 添加 GitHub Actions 工作流

新建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 20
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.28.2
          run_install: false
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Install dependencies
        run: pnpm install
      - name: Build with VitePress
        run: pnpm docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5.4 打开 GitHub Pages

仓库 Settings → Pages → Source 选择 GitHub Actions。

### 5.5 推送并等待部署

```bash
git add .
git commit -m "Deploy blog"
git push
```

部署完成后访问：`https://你的用户名.github.io/仓库名/`

## 6. 常见踩坑

- **页面资源 404**：大概率是 `base` 没配置或配置错。
- **Actions 构建失败（找不到 pnpm）**：需要先安装 pnpm，再执行 `pnpm install`。
- **个人页 vs 项目页**：
  - 个人页：仓库名必须是 `你的用户名.github.io`，`base: '/'`
  - 项目页：仓库名随意，`base: '/仓库名/'`

---

到这里，你已经拥有一个可持续维护的博客骨架：**本地可写、可导航、可构建、可自动部署上线**。
