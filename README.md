# Theme Mode

`@alyldas/theme-mode` is a small color mode controller for Nuxt, Vue, and framework-neutral helpers.

## What This Package Does

- Tracks `auto`, `dark`, and `light` mode.
- Resolves `auto` through `prefers-color-scheme`.
- Applies `data-theme`, `data-theme-mode`, `color-scheme`, and icon display CSS variables.
- Ships a Nuxt module with an early inline script to avoid a wrong-theme flash.
- Exposes a renderless Vue toggle for fully custom UI.
- Ships optional preset CSS for a simple button, without coupling to a design system.

## What It Does Not Do

- It is not a design system.
- It does not manage a theme registry or arbitrary named themes.
- It does not migrate old application-specific storage keys.
- It does not ship React, Svelte, or Web Component adapters in v1.
- It does not require specific icons, button components, or app CSS tokens.

## Install

Install from GitHub Packages:

```sh
npm install @alyldas/theme-mode@0.1.0
```

Configure the GitHub Packages registry for the package scope:

```ini
@alyldas:registry=https://npm.pkg.github.com
```

GitHub Packages can require authentication for package reads. Use a token with `read:packages` in your local npm config or CI secret; do not commit tokens.

When using `package.json`, keep the dependency as a normal package version:

```json
{
  "dependencies": {
    "@alyldas/theme-mode": "0.1.0"
  }
}
```

Optional preset CSS:

```ts
import '@alyldas/theme-mode/style.css'
```

The preset only styles classes you opt into; it does not render markup or depend on app tokens.

The preset is a small fallback/example stylesheet. It is not an official design language for your app.

## SSR / Anti-Flash

The Nuxt module injects a small inline script into `<head>`. It reads the stored mode, resolves `auto` safely, and applies DOM attributes before the app hydrates.

The script catches unavailable `localStorage`, `matchMedia`, and DOM APIs, so it can run in restricted browser contexts without breaking page rendering.

The Nuxt module also adds a client plugin that calls `hydrateThemeMode()` for you. You only need to call `hydrateThemeMode()` manually when using the Vue entry outside Nuxt.

The generated script and the Vue controller use the same normalized options. If you customize `storageKey`, `attribute`, `modeAttribute`, or `cssVariablePrefix`, use the Nuxt module config so both layers stay aligned.

## Runtime Contract

`useThemeMode()` returns one document-level controller:

```ts
type ThemeMode = 'auto' | 'dark' | 'light'
type ThemeName = 'dark' | 'light'

interface ThemeModeController {
  mode: Ref<ThemeMode>
  resolvedTheme: Ref<ThemeName>
  setThemeMode: (value: ThemeMode) => void
  toggleThemeMode: () => void
  hydrateThemeMode: () => void
}
```

`mode` is the user's selected mode. `resolvedTheme` is the concrete theme applied to the document.

`ThemeModeToggle` exposes a smaller slot contract for UI rendering:

```ts
interface ThemeModeToggleSlotProps {
  mode: ThemeMode
  resolvedTheme: ThemeName
  nextMode: ThemeMode
  label: string
  iconDisplay: Record<ThemeMode, 'inline-flex' | 'none'>
  setThemeMode: (value: ThemeMode) => void
  toggle: () => void
}
```

The slot uses `toggle` because it is button-oriented. The composable keeps the explicit `toggleThemeMode` name.

Before the component is mounted, `label` uses the pending label, which defaults to `Toggle theme mode`. After mount, it uses the mode-specific labels:

- `auto`: `Switch to dark theme`
- `dark`: `Switch to light theme`
- `light`: `Switch to auto theme`

## Browser Support

The package targets modern browsers with support for standard DOM APIs, CSS custom properties, and optional chaining.

`localStorage` and `matchMedia` are optional at runtime. If either API is unavailable or throws, the controller falls back to the configured default mode and fallback theme without blocking rendering.

The Nuxt anti-flash script is defensive for restricted browser contexts, private browsing, and embedded environments where storage or media queries may be unavailable.

## Accessibility

`ThemeModeToggle` is renderless. Your app owns the actual button, icon markup, focus style, and ARIA attributes.

