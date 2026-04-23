---
title: Theme Mode - theme controller for Nuxt and Vue
description: Theme Mode is a Nuxt-first theme controller with Vue and framework-neutral entry points.
---

<Landing>
  <template #registry>

```ini
@alyldas:registry=https://npm.pkg.github.com
```

  </template>

<template #install>

```sh
npm install @alyldas/theme-mode
```

  </template>

<template #imports>

```ts
import '@alyldas/theme-mode/style.css'
import '@alyldas/theme-mode/nuxt'
```

  </template>

<template #ssr-en>

<!-- prettier-ignore -->
```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: { // Before Vue mounts
    defaultMode: 'auto',
    fallbackTheme: 'dark', // color-scheme: native controls
    attribute: 'data-theme', // data-theme: light | dark
    modeAttribute: 'data-theme-mode', // data-theme-mode: auto | dark | light
    cssVariablePrefix: 'theme-mode', // --theme-mode-*: toggle state
    storageKey: 'theme',
  },
})
```

  </template>

<template #ssr-ru>

<!-- prettier-ignore -->
```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: { // До монтирования Vue
    defaultMode: 'auto',
    fallbackTheme: 'dark', // color-scheme: нативные элементы браузера
    attribute: 'data-theme', // data-theme: light | dark
    modeAttribute: 'data-theme-mode', // data-theme-mode: auto | dark | light
    cssVariablePrefix: 'theme-mode', // --theme-mode-*: состояние переключателя
    storageKey: 'theme',
  },
})
```

  </template>
</Landing>
