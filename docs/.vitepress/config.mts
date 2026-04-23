import { defineConfig } from 'vitepress'

const siteUrl = 'https://alyldas.github.io/theme-mode/'
const previewImage = `${siteUrl}screenshots/theme-mode-auto.png`
const title = 'Theme Mode - Nuxt and Vue theme controller'
const description =
  'Theme Mode keeps Nuxt color mode, Vue toggles, and framework-neutral helpers aligned across SSR, hydration, and client updates.'
const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23181713'/%3E%3Cpath d='M16 20h32v7H36v21h-8V27H16z' fill='%23fff'/%3E%3C/svg%3E"

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: '@alyldas/theme-mode',
  alternateName: 'Theme Mode',
  description,
  url: siteUrl,
  codeRepository: 'https://github.com/alyldas/theme-mode',
  image: previewImage,
  isAccessibleForFree: true,
  keywords:
    'theme mode, color mode, dark mode, Nuxt, Vue, SSR, hydration, TypeScript',
  license: 'https://github.com/alyldas/theme-mode/blob/master/LICENSE',
  programmingLanguage: 'TypeScript',
  runtimePlatform: ['Nuxt', 'Vue', 'JavaScript'],
  version: '1.0.1',
}

export default defineConfig({
  title: 'Theme Mode',
  description,
  lang: 'en',
  base: '/theme-mode/',
  appearance: true,
  cleanUrls: false,
  outDir: './.vitepress/dist',
  sitemap: {
    hostname: siteUrl,
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Theme Mode',
      description,
      themeConfig: {
        darkModeSwitchLabel: 'Appearance',
        darkModeSwitchTitle: 'Switch to dark theme',
        docFooter: {
          next: false,
          prev: false,
        },
        footer: {
          message: 'Theme controller for Nuxt, Vue, and plain TypeScript.',
          copyright: 'MIT Licensed.',
        },
        lightModeSwitchTitle: 'Switch to light theme',
        outline: false,
        returnToTopLabel: 'Return to top',
        sidebar: false,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/alyldas/theme-mode' },
        ],
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru-RU',
      title: 'Theme Mode',
      description:
        'Theme Mode держит режим темы в Nuxt, переключатель Vue и независимые TypeScript-утилиты согласованными между SSR, гидрацией и клиентом.',
      themeConfig: {
        darkModeSwitchLabel: 'Тема',
        darkModeSwitchTitle: 'Переключить на тёмную тему',
        docFooter: {
          next: false,
          prev: false,
        },
        footer: {
          message: 'Контроллер темы для Nuxt, Vue и TypeScript.',
          copyright: 'Лицензия MIT.',
        },
        lightModeSwitchTitle: 'Переключить на светлую тему',
        outline: false,
        returnToTopLabel: 'Вернуться наверх',
        sidebar: false,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/alyldas/theme-mode' },
        ],
      },
    },
  },
  themeConfig: {
    logo: favicon,
  },
  head: [
    ['link', { rel: 'icon', href: favicon }],
    ['link', { rel: 'canonical', href: siteUrl }],
    ['link', { rel: 'alternate', hreflang: 'en', href: siteUrl }],
    ['link', { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}ru/` }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: siteUrl }],
    ['meta', { name: 'author', content: 'alyldas' }],
    ['meta', { name: 'application-name', content: 'Theme Mode' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Theme Mode' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'theme mode, color mode, dark mode, Nuxt color mode, Vue dark mode, SSR theme, hydration, anti flash theme, TypeScript, GitHub Packages',
      },
    ],
    [
      'meta',
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff',
        media: '(prefers-color-scheme: light)',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#1b1b1f',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Theme Mode' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'ru_RU' }],
    ['meta', { property: 'og:image', content: previewImage }],
    ['meta', { property: 'og:image:secure_url', content: previewImage }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '760' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Theme Mode automatic theme preview',
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: previewImage }],
    [
      'meta',
      {
        name: 'twitter:image:alt',
        content: 'Theme Mode automatic theme preview',
      },
    ],
    ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
  ],
})
