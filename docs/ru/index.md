---
layout: home
title: Theme Mode
titleTemplate: контроллер темы для Nuxt и Vue
description: Theme Mode делает авто-, тёмную и светлую тему предсказуемыми в Nuxt SSR, Vue-гидрации и TypeScript-утилитах.
hero:
  name: Theme Mode
  text: Тема без сюрпризов
  tagline: Небольшой пакет для Nuxt, Vue и независимого TypeScript-кода, где выбранный режим и вычисленная тема хранятся отдельно.
  image:
    light: ../screenshots/theme-mode-auto.png
    dark: ../screenshots/theme-mode-auto-dark.png
    alt: Превью Theme Mode в автоматическом режиме
  actions:
    - theme: brand
      text: Установить пакет
      link: '#install'
    - theme: alt
      text: Открыть демо
      link: ../demo.html
features:
  - title: Nuxt-first SSR
    details: Записывает data-theme, data-theme-mode, color-scheme и CSS-переменные иконок до монтирования Vue.
  - title: Renderless Vue toggle
    details: Отдаёт mode, resolvedTheme, nextMode, label и actions, а разметка остаётся в вашем приложении.
  - title: Core helpers
    details: Разбирают настройки, сохраняют режим, вычисляют тему и обновляют DOM-атрибуты из обычного TypeScript.
---

<div class="landing-meta">
  <span>Автоматический режим остаётся явным: в хранилище лежит <code>auto</code>, а вычисленная тема следует настройке ОС.</span>
  <span>В v1 нет корневого экспорта: импортируйте только нужную точку входа для Nuxt, Vue или core.</span>
  <span>Скриншоты ниже генерируются из той же статической демо-страницы, что используется в README.</span>
</div>

## Установка из GitHub Packages {#install}

Создайте `.npmrc` и добавьте реестр GitHub Packages:

::: code-group

```ini [.npmrc]
@alyldas:registry=https://npm.pkg.github.com
```

:::

Установите пакет из терминала:

::: code-group

```sh [terminal]
npm install @alyldas/theme-mode
```

:::

Импортируйте CSS и точку входа для слоя приложения:

::: code-group

```ts [theme-mode.ts]
import '@alyldas/theme-mode/style.css'
import '@alyldas/theme-mode/nuxt'
```

:::

## Выберите точку входа

| Точка входа                | Для чего нужна                                                        |
| -------------------------- | --------------------------------------------------------------------- |
| `@alyldas/theme-mode/nuxt` | Nuxt-приложения, где тема нужна до гидрации                           |
| `@alyldas/theme-mode/vue`  | Vue-оболочки, свои кнопки, встроенные виджеты и тесты                 |
| `@alyldas/theme-mode/core` | Независимые адаптеры, которым нужны только настройки, хранилище и DOM |

## Настройка Nuxt

```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: {
    // До монтирования Vue
    defaultMode: 'auto',
    fallbackTheme: 'dark', // color-scheme: нативные элементы браузера
    attribute: 'data-theme', // data-theme: light | dark
    modeAttribute: 'data-theme-mode', // data-theme-mode: auto | dark | light
    cssVariablePrefix: 'theme-mode', // --theme-mode-*: состояние переключателя
    storageKey: 'theme',
  },
})
```

## Состояния

<PreviewGallery
  :items="[
    { src: '../screenshots/theme-mode-auto-dark.png', alt: 'Автоматический режим с тёмной темой' },
    { src: '../screenshots/theme-mode-auto.png', alt: 'Автоматический режим со светлой темой' },
    { src: '../screenshots/theme-mode-dark.png', alt: 'Превью тёмной темы' },
    { src: '../screenshots/theme-mode-light.png', alt: 'Превью светлой темы' },
  ]"
/>

Откройте статическое превью в [demo.html](../demo.html).
