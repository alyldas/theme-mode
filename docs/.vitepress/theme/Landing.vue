<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

type Language = 'en' | 'ru'
type Mode = 'auto' | 'dark' | 'light'
type ResolvedTheme = 'dark' | 'light'

const modeCycle: Mode[] = ['auto', 'dark', 'light']
const themeStorageKey = 'theme'
const languageStorageKey = 'lang'

const translations = {
  en: {
    brandLabel: 'Theme Mode home',
    demoAction: 'Open demo',
    demoLead:
      'The README screenshots are generated from the same static demo page: auto has separate light and dark resolved previews.',
    demoTitle: 'Three modes, four previews',
    documentDescription:
      'Theme Mode is a Nuxt-first theme controller with Vue and framework-neutral entry points.',
    documentTitle: 'Theme Mode - theme controller for Nuxt and Vue',
    entryCoreText:
      'Normalize options, resolve the active theme, persist mode, and write document attributes.',
    entryCoreTitle: 'Core utilities',
    entryNuxtText:
      'Register the module and configure storage, DOM attributes, CSS variable prefix, fallback theme, and cycle order.',
    entryNuxtTitle: 'Nuxt module',
    entryVueText:
      'Use a shared document controller or create isolated controllers for tests and embedded widgets.',
    entryVueTitle: 'Vue composable and renderless toggle',
    eyebrow: 'Nuxt-first color mode',
    featureCoreText:
      'Framework-neutral helpers parse options, persist mode, cycle state, and update the DOM in tests or custom adapters.',
    featureCoreTitle: 'Core utilities',
    featureNuxtText:
      'The module injects an early head script and starts the client controller with the same normalized options.',
    featureNuxtTitle: 'Nuxt script without flash',
    featureVueText:
      'The slot exposes mode, resolvedTheme, nextMode, label, and actions while your app keeps control of markup and accessibility.',
    featureVueTitle: 'Renderless Vue toggle',
    featuresLead:
      'Theme Mode keeps the stored mode separate from the resolved theme, so auto mode stays predictable through SSR and hydration.',
    featuresTitle:
      'For app shells that need the right theme on the first frame',
    footerDemo: 'Demo',
    footerIssues: 'Issues',
    footerLicense: 'MIT License',
    footerLinksLabel: 'Footer links',
    footerText:
      'Nuxt-first color mode controller with Vue and framework-neutral entry points.',
    heroLead:
      'A small controller for automatic, dark, and light themes with Nuxt anti-flash setup, a renderless Vue toggle, and framework-neutral helpers.',
    heroTitle: 'Theme control without the flash',
    installCommandTitle: 'Install package',
    installImportTitle: 'Import entry point',
    installLead:
      'Add the GitHub Packages registry for @alyldas, install the package, then import the entry point your app uses.',
    installRegistryTitle: 'Registry',
    installTitle: 'Install from GitHub Packages',
    layersAriaLabel: 'Theme Mode entry points',
    layersLead:
      'Import only the entry point your app needs. Nuxt apps usually start with the module.',
    layersTitle: 'Choose an entry point',
    languageToggleLabel: 'Switch language to Russian',
    modeAuto: 'Auto',
    modeButtonsLabel: 'Theme mode preview controls',
    modeDark: 'Dark',
    modeLight: 'Light',
    previewAriaLabel: 'Theme mode preview',
    previewText:
      'Switch the preview between auto, dark, and light to see what the package writes to the document.',
    previewTitle: 'Live document state',
    primaryAction: 'Install package',
    shotAutoDark: 'Auto / dark',
    shotAutoDarkAlt: 'Auto mode with dark resolved theme preview',
    shotAutoLight: 'Auto / light',
    shotAutoLightAlt: 'Auto mode with light resolved theme preview',
    shotDark: 'Dark theme',
    shotDarkAlt: 'Dark theme preview',
    shotLight: 'Light theme',
    shotLightAlt: 'Light theme preview',
    ssrCodeLabel: 'Minimal setup',
    ssrLead:
      'The Nuxt module writes `data-theme`, `data-theme-mode`, `color-scheme`, and icon CSS variables before Vue takes over.',
    ssrTitle: 'SSR state stays aligned with hydration',
    themeToggleAutoLabel: 'Switch to automatic page theme',
    themeToggleDarkLabel: 'Switch to dark page theme',
    themeToggleLightLabel: 'Switch to light page theme',
  },
  ru: {
    brandLabel: 'Главная страница Theme Mode',
    demoAction: 'Открыть демо',
    demoLead:
      'Скриншоты для README берутся из этой же статической демо-страницы: у авто-режима есть отдельные превью для светлой и тёмной темы.',
    demoTitle: 'Три режима, четыре превью',
    documentDescription:
      'Theme Mode управляет темой в Nuxt, Vue и независимых утилитах.',
    documentTitle: 'Theme Mode — управление темой для Nuxt и Vue',
    entryCoreText:
      'Нормализуют настройки, определяют активную тему, сохраняют режим и записывают атрибуты документа.',
    entryCoreTitle: 'Независимые утилиты',
    entryNuxtText:
      'Подключает модуль и настраивает хранилище, DOM-атрибуты, префикс CSS-переменных, резервную тему и порядок переключения.',
    entryNuxtTitle: 'Модуль Nuxt',
    entryVueText:
      'Используйте общий контроллер документа или создавайте изолированные контроллеры для тестов и встроенных виджетов.',
    entryVueTitle: 'Vue-композабл и переключатель',
    eyebrow: 'Управление темой для Nuxt',
    featureCoreText:
      'Независимые утилиты разбирают настройки, сохраняют режим, переключают состояние и обновляют DOM в тестах или пользовательских адаптерах.',
    featureCoreTitle: 'Независимые утилиты',
    featureNuxtText:
      'Модуль добавляет ранний скрипт в head и запускает клиентский контроллер с теми же нормализованными настройками.',
    featureNuxtTitle: 'Nuxt-скрипт без мигания темы',
    featureVueText:
      'Слот предоставляет режим, вычисленную тему, следующий режим, подпись и действия, а разметка и доступность остаются в вашем приложении.',
    featureVueTitle: 'Vue-переключатель без своей разметки',
    featuresLead:
      'Theme Mode хранит выбранный режим отдельно от вычисленной темы, поэтому авто-режим остаётся предсказуемым при SSR и гидрации.',
    featuresTitle:
      'Для оболочек приложений, где правильная тема нужна с первого кадра',
    footerDemo: 'Демо',
    footerIssues: 'Задачи',
    footerLicense: 'Лицензия MIT',
    footerLinksLabel: 'Ссылки в подвале',
    footerText: 'Контроллер темы для Nuxt, Vue и независимых утилит.',
    heroLead:
      'Небольшой контроллер для авто-, тёмной и светлой темы: настройка Nuxt без мигания, Vue-переключатель без своей разметки и независимые утилиты.',
    heroTitle: 'Управление темой без мигания',
    installCommandTitle: 'Установка',
    installImportTitle: 'Импорт',
    installLead:
      'Добавьте реестр GitHub Packages для @alyldas, установите пакет и подключите нужную точку входа.',
    installRegistryTitle: 'Реестр',
    installTitle: 'Установка из GitHub Packages',
    layersAriaLabel: 'Точки входа Theme Mode',
    layersLead:
      'Подключайте только ту точку входа, которая нужна приложению. В Nuxt обычно начинают с модуля.',
    layersTitle: 'Выберите точку входа',
    languageToggleLabel: 'Переключить язык на английский',
    modeAuto: 'Авто',
    modeButtonsLabel: 'Кнопки режима предпросмотра',
    modeDark: 'Тёмная',
    modeLight: 'Светлая',
    previewAriaLabel: 'Предпросмотр Theme Mode',
    previewText:
      'Переключайте предпросмотр между авто-, тёмной и светлой темой и смотрите, что пакет записывает в документ.',
    previewTitle: 'Состояние документа',
    primaryAction: 'Установить пакет',
    shotAutoDark: 'Авто / тёмная',
    shotAutoDarkAlt: 'Предпросмотр авто-режима с тёмной темой',
    shotAutoLight: 'Авто / светлая',
    shotAutoLightAlt: 'Предпросмотр авто-режима со светлой темой',
    shotDark: 'Тёмная тема',
    shotDarkAlt: 'Предпросмотр тёмной темы',
    shotLight: 'Светлая тема',
    shotLightAlt: 'Предпросмотр светлой темы',
    ssrCodeLabel: 'Минимальная настройка',
    ssrLead:
      'Модуль Nuxt записывает `data-theme`, `data-theme-mode`, `color-scheme` и CSS-переменные иконок до запуска Vue.',
    ssrTitle: 'SSR-состояние совпадает с гидрацией',
    themeToggleAutoLabel: 'Переключить на автоматическую тему страницы',
    themeToggleDarkLabel: 'Переключить на тёмную тему страницы',
    themeToggleLightLabel: 'Переключить на светлую тему страницы',
  },
} as const

