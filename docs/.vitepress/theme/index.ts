import type { Theme } from 'vitepress'
import Landing from './Landing.vue'
import Layout from './Layout.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('Landing', Landing)
  },
} satisfies Theme
