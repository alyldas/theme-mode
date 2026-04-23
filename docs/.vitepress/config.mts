import { defineConfig } from 'vitepress'

const siteUrl = 'https://alyldas.github.io/theme-mode/'
const title = 'Theme Mode - theme controller for Nuxt and Vue'
const description =
  'Theme Mode is a Nuxt-first theme controller with Vue and framework-neutral entry points.'
const previewImage = `${siteUrl}screenshots/theme-mode-auto.png`
const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23191713'/%3E%3Cpath d='M16 20h32v7H36v21h-8V27H16z' fill='%23f7f4ed'/%3E%3C/svg%3E"

const initialThemeScript = `;(() => {
  const modeCycle = ['auto', 'dark', 'light']
  const root = document.documentElement
  let mode = 'auto'

  try {
    const storedMode = window.localStorage.getItem('theme')
    mode = modeCycle.includes(storedMode) ? storedMode : 'auto'
  } catch {}

  let prefersDark = false

  try {
    prefersDark = Boolean(window.matchMedia?.('(prefers-color-scheme: dark)')?.matches)
  } catch {}

  const resolvedTheme = mode === 'dark' || (mode === 'auto' && prefersDark) ? 'dark' : 'light'

  root.dataset.theme = resolvedTheme
  root.dataset.themeMode = mode
  root.style.colorScheme = resolvedTheme

  for (const themeMode of modeCycle) {
    root.style.setProperty(
      \`--theme-mode-\${themeMode}-icon-display\`,
      mode === themeMode ? 'inline-flex' : 'none',
    )
  }
})()`

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://github.com/alyldas#person',
      name: 'alyldas',
      url: 'https://github.com/alyldas',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'Theme Mode',
      description,
      inLanguage: ['en', 'ru'],
      sameAs: ['https://github.com/alyldas/theme-mode'],
      publisher: {
        '@id': 'https://github.com/alyldas#person',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}#webpage`,
      url: siteUrl,
      name: title,
      description:
        'A landing page for @alyldas/theme-mode, a Nuxt-first theme controller for automatic, dark, and light modes.',
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
      about: {
        '@id': `${siteUrl}#software`,
      },
      image: {
        '@type': 'ImageObject',
        url: previewImage,
        width: 1280,
        height: 760,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: previewImage,
        width: 1280,
        height: 760,
      },
      thumbnailUrl: previewImage,
      inLanguage: ['en', 'ru'],
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${siteUrl}#software`,
      name: '@alyldas/theme-mode',
      alternateName: 'Theme Mode',
      description:
        'Nuxt-first color mode controller with Vue and core entry points.',
      url: siteUrl,
      codeRepository: 'https://github.com/alyldas/theme-mode',
      programmingLanguage: 'TypeScript',
      runtimePlatform: ['Nuxt', 'Vue', 'JavaScript'],
      license: 'https://github.com/alyldas/theme-mode/blob/master/LICENSE',
      version: '1.0.1',
      isAccessibleForFree: true,
      sameAs: ['https://github.com/alyldas/theme-mode'],
      author: {
        '@id': 'https://github.com/alyldas#person',
      },
      keywords: [
        'theme mode',
        'color mode',
        'dark mode',
        'Nuxt',
        'Vue',
        'SSR',
        'TypeScript',
      ],
    },
  ],
}

export default defineConfig({
  title: 'Theme Mode',
  description,
  lang: 'en',
  base: '/theme-mode/',
  appearance: false,
  cleanUrls: false,
  outDir: './.vitepress/dist',
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content:
          'theme mode, color mode, dark mode, Nuxt color mode, Vue dark mode, SSR theme, hydration, anti flash theme, TypeScript, GitHub Packages',
      },
    ],
    ['meta', { name: 'author', content: 'alyldas' }],
    [
      'meta',
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    ],
    ['meta', { name: 'application-name', content: 'Theme Mode' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Theme Mode' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#f7f4ed',
        media: '(prefers-color-scheme: light)',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#16171a',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    ['link', { rel: 'canonical', href: siteUrl }],
    ['link', { rel: 'icon', href: favicon }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Theme Mode' }],
    ['meta', { property: 'og:title', content: title }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Nuxt-first theme controller for automatic, dark, and light modes with Vue and framework-neutral entry points.',
      },
    ],
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
    ['meta', { name: 'twitter:url', content: siteUrl }],
    ['meta', { name: 'twitter:title', content: title }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'Nuxt-first theme controller for automatic, dark, and light modes with Vue and framework-neutral entry points.',
      },
    ],
    ['meta', { name: 'twitter:image', content: previewImage }],
    [
      'meta',
      {
        name: 'twitter:image:alt',
        content: 'Theme Mode automatic theme preview',
      },
    ],
    ['script', {}, initialThemeScript],
    ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
  ],
})