const modeLabels = {
  en: {
    auto: 'auto',
    dark: 'dark',
    light: 'light',
  },
  ru: {
    auto: 'авто',
    dark: 'тёмная',
    light: 'светлая',
  },
} as const

const currentLanguage = ref<Language>('en')
const currentMode = ref<Mode>('auto')
const resolvedTheme = ref<ResolvedTheme>('light')
let preferredThemeQuery: MediaQueryList | null = null

const t = computed(() => translations[currentLanguage.value])
const activeModeLabels = computed(() => modeLabels[currentLanguage.value])
const modeOutput = computed(
  () =>
    `${activeModeLabels.value[currentMode.value]} / ${activeModeLabels.value[resolvedTheme.value]}`,
)
const nextMode = computed(() => {
  const currentIndex = modeCycle.indexOf(currentMode.value)

  return modeCycle[(currentIndex + 1) % modeCycle.length] || modeCycle[0]
})
const themeToggleLabel = computed(
  () =>
    ({
      auto: t.value.themeToggleAutoLabel,
      dark: t.value.themeToggleDarkLabel,
      light: t.value.themeToggleLightLabel,
    })[nextMode.value],
)
const previewImage = computed(() => {
  if (currentMode.value === 'auto') {
    return withBase(
      resolvedTheme.value === 'dark'
        ? '/screenshots/theme-mode-auto-dark.png'
        : '/screenshots/theme-mode-auto.png',
    )
  }

  return withBase(`/screenshots/theme-mode-${currentMode.value}.png`)
})
const previewAlt = computed(() => {
  if (currentMode.value === 'auto') {
    return resolvedTheme.value === 'dark'
      ? t.value.shotAutoDarkAlt
      : t.value.shotAutoLightAlt
  }

  return currentMode.value === 'dark'
    ? t.value.shotDarkAlt
    : t.value.shotLightAlt
})
const backgroundStyle = computed<Record<string, string>>(() => ({
  '--bg-light-image': `url("${withBase('/screenshots/theme-mode-auto.png')}")`,
  '--bg-dark-image': `url("${withBase('/screenshots/theme-mode-dark.png')}")`,
}))
const demoHref = computed(() => withBase('/demo.html'))
const screenshots = computed(() => [
  {
    alt: t.value.shotAutoLightAlt,
    label: t.value.shotAutoLight,
    src: withBase('/screenshots/theme-mode-auto.png'),
  },
  {
    alt: t.value.shotAutoDarkAlt,
    label: t.value.shotAutoDark,
    src: withBase('/screenshots/theme-mode-auto-dark.png'),
  },
  {
    alt: t.value.shotDarkAlt,
    label: t.value.shotDark,
    src: withBase('/screenshots/theme-mode-dark.png'),
  },
  {
    alt: t.value.shotLightAlt,
    label: t.value.shotLight,
    src: withBase('/screenshots/theme-mode-light.png'),
  },
])
const entryPoints = computed(() => [
  {
    id: 'nuxt',
    name: '@alyldas/theme-mode/nuxt',
    text: t.value.entryNuxtText,
    title: t.value.entryNuxtTitle,
  },
  {
    id: 'vue',
    name: '@alyldas/theme-mode/vue',
    text: t.value.entryVueText,
    title: t.value.entryVueTitle,
  },
  {
    id: 'core',
    name: '@alyldas/theme-mode/core',
    text: t.value.entryCoreText,
    title: t.value.entryCoreTitle,
  },
])

