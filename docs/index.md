---
layout: home
title: Theme Mode
titleTemplate: Nuxt and Vue theme controller
description: Theme Mode keeps Nuxt color mode, Vue toggles, and TypeScript helpers aligned across SSR, hydration, and client updates.
hero:
  name: Theme Mode
  text: SSR-safe theme state for Nuxt and Vue
  tagline: A Nuxt color mode module, Vue toggle primitives, and framework-neutral helpers that keep selected mode and resolved theme separate.
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
  <span>Stored mode stays explicit: <code>auto</code> remains <code>auto</code>, while the resolved theme follows the OS.</span>
  <span>Import only the Nuxt, Vue, or core entry point your app actually uses.</span>
</div>

## Install from GitHub Packages {#install}

One flow: register GitHub Packages, install the package, then import only the entry point your app actually uses.

Add the GitHub Packages registry to `.npmrc`:

::: code-group

```ini [.npmrc]
@alyldas:registry=https://npm.pkg.github.com
```

:::

> Package reads can require a token with `read:packages`.

Install the package:

::: code-group

```sh [terminal]
npm install @alyldas/theme-mode
```

:::

Import the CSS and your entry point:

::: code-group

```ts [theme-mode.ts]
import '@alyldas/theme-mode/style.css'
import '@alyldas/theme-mode/nuxt'
```

:::

## Choose an entry point

Replace the entry-point import above with one of these lines:

<EntryPointCards
:items="[
{
path: '@alyldas/theme-mode/nuxt',
title: 'Nuxt module',
bestFor: 'Best for Nuxt apps that need theme state before hydration.',
details: 'Adds the SSR-safe bootstrap path and keeps runtime options aligned.',
      importLine: `import '@alyldas/theme-mode/nuxt'`,
},
{
path: '@alyldas/theme-mode/vue',
title: 'Vue composable and toggle',
bestFor: 'Best for app shells, custom buttons, widgets, and tests.',
details: 'Use the shared controller or the renderless toggle slot in your own UI.',
      importLine: `import '@alyldas/theme-mode/vue'`,
},
{
path: '@alyldas/theme-mode/core',
title: 'Framework-neutral helpers',
bestFor: 'Best for adapters that only need parsing, persistence, and DOM writes.',
details: 'Use it from plain TypeScript when no Vue runtime is involved.',
      importLine: `import '@alyldas/theme-mode/core'`,
},
]"
/>

## Nuxt setup

Start with the module only. Add options when you need custom storage keys, attributes, or CSS variable prefixes.

::: code-group

```ts [minimal setup]
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
})
```

```ts [extended options]
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

:::

## Preview states

<PreviewGallery
  :items="[
    { src: './screenshots/theme-mode-auto-dark.png', alt: 'Auto mode resolved to dark theme', caption: 'Auto mode resolved to dark theme' },
    { src: './screenshots/theme-mode-auto.png', alt: 'Auto mode resolved to light theme', caption: 'Auto mode resolved to light theme' },
    { src: './screenshots/theme-mode-dark.png', alt: 'Dark mode preview', caption: 'Explicit dark mode' },
    { src: './screenshots/theme-mode-light.png', alt: 'Light mode preview', caption: 'Explicit light mode' },
  ]"
/>

The preview images above are generated from the standalone example committed in the repository.
