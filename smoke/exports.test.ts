import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('package exports', () => {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

  it('loads public JS entry points and ships CSS export', async () => {
    const [core, vue, nuxt] = await Promise.all([
      import('@alyldas/theme-mode/core'),
      import('@alyldas/theme-mode/vue'),
      import('@alyldas/theme-mode/nuxt'),
    ])

    expect(core.createThemeModeInitScript()).toContain('data-theme')
    expect(vue.ThemeModeToggle.name).toBe('ThemeModeToggle')
    expect(typeof vue.useThemeMode).toBe('function')
    expect(nuxt.default).toBeTruthy()

    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
    )

    expect(packageJson.exports['.']).toBeUndefined()
    expect(packageJson.exports['./style.css']).toBe('./dist/style.css')
    expect(existsSync(resolve(packageRoot, 'dist/style.css'))).toBe(true)
  })
})