const isLanguage = (language: string | null): language is Language =>
  language === 'en' || language === 'ru'
const isMode = (mode: string | null): mode is Mode =>
  mode === 'auto' || mode === 'dark' || mode === 'light'

const readStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {}
}

const resolveBrowserLanguage = (): Language => {
  const browserLanguages =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]

  return browserLanguages.some((language) =>
    String(language).toLowerCase().startsWith('ru'),
  )
    ? 'ru'
    : 'en'
}

const getPreferredTheme = (): ResolvedTheme => {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

const resolveTheme = (mode: Mode): ResolvedTheme =>
  mode === 'auto' ? getPreferredTheme() : mode === 'dark' ? 'dark' : 'light'

const syncDocumentLanguage = (persist = false) => {
  document.documentElement.lang = currentLanguage.value
  document.title = t.value.documentTitle
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t.value.documentDescription)

  if (persist) {
    writeStorage(languageStorageKey, currentLanguage.value)
  }
}

const syncDocumentMode = (persist = false) => {
  resolvedTheme.value = resolveTheme(currentMode.value)

  const root = document.documentElement
  root.dataset.theme = resolvedTheme.value
  root.dataset.themeMode = currentMode.value
  root.style.colorScheme = resolvedTheme.value

  for (const mode of modeCycle) {
    root.style.setProperty(
      `--theme-mode-${mode}-icon-display`,
      currentMode.value === mode ? 'inline-flex' : 'none',
    )
  }

  if (persist) {
    writeStorage(themeStorageKey, currentMode.value)
  }
}

