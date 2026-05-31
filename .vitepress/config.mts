import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/my-blog/',
  title: '汪元会的博客',
  description: '长期的技术笔记与项目档案：把学到的、做过的、踩过的坑，沉淀成清晰的知识结构。',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        placeholder: '搜索文章'
      }
    },
    nav: [
      { text: '输入笔记', link: '/input-notes/' },
      { text: '实战手册', link: '/practical-guides/' },
      { text: '专题研究', link: '/research/' },
      { text: '观点沉淀', link: '/opinions/' }
    ],
    sidebar: {
      '/input-notes/': [
        {
          text: '输入笔记',
          items: [
            { text: '索引', link: '/input-notes/' },
            { text: 'AI编程范式的核心转变', link: '/input-notes/ai-programming-paradigm-shift' },
            { text: '一种 Human‑in‑the‑loop 解决方案', link: '/input-notes/human-in-the-loop-solution' },
            { text: '从看懂到会写：前端编码能力系统训练', link: '/input-notes/frontend-coding-training-method' },
            { text: '代码定位能力', link: '/input-notes/code-location-ability' },
            { text: '算法学习计划', link: '/input-notes/algorithm-study-plan' },
            { text: '读代码技巧：角色分层', link: '/input-notes/code-reading-role-layering' }
          ]
        }
      ],
      '/practical-guides/': [
        {
          text: '实战手册',
          items: [
            { text: '索引', link: '/practical-guides/' },
            { text: 'VitePress 搭建个人博客', link: '/practical-guides/vitepress-blog-setup' },
            { text: '博客目录组织', link: '/practical-guides/blog-directory-organization' },
            { text: '笔记目录组织', link: '/practical-guides/notes-directory-organization' },
            { text: '服务器部署', link: '/practical-guides/server-deployment' },
            { text: '免密访问远程服务器', link: '/practical-guides/ssh-passwordless-access' },
            { text: 'Win11右键改Win10', link: '/practical-guides/win11-context-menu' },
            { text: 'Docker 跑 Spring Boot 总结', link: '/practical-guides/docker-spring-boot-summary' },
            {
              text: '前端 × AI 基建系列',
              collapsed: true,
              items: [
                { text: '系列概述', link: '/practical-guides/frontend-ai-infra/' },
                { text: '01 前端基建思维', link: '/practical-guides/frontend-ai-infra/frontend-infra-thinking' },
                { text: '02 组件库基建', link: '/practical-guides/frontend-ai-infra/component-library-infra' },
                { text: '03 上下文工程', link: '/practical-guides/frontend-ai-infra/context-engineering-core' },
                { text: '04 Prompt/Rules/Skill', link: '/practical-guides/frontend-ai-infra/prompt-rules-skill' },
                { text: '05 MCP入门', link: '/practical-guides/frontend-ai-infra/mcp-introduction' },
                { text: '06 AI生成页面流程', link: '/practical-guides/frontend-ai-infra/ai-page-generation-workflow' },
                { text: '07 AI与组件库结合', link: '/practical-guides/frontend-ai-infra/ai-component-library' },
                { text: '08 AI代码质量控制', link: '/practical-guides/frontend-ai-infra/ai-code-quality-control' },
                { text: '09 个人版AI基建', link: '/practical-guides/frontend-ai-infra/personal-frontend-ai-infra' },
                { text: '10 升级路线总结', link: '/practical-guides/frontend-ai-infra/ai-era-frontend-upgrade' }
              ]
            }
          ]
        }
      ],
      '/research/': [
        {
          text: '专题研究',
          items: [
            { text: '索引', link: '/research/' },
            {
              text: '前端动画',
              collapsed: true,
              items: [
                { text: 'CSS transition 与 animation 区别', link: '/research/css-transition-vs-animation' },
                { text: 'DOM动画选型决策', link: '/research/dom-animation-selection' },
                { text: '前端动画技术全景', link: '/research/frontend-animation-overview' },
                { text: '复杂效果背后的算法思维', link: '/research/frontend-algorithm-thinking' },
                { text: 'rAF、Vue更新与浏览器一帧', link: '/research/raf-vue-browser-frame' }
              ]
            },
            {
              text: '工程能力 & 方法论',
              collapsed: true,
              items: [
                { text: '前端知识体系全景', link: '/research/frontend-knowledge-panorama' },
                { text: '代码阅读六视角框架', link: '/research/code-reading-six-perspectives' },
                { text: '异步状态机七步洋葱模型', link: '/research/async-state-machine-onion-model' },
                { text: '并发任务控制器', link: '/research/concurrent-task-controller' },
                { text: '编码前建模方法论', link: '/research/design-document-methodology' }
              ]
            },
            {
              text: '基础设施 & 架构',
              collapsed: true,
              items: [
                { text: '从第一性原理理解 Docker', link: '/research/docker-first-principles' },
                { text: 'AI技术栈三层架构', link: '/research/ai-tech-stack-three-layers' }
              ]
            }
          ]
        }
      ],
      '/opinions/': [
        {
          text: '观点沉淀',
          items: [
            { text: '索引', link: '/opinions/' },
            { text: 'AI 时代程序员协作方法论', link: '/opinions/ai-era-programmer-collaboration' },
            { text: 'AI干活的真相', link: '/opinions/truth-about-ai-work' },
            { text: '提升学习效率的思维技巧', link: '/opinions/learning-efficiency-techniques' }
          ]
        }
      ]
    }
  }
})
