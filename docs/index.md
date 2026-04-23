---
layout: home
title: Theme Mode
titleTemplate: Nuxt and Vue theme controller
description: Theme Mode keeps automatic, dark, and light themes predictable across Nuxt SSR, Vue hydration, and plain TypeScript helpers.
hero:
  name: Theme Mode
  text: Theme state without surprises
  tagline: A tiny package for Nuxt, Vue, and framework-neutral code that keeps selected mode and resolved theme separate.
  image:
    light: ./screenshots/theme-mode-auto.png
    dark: ./screenshots/theme-mode-auto-dark.png
    alt: Theme Mode automatic theme preview
  actions:
    - theme: brand
      text: Install package
      link: '#install'
features:
  - title: Nuxt-first SSR
    details: Writes data-theme, data-theme-mode, color-scheme, and icon CSS variables before Vue mounts.
  - title: Renderless Vue toggle
    details: Exposes mode, resolvedTheme, nextMode, label, and actions while your app owns the markup.
  - title: Core helpers
    details: Parse options, persist mode, resolve preference, and update DOM attributes from plain TypeScript.
---

<div class="landing-meta">
  <span>Automatic mode stays explicit: stored mode remains <code>auto</code>, resolved theme follows the OS.</span>
  <span>No root export in v1: import only the Nuxt, Vue, or core entry point your app needs.</span>
  <span>The preview images below are generated from the committed screenshot source used by README.</span>
</div>

## Install from GitHub Packages {#install}

Create `.npmrc` and add the GitHub Packages registry:

::: code-group

```ini [.npmrc]
@alyldas:registry=https://npm.pkg.github.com
```

:::

Install the package from the terminal:

::: code-group

```sh [terminal]
npm install @alyldas/theme-mode
```

:::

Import the CSS and the entry point for your app layer:

::: code-group

```ts [theme-mode.ts]
import '@alyldas/theme-mode/style.css'
import '@alyldas/theme-mode/nuxt'
```

:::

## Choose an entry point

| Entry point                | Use it for                                                                      |
| -------------------------- | ------------------------------------------------------------------------------- |
| `@alyldas/theme-mode/nuxt` | Nuxt apps that need SSR-safe theme state before hydration                       |
| `@alyldas/theme-mode/vue`  | Vue app shells, custom buttons, embedded widgets, and tests                     |
| `@alyldas/theme-mode/core` | Framework-neutral adapters that only need parsing, persistence, and DOM helpers |

## Nuxt setup

```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: {
    // Before Vue mounts
    defaultMode: 'auto',
    fallbackTheme: 'dark', // color-scheme: native controls
    attribute: 'data-theme', // data-theme: light | dark
    modeAttribute: 'data-theme-mode', // data-theme-mode: auto | dark | light
    cssVariablePrefix: 'theme-mode', // --theme-mode-*: toggle state
    storageKey: 'theme',
  },
})
```

## Preview states

<PreviewGallery
  :items="[
    { src: './screenshots/theme-mode-auto-dark.png', alt: 'Auto mode resolved to dark theme' },
    { src: './screenshots/theme-mode-auto.png', alt: 'Auto mode resolved to light theme' },
    { src: './screenshots/theme-mode-dark.png', alt: 'Dark mode preview' },
    { src: './screenshots/theme-mode-light.png', alt: 'Light mode preview' },
  ]"
/>

The preview images above are generated from the standalone screenshot source committed in the repository.
