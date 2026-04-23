---
layout: home
title: Theme Mode
titleTemplate: контроллер темы для Nuxt и Vue
description: Theme Mode держит режим темы в Nuxt, переключатель Vue и независимые TypeScript-утилиты согласованными между SSR, гидрацией и клиентом.
hero:
  name: Theme Mode
  text: SSR-безопасное состояние темы для Nuxt и Vue
  tagline: Модуль для Nuxt, примитивы переключателя для Vue и независимые утилиты, которые держат выбранный режим и вычисленную тему раздельно.
  image:
    light: ../screenshots/theme-mode-auto.png
    dark: ../screenshots/theme-mode-auto-dark.png
    alt: Превью Theme Mode в автоматическом режиме
  actions:
    - theme: brand
      text: Установить пакет
      link: '#install'
features:
  - title: SSR-путь для Nuxt
    details: Записывает data-theme, data-theme-mode, color-scheme и CSS-переменные иконок до монтирования Vue.
  - title: Переключатель Vue без разметки
    details: Отдаёт mode, resolvedTheme, nextMode, label и actions, а разметка остаётся в вашем приложении.
  - title: Независимые утилиты
    details: Разбирают настройки, сохраняют режим, вычисляют тему и обновляют DOM-атрибуты из обычного TypeScript.
---

<div class="landing-meta">
  <span>Сохранённый режим остаётся явным: <code>auto</code> хранится как <code>auto</code>, а вычисленная тема следует настройке ОС.</span>
  <span>Импортируйте только ту точку входа Nuxt, Vue или core, которая реально нужна приложению.</span>
</div>

## Установка из GitHub Packages {#install}

Один сценарий: подключите GitHub Packages, установите пакет и импортируйте только ту точку входа, которая реально нужна приложению.

Добавьте реестр GitHub Packages в `.npmrc`:

::: code-group

```ini [.npmrc]
@alyldas:registry=https://npm.pkg.github.com
```

:::

> Для чтения пакета может понадобиться токен с `read:packages`.

Установите пакет:

::: code-group

```sh [terminal]
npm install @alyldas/theme-mode
```

:::

Импортируйте CSS и нужную точку входа:

::: code-group

```ts [theme-mode.ts]
import '@alyldas/theme-mode/style.css'
import '@alyldas/theme-mode/nuxt'
```

:::

## Выберите точку входа

Замените строку импорта выше одной из этих строк:

<EntryPointCards
:items="[
{
path: '@alyldas/theme-mode/nuxt',
title: 'Модуль Nuxt',
bestFor: 'Лучший вариант для Nuxt-приложений, где тема должна быть корректной ещё до гидрации.',
details: 'Добавляет SSR-безопасный сценарий запуска и держит настройки согласованными.',
      importLine: `import '@alyldas/theme-mode/nuxt'`,
},
{
path: '@alyldas/theme-mode/vue',
title: 'Композиционная функция Vue и переключатель',
bestFor: 'Подходит для оболочек приложения, своих кнопок, виджетов и тестов.',
details: 'Используйте общий контроллер или переключатель без собственной разметки внутри вашего интерфейса.',
      importLine: `import '@alyldas/theme-mode/vue'`,
},
{
path: '@alyldas/theme-mode/core',
title: 'Независимые утилиты',
bestFor: 'Подходит для адаптеров, которым нужны только разбор настроек, сохранение режима и DOM-запись.',
details: 'Используйте из обычного TypeScript-кода без Vue.',
      importLine: `import '@alyldas/theme-mode/core'`,
},
]"
/>

## Настройка Nuxt

Начните с одного модуля. Опции добавляйте только тогда, когда нужны свои ключи, атрибуты или CSS-переменные.

::: code-group

```ts [минимальная настройка]
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
})
```

```ts [расширенные опции]
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

:::

## Состояния

<PreviewGallery
  :items="[
    { src: '../screenshots/theme-mode-auto-dark.png', alt: 'Автоматический режим с тёмной темой', caption: 'Авто-режим с тёмной темой' },
    { src: '../screenshots/theme-mode-auto.png', alt: 'Автоматический режим со светлой темой', caption: 'Авто-режим со светлой темой' },
    { src: '../screenshots/theme-mode-dark.png', alt: 'Превью тёмной темы', caption: 'Явная тёмная тема' },
    { src: '../screenshots/theme-mode-light.png', alt: 'Превью светлой темы', caption: 'Явная светлая тема' },
  ]"
/>

Скриншоты выше генерируются из отдельного примера, который закоммичен в репозитории.
