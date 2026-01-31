import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/my-blog/',
  title: 'huige9999的小窝',
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
            { text: '索引', link: '/projects/' }
          ]
        }
      ],
      '/notes/': [
        {
          text: '笔记',
          items: [
            { text: '索引', link: '/notes/' }
          ]
        }
      ],
      '/opinions/': [
        {
          text: '观点',
          items: [
            { text: '索引', link: '/opinions/' }
          ]
        }
      ]
    }
  }
})
