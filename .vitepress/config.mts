import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '前端架构师成长笔记',
  description: '长期的技术笔记与项目档案：把学到的、做过的、踩过的坑，沉淀成清晰的知识结构。',
  themeConfig: {
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
            { text: '工程化实践', link: '/tutorials/engineering-practice' },
            { text: '教程路线：XXX', link: '/tutorials/xxx-roadmap' }
          ]
        }
      ],
      '/projects/': [
        {
          text: '项目',
          items: [
            { text: '索引', link: '/projects/' },
            { text: '项目复盘：XXX', link: '/projects/project-retro-xxx' },
            { text: '踩坑记录：XXX', link: '/projects/pitfall-xxx' }
          ]
        }
      ],
      '/notes/': [
        {
          text: '笔记',
          items: [
            { text: '索引', link: '/notes/' },
            { text: '博客地图', link: '/notes/blog-map' }
          ]
        }
      ],
      '/opinions/': [
        {
          text: '观点',
          items: [
            { text: '索引', link: '/opinions/' },
            { text: '前端架构师能力清单', link: '/opinions/frontend-architect' }
          ]
        }
      ]
    }
  }
})
