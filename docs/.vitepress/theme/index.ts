import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import PreviewGallery from './PreviewGallery.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(context) {
    context.app.component('PreviewGallery', PreviewGallery)
  },
} satisfies Theme
