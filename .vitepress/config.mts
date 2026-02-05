import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/my-blog/',
  title: '汪元会的小窝',
  description: '长期的技术笔记与项目档案：把学到的、做过的、踩过的坑，沉淀成清晰的知识结构。',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        placeholder: '搜索文章'
      }
    },
    nav: [
      { text: '教程', link: '/tutorials/' },
      { text: '项目', link: '/projects/' },
      { text: '笔记', link: '/notes/' },
      { text: '观点', link: '/opinions/' }
    ],
    sidebar: {
      '/tutorials/': [
        {
          text: '教程',
          items: [
            { text: '索引', link: '/tutorials/' },
            { text: '自定义脚手架：快速入门', link: '/tutorials/custom-scaffold-quickstart' },
            { text: 'VitePress 搭建个人博客', link: '/tutorials/vitepress-blog-setup' }
          ]
        }
      ],
      '/projects/': [
        {
          text: '项目',
          items: [
            { text: '索引', link: '/projects/' },
            { text: '微信 H5 支付踩坑复盘：JSSDK 签名偶发失败与「URL 未注册」拦截', link: '/projects/wechat-h5-pay-jssdk-signature-url-not-registered' },
            { text: '重复 key 触发 Vue patch 崩溃：一次前端“假死”排查', link: '/projects/vue-duplicate-key-ui-freeze' },
            { text: 'repomix-helper：把 repomix 变成 VS Code 一键工作流', link: '/projects/repomix-helper-vscode-workflow' }
          ]
        }
      ],
      '/notes/': [
        {
          text: '笔记',
          items: [
            { text: '索引', link: '/notes/' },
            { text: '用 Worktree 把本地并行开发变简单', link: '/notes/worktree-parallel-development' },
            { text: 'Claude Code 的项目记忆组织思路', link: '/notes/claude-code-memory-organization' }
          ]
        }
      ],
      '/opinions/': [
        {
          text: '观点',
          items: [
            { text: '索引', link: '/opinions/' },
            { text: 'AI 时代程序员与 AI 协作的方法论', link: '/opinions/ai-era-dev-ai-collaboration' }
          ]
        }
      ]
    }
  }
})
