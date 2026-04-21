import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  defineNuxtModule,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import {
  createThemeModeInitScript,
  normalizeThemeModeOptions,
  type ThemeModeOptions,
} from '../core'

export type ModuleOptions = ThemeModeOptions

// noinspection JSUnusedGlobalSymbols
declare module '@nuxt/schema' {
  interface NuxtConfig {
    themeMode?: ModuleOptions
  }

  interface NuxtOptions {
    themeMode?: ModuleOptions
  }
}

const THEME_MODE_PACKAGE_RE = /^@alyldas\/theme-mode(?:\/.*)?$/

const isThemeModeTranspileEntry = (entry: unknown): boolean => {
  if (typeof entry === 'string') {
    return entry === '@alyldas/theme-mode'
  }

  return (
    entry instanceof RegExp && entry.source === THEME_MODE_PACKAGE_RE.source
  )
}

const addThemeModeSsrNoExternal = (nuxt: Nuxt): void => {
  const ssr = (nuxt.options.vite.ssr ??= {})

  if (ssr.noExternal === true) {
    return
  }

  const noExternal = Array.isArray(ssr.noExternal) ? ssr.noExternal : []

  if (!noExternal.some(isThemeModeTranspileEntry)) {
    noExternal.push(THEME_MODE_PACKAGE_RE)
  }

  ssr.noExternal = noExternal
}

export default defineNuxtModule<ModuleOptions>({
  defaults: {},
  meta: {
    configKey: 'themeMode',
    name: '@alyldas/theme-mode',
  },
  setup(options, nuxt) {
    const resolvedOptions = normalizeThemeModeOptions(options)

    nuxt.options.app.head.script ??= []
    nuxt.options.app.head.script.unshift({
      innerHTML: createThemeModeInitScript(resolvedOptions),
      tagPosition: 'head',
      tagPriority: 'critical',
    })

    nuxt.options.build.transpile ||= []

    if (!nuxt.options.build.transpile.some(isThemeModeTranspileEntry)) {
      nuxt.options.build.transpile.push(THEME_MODE_PACKAGE_RE)
    }

    // Workspace installs point Nuxt at source-adjacent package files. Keep the
    // package transpiled and bundled for SSR so local dev and npm installs match.
    addThemeModeSsrNoExternal(nuxt)

    const plugin = addTemplate({
      filename: 'theme-mode.client.mjs',
      getContents: () => `import { defineNuxtPlugin } from '#app'
import { useThemeMode } from '@alyldas/theme-mode/vue'

export default defineNuxtPlugin(() => {
  const themeMode = useThemeMode(${JSON.stringify(resolvedOptions)})
  themeMode.hydrateThemeMode()
})
`,
    })

    addPlugin({
      mode: 'client',
      src: plugin.dst,
    })

    addImports({
      as: 'useThemeMode',
      from: '@alyldas/theme-mode/vue',
      name: 'useThemeMode',
    })

    addComponent({
      export: 'ThemeModeToggle',
      filePath: '@alyldas/theme-mode/vue',
      name: 'ThemeModeToggle',
    })
  },
})
