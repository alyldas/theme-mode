import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import EntryPointCards from './EntryPointCards.vue'
import PreviewGallery from './PreviewGallery.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(context) {
    context.app.component('EntryPointCards', EntryPointCards)
    context.app.component('PreviewGallery', PreviewGallery)
  },
} satisfies Theme
