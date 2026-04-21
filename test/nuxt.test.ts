import type { Nuxt } from '@nuxt/schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import themeModeModule from '../src/nuxt/module'
import type { ModuleOptions } from '../src/nuxt/module'

interface MockNuxt {
  options: {
    app: {
      head: {
        script?: Array<{
          innerHTML?: string
          tagPosition?: string
          tagPriority?: string
        }>
      }
    }
    build: {
      transpile: Array<string | RegExp>
    }
    vite: {
      ssr: {
        noExternal?: true | Array<string | RegExp>
      }
    }
  }
}

interface MockTemplate {
  filename: string
  getContents: () => string
}

interface TestableNuxtModule {
  setup?: (options: ModuleOptions, nuxt: Nuxt) => Promise<void> | void
}

const kitMocks = vi.hoisted(() => ({
  addComponent: vi.fn(),
  addImports: vi.fn(),
  addPlugin: vi.fn(),
  addTemplate: vi.fn((template: MockTemplate) => ({
    dst: `/virtual/${template.filename}`,
  })),
  defineNuxtModule: vi.fn(<TDefinition>(definition: TDefinition) => definition),
}))

vi.mock('@nuxt/kit', () => kitMocks)

const createNuxt = (): MockNuxt => ({
  options: {
    app: {
      head: {},
    },
    build: {
      transpile: [],
    },
    vite: {
      ssr: {},
    },
  },
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Nuxt module', () => {
  it('registers anti-flash head script, hydration plugin, imports, and SSR bundling', async () => {
    const nuxt = createNuxt()
    const testableModule = themeModeModule as unknown as TestableNuxtModule

    await testableModule.setup?.(
      {
        cssVariablePrefix: 'x-mode',
        storageKey: 'custom-mode',
      },
      nuxt as unknown as Nuxt,
    )

    expect(nuxt.options.app.head.script?.[0]).toMatchObject({
      tagPosition: 'head',
      tagPriority: 'critical',
    })
    expect(nuxt.options.app.head.script?.[0]?.innerHTML).toContain(
      'custom-mode',
    )
    expect(nuxt.options.app.head.script?.[0]?.innerHTML).toContain(
      '--x-mode-auto-icon-display',
    )
    expect(
      nuxt.options.build.transpile.some(
        (entry) =>
          entry instanceof RegExp && entry.test('@alyldas/theme-mode/vue'),
      ),
    ).toBe(true)
    expect(
      Array.isArray(nuxt.options.vite.ssr.noExternal) &&
        nuxt.options.vite.ssr.noExternal.some(
          (entry) =>
            entry instanceof RegExp && entry.test('@alyldas/theme-mode/nuxt'),
        ),
    ).toBe(true)

    expect(kitMocks.addTemplate).toHaveBeenCalledTimes(1)
    const template = kitMocks.addTemplate.mock.calls[0]?.[0]

    expect(template?.filename).toBe('theme-mode.client.mjs')
    expect(template?.getContents()).toContain('useThemeMode')
    expect(template?.getContents()).toContain('"storageKey":"custom-mode"')
    expect(kitMocks.addPlugin).toHaveBeenCalledWith({
      mode: 'client',
      src: '/virtual/theme-mode.client.mjs',
    })
    expect(kitMocks.addImports).toHaveBeenCalledWith({
      as: 'useThemeMode',
      from: '@alyldas/theme-mode/vue',
      name: 'useThemeMode',
    })
    expect(kitMocks.addComponent).toHaveBeenCalledWith({
      export: 'ThemeModeToggle',
      filePath: '@alyldas/theme-mode/vue',
      name: 'ThemeModeToggle',
    })
  })
})