const setLanguage = (language: Language, persist = false) => {
  currentLanguage.value = language
  syncDocumentLanguage(persist)
}

const setMode = (mode: Mode, persist = false) => {
  currentMode.value = mode
  syncDocumentMode(persist)
}

const refreshAutoTheme = () => {
  if (currentMode.value === 'auto') {
    syncDocumentMode()
  }
}

onMounted(() => {
  const storedLanguage = readStorage(languageStorageKey)
  const storedMode = readStorage(themeStorageKey)

  currentLanguage.value = isLanguage(storedLanguage)
    ? storedLanguage
    : resolveBrowserLanguage()
  currentMode.value = isMode(storedMode) ? storedMode : 'auto'

  syncDocumentLanguage()
  syncDocumentMode()

  try {
    preferredThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    preferredThemeQuery.addEventListener('change', refreshAutoTheme)
  } catch {}
})

onBeforeUnmount(() => {
  preferredThemeQuery?.removeEventListener('change', refreshAutoTheme)
})
</script>

<template>
  <div id="top" class="landing" :style="backgroundStyle">
    <div class="site-background-dark" aria-hidden="true"></div>
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="#top" :aria-label="t.brandLabel">
          <span class="brand-mark" aria-hidden="true">TM</span>
          <span>@alyldas/theme-mode</span>
        </a>

        <div class="toolbar">
          <button
            class="cycle-button"
            type="button"
            :aria-label="t.languageToggleLabel"
            :title="t.languageToggleLabel"
            @click="setLanguage(currentLanguage === 'en' ? 'ru' : 'en', true)"
          >
            <span class="cycle-button__current">
              {{ currentLanguage.toUpperCase() }}
            </span>
          </button>

          <button
            class="theme-mode-toggle"
            type="button"
            :aria-label="themeToggleLabel"
            :title="themeToggleLabel"
            @click="setMode(nextMode, true)"
          >
            <span class="sr-only">{{ themeToggleLabel }}</span>
            <span
              v-if="currentMode === 'auto'"
              class="theme-mode-toggle__icon theme-mode-toggle__icon--auto"
              aria-hidden="true"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </span>
            <span
              v-else-if="currentMode === 'dark'"
              class="theme-mode-toggle__icon"
              aria-hidden="true"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </span>
            <span v-else class="theme-mode-toggle__icon" aria-hidden="true">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-inner">
          <div class="hero-copy">
            <p class="eyebrow">{{ t.eyebrow }}</p>
            <h1 id="hero-title">{{ t.heroTitle }}</h1>
            <p class="lead">{{ t.heroLead }}</p>

            <div class="actions">
              <a class="button button-primary" href="#install">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
                <span>{{ t.primaryAction }}</span>
              </a>
              <a class="button button-secondary" :href="demoHref">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  />
                </svg>
                <span>{{ t.demoAction }}</span>
              </a>
            </div>
          </div>

          <aside class="hero-panel" :aria-label="t.previewAriaLabel">
            <div class="browser-bar" aria-hidden="true">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>

            <div class="preview-shell">
              <img
                class="preview-image"
                :src="previewImage"
                :alt="previewAlt"
              />

              <div class="mode-panel">
                <div class="mode-row">
                  <h2 class="mode-title">{{ t.previewTitle }}</h2>
                  <code>{{ modeOutput }}</code>
                </div>

                <p class="mode-description">{{ t.previewText }}</p>

                <div class="mode-buttons" :aria-label="t.modeButtonsLabel">
                  <button
                    v-for="mode in modeCycle"
                    :key="mode"
                    class="mode-button"
                    :class="{ 'is-active': currentMode === mode }"
                    type="button"
                    :aria-pressed="String(currentMode === mode)"
                    @click="setMode(mode, true)"
                  >
                    {{
                      {
                        auto: t.modeAuto,
                        dark: t.modeDark,
                        light: t.modeLight,
                      }[mode]
                    }}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="section" aria-labelledby="features-title">
        <div class="section-inner">
          <div class="section-heading">
            <h2 id="features-title">{{ t.featuresTitle }}</h2>
            <p class="section-text">{{ t.featuresLead }}</p>
          </div>

          <div class="feature-grid">
            <article class="feature-card">
              <div class="feature-card__head">
                <span class="feature-icon" aria-hidden="true">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 5h16M4 12h16M4 19h10"
                    />
                  </svg>
                </span>
                <h3>{{ t.featureNuxtTitle }}</h3>
              </div>
              <p>{{ t.featureNuxtText }}</p>
            </article>

            <article class="feature-card">
              <div class="feature-card__head">
                <span class="feature-icon" aria-hidden="true">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7h8m-9 5h10m-7 5h4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    />
                  </svg>
                </span>
                <h3>{{ t.featureVueTitle }}</h3>
              </div>
              <p>{{ t.featureVueText }}</p>
            </article>

            <article class="feature-card">
              <div class="feature-card__head">
                <span class="feature-icon" aria-hidden="true">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7 8 3 12l4 4m10-8 4 4-4 4M14 4l-4 16"
                    />
                  </svg>
                </span>
                <h3>{{ t.featureCoreTitle }}</h3>
              </div>
              <p>{{ t.featureCoreText }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="install" class="section" aria-labelledby="install-title">
        <div class="section-inner">
          <div class="section-heading">
            <h2 id="install-title">{{ t.installTitle }}</h2>
            <p class="section-text">{{ t.installLead }}</p>
          </div>

          <div class="install-layout">
            <div class="install-steps">
              <div class="code-block">
                <div class="code-title">
                  <span>{{ t.installRegistryTitle }}</span>
                  <span>.npmrc</span>
                </div>
                <div class="code-body"><slot name="registry" /></div>
              </div>

              <div class="code-block">
                <div class="code-title">
                  <span>{{ t.installCommandTitle }}</span>
                  <span>terminal</span>
                </div>
                <div class="code-body"><slot name="install" /></div>
              </div>

              <div class="code-block">
                <div class="code-title">
                  <span>{{ t.installImportTitle }}</span>
                  <span>theme-mode.ts</span>
                </div>
                <div class="code-body"><slot name="imports" /></div>
              </div>
            </div>

            <aside class="layer-panel" :aria-label="t.layersAriaLabel">
              <div class="layer-heading">
                <h3>{{ t.layersTitle }}</h3>
                <p>{{ t.layersLead }}</p>
              </div>

              <div>
                <article
                  v-for="entry in entryPoints"
                  :key="entry.id"
                  class="entry"
                >
                  <code>{{ entry.name }}</code>
                  <h3>{{ entry.title }}</h3>
                  <p>{{ entry.text }}</p>
                </article>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="ssr-title">
        <div class="section-inner">
          <div class="section-heading">
            <h2 id="ssr-title">{{ t.ssrTitle }}</h2>
            <p class="section-text">{{ t.ssrLead }}</p>
          </div>

          <div class="code-block ssr-code">
            <div class="code-title">
              <span>nuxt.config.ts</span>
              <span>{{ t.ssrCodeLabel }}</span>
            </div>
            <div class="code-body">
              <div v-show="currentLanguage === 'en'">
                <slot name="ssr-en" />
              </div>
              <div v-show="currentLanguage === 'ru'">
                <slot name="ssr-ru" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="demo-title">
        <div class="section-inner">
          <div class="section-heading">
            <h2 id="demo-title">{{ t.demoTitle }}</h2>
            <p class="section-text">{{ t.demoLead }}</p>
          </div>

          <div class="demo-strip">
            <figure v-for="shot in screenshots" :key="shot.src" class="shot">
              <img :src="shot.src" :alt="shot.alt" />
              <figcaption>{{ shot.label }}</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <span class="site-footer__name">@alyldas/theme-mode</span>
          <p class="site-footer__text">{{ t.footerText }}</p>
        </div>

        <nav class="site-footer__links" :aria-label="t.footerLinksLabel">
          <a class="site-footer__link" :href="demoHref">{{ t.footerDemo }}</a>
          <a
            class="site-footer__link"
            href="https://github.com/alyldas/theme-mode"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
              />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub</span>
          </a>
          <a
            class="site-footer__link"
            href="https://github.com/alyldas/theme-mode/issues"
          >
            {{ t.footerIssues }}
          </a>
          <a
            class="site-footer__link site-footer__meta"
            href="https://github.com/alyldas/theme-mode/blob/master/LICENSE"
          >
            {{ t.footerLicense }}
          </a>
        </nav>
      </div>
    </footer>
  </div>
</template>