The slot provides `label`, which is intended for `aria-label` or equivalent accessible text. If you render icon-only controls, wire that label to the interactive element.

The optional CSS preset only styles opt-in classes. It does not add semantics or keyboard behavior.

## Nuxt

Minimal setup:

```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
})
```

Customize:

```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: {
    storageKey: 'theme-mode',
    defaultMode: 'auto',
    attribute: 'data-theme',
    modeAttribute: 'data-theme-mode',
    cssVariablePrefix: 'theme-mode',
  },
})
```

Custom cycle:

```ts
export default defineNuxtConfig({
  modules: ['@alyldas/theme-mode/nuxt'],
  themeMode: {
    cycle: ['light', 'dark'],
  },
})
```

Use the auto-imported composable:

```vue
<script setup lang="ts">
const themeMode = useThemeMode()
</script>

<template>
  <button type="button" @click="themeMode.toggleThemeMode">
    {{ themeMode.mode }}
  </button>
</template>
```

The module also auto-imports `ThemeModeToggle`. Explicit imports are still fine when you prefer local component clarity:

```ts
import { ThemeModeToggle } from '@alyldas/theme-mode/vue'
```

## Vue

```ts
import { useThemeMode } from '@alyldas/theme-mode/vue'

const { mode, resolvedTheme, setThemeMode, toggleThemeMode, hydrateThemeMode } =
  useThemeMode()
```

Call `hydrateThemeMode()` on the client when you are not using the Nuxt module.

For isolated tests or embedded widgets, use `createThemeModeController()` instead of the shared `useThemeMode()` singleton.

## Custom Toggle

`ThemeModeToggle` is renderless. The package does not own your button or icons.

```vue
<script setup lang="ts">
import { ThemeModeToggle } from '@alyldas/theme-mode/vue'
</script>

<template>
  <ThemeModeToggle v-slot="{ mode, resolvedTheme, nextMode, label, toggle }">
    <button :aria-label="label" type="button" @click="toggle">
      {{ mode }} / {{ resolvedTheme }} -> {{ nextMode }}
    </button>
  </ThemeModeToggle>
</template>
```

Custom labels:

```vue
<ThemeModeToggle
  v-slot="{ label, toggle }"
  :labels="{
    auto: 'Switch to dark theme',
    dark: 'Switch to light theme',
    light: 'Switch to auto theme',
  }"
>
  <button :aria-label="label" type="button" @click="toggle">
    {{ label }}
  </button>
</ThemeModeToggle>
```

With the optional preset CSS:

```vue
<script setup lang="ts">
import { ThemeModeToggle } from '@alyldas/theme-mode/vue'
import '@alyldas/theme-mode/style.css'
</script>

<template>
  <ThemeModeToggle v-slot="{ label, toggle }">
    <button
      :aria-label="label"
      class="theme-mode-toggle"
      type="button"
      @click="toggle"
    >
      <span class="theme-mode-toggle__icon theme-mode-toggle__icon--auto">
        A
      </span>
      <span class="theme-mode-toggle__icon theme-mode-toggle__icon--dark">
        D
      </span>
      <span class="theme-mode-toggle__icon theme-mode-toggle__icon--light">
        L
      </span>
    </button>
  </ThemeModeToggle>
</template>
```

## Entry Points

- `@alyldas/theme-mode/core`: types and framework-neutral helpers.
- `@alyldas/theme-mode/vue`: `useThemeMode` and `ThemeModeToggle`.
- `@alyldas/theme-mode/nuxt`: Nuxt module.
- `@alyldas/theme-mode/style.css`: optional preset CSS.

There is no root `@alyldas/theme-mode` export in v1. Use an explicit entry point so imports show which layer the app depends on.

## Generated Files

This repository keeps the package source-only. Do not commit generated output:

- `dist`
- `coverage`
- `.typecheck`
- `node_modules`

`dist` is created by `npm run build`, `npm run test:exports`, `npm run pack:dry`, and `npm run prepare`.

## Release Checklist

Run the package gate before publishing:

```sh
npm run check
```

The gate runs formatting, ESLint, typecheck, 100% core/Vue coverage, export smoke tests, and `npm pack --dry-run`.

Tags matching `v*` publish the package to GitHub Packages.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
