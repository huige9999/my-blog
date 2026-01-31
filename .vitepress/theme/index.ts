import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import RecentTimeline from './components/RecentTimeline.vue'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('RecentTimeline', RecentTimeline)
  }
}
