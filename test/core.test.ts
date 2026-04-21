import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_THEME_MODE_CYCLE,
  applyThemeMode,
  applyThemeModeIconDisplay,
  createThemeModeInitScript,
  getNextThemeMode,
  getThemeModeIconDisplay,
  getThemeModeIconDisplayVariables,
  isThemeMode,
  isThemeName,
  normalizeThemeModeOptions,
  parseStoredThemeMode,
  persistThemeMode,
  readAppliedTheme,
  readAppliedThemeMode,
  readStoredThemeMode,
  resolvePreferredTheme,
  resolveThemeForMode,
  type ThemeModeRoot,
  type ThemeModeStorage,
} from '../src/core'

const createRoot = (
  initialAttributes: Record<string, string> = {},
): ThemeModeRoot & {
  attributes: Map<string, string>
  styles: Map<string, string>
} => {
  const attributes = new Map(Object.entries(initialAttributes))
  const styles = new Map<string, string>()

  return {
    attributes,
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => {
      attributes.set(name, value)
    },
    style: {
      colorScheme: '',
      setProperty: (name, value) => {
        styles.set(name, value)
      },
    },
    styles,
  }
}

const createStorage = (
  initialEntries: Record<string, string> = {},
): ThemeModeStorage & {
  entries: Map<string, string>
  getItem: ReturnType<typeof vi.fn>
  removeItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
} => {
  const entries = new Map(Object.entries(initialEntries))

  return {
    entries,
    getItem: vi.fn((key) => entries.get(key) ?? null),
    removeItem: vi.fn((key) => {
      entries.delete(key)
    }),
    setItem: vi.fn((key, value) => {
      entries.set(key, value)
    }),
  }
}

const runInitScript = (script: string) => {
  new Function(script)()
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('core helpers', () => {
  it('normalizes default, custom, and invalid options', () => {
    expect(normalizeThemeModeOptions()).toEqual({
      attribute: 'data-theme',
      cssVariablePrefix: 'theme-mode',
      cycle: DEFAULT_THEME_MODE_CYCLE,
      defaultMode: 'auto',
      fallbackTheme: 'dark',
      modeAttribute: 'data-theme-mode',
      storageKey: 'theme-mode',
    })
    expect(
      normalizeThemeModeOptions({
        attribute: ' data-mode ',
        cssVariablePrefix: '--x',
        cycle: ['dark', 'dark', 'auto'],
        defaultMode: 'light',
        fallbackTheme: 'light',
        modeAttribute: ' data-mode-kind ',
        storageKey: ' x-mode ',
      }),
    ).toEqual({
      attribute: 'data-mode',
      cssVariablePrefix: 'x',
      cycle: ['dark', 'auto'],
      defaultMode: 'light',
      fallbackTheme: 'light',
      modeAttribute: 'data-mode-kind',
      storageKey: 'x-mode',
    })
    expect(
      normalizeThemeModeOptions({
        attribute: ' ',
        cssVariablePrefix: ' ',
        cycle: ['bad'] as never,
        defaultMode: 'bad' as never,
        fallbackTheme: 'bad' as never,
        modeAttribute: '',
        storageKey: '',
      }),
    ).toEqual(normalizeThemeModeOptions())
  })

  it('checks and parses theme values', () => {
    expect(isThemeName('dark')).toBe(true)
    expect(isThemeName('light')).toBe(true)
    expect(isThemeName('auto')).toBe(false)
    expect(isThemeMode('auto')).toBe(true)
    expect(isThemeMode('dark')).toBe(true)
    expect(isThemeMode('light')).toBe(true)
    expect(isThemeMode('unknown')).toBe(false)
    expect(parseStoredThemeMode('dark')).toBe('dark')
    expect(parseStoredThemeMode('bad', { defaultMode: 'light' })).toBe('light')
  })

  it('resolves preferred and applied modes', () => {
    expect(resolvePreferredTheme(true)).toBe('light')
    expect(resolvePreferredTheme(false)).toBe('dark')
    expect(resolvePreferredTheme(false, 'light')).toBe('light')
    expect(resolveThemeForMode('auto', 'light')).toBe('light')
    expect(resolveThemeForMode('dark', 'light')).toBe('dark')
  })

  it('cycles theme modes with custom and fallback cycles', () => {
    expect(getNextThemeMode('auto')).toBe('dark')
    expect(getNextThemeMode('dark')).toBe('light')
    expect(getNextThemeMode('light')).toBe('auto')
    expect(getNextThemeMode('auto', ['light'])).toBe('light')
    expect(getNextThemeMode('light', ['light'])).toBe('light')
    expect(getNextThemeMode('dark', ['bad'] as never)).toBe('light')
  })

  it('reads and persists storage safely', () => {
    const storage = createStorage({ 'theme-mode': 'dark' })

    expect(readStoredThemeMode(storage)).toBe('dark')
    expect(readStoredThemeMode(createStorage({ 'theme-mode': 'bad' }))).toBe(
      'auto',
    )
    expect(readStoredThemeMode(null, { defaultMode: 'light' })).toBe('light')
    expect(
      readStoredThemeMode(
        {
          ...storage,
          getItem: vi.fn(() => {
            throw new Error('blocked')
          }),
        },
        { defaultMode: 'dark' },
      ),
    ).toBe('dark')

    persistThemeMode('auto', storage)
    expect(storage.removeItem).toHaveBeenCalledWith('theme-mode')
    expect(storage.entries.has('theme-mode')).toBe(false)

    persistThemeMode('light', storage)
    expect(storage.setItem).toHaveBeenCalledWith('theme-mode', 'light')
    expect(storage.entries.get('theme-mode')).toBe('light')

    expect(() => persistThemeMode('dark', null)).not.toThrow()
    expect(() =>
      persistThemeMode('light', {
        ...storage,
        setItem: vi.fn(() => {
          throw new Error('blocked')
        }),
      }),
    ).not.toThrow()
    expect(() =>
      persistThemeMode('auto', {
        ...storage,
        removeItem: vi.fn(() => {
          throw new Error('blocked')
        }),
      }),
    ).not.toThrow()
  })

  it('applies and reads DOM state', () => {
    const root = createRoot()

    applyThemeMode(root, 'light', 'auto')
    expect(root.attributes.get('data-theme')).toBe('light')
    expect(root.attributes.get('data-theme-mode')).toBe('auto')
    expect(root.style?.colorScheme).toBe('light')
    expect(root.styles.get('--theme-mode-auto-icon-display')).toBe(
      'inline-flex',
    )
    expect(root.styles.get('--theme-mode-dark-icon-display')).toBe('none')
    expect(root.styles.get('--theme-mode-light-icon-display')).toBe('none')
    expect(readAppliedTheme(root)).toBe('light')
    expect(readAppliedThemeMode(root)).toBe('auto')

    root.setAttribute('data-theme', 'bad')
    root.setAttribute('data-theme-mode', 'bad')
    expect(readAppliedTheme(root)).toBeNull()
    expect(readAppliedThemeMode(root)).toBeNull()

    expect(readAppliedTheme(null)).toBeNull()
    expect(readAppliedThemeMode(null)).toBeNull()
    expect(() => applyThemeMode(null, 'dark', 'dark')).not.toThrow()
    expect(() =>
      applyThemeMode(
        { getAttribute: () => null, setAttribute: () => undefined },
        'dark',
        'dark',
      ),
    ).not.toThrow()
    expect(() =>
      applyThemeModeIconDisplay(
        { getAttribute: () => null, setAttribute: () => undefined },
        'dark',
      ),
    ).not.toThrow()
  })

  it('builds icon display state and variables', () => {
    expect(getThemeModeIconDisplay('dark')).toEqual({
      auto: 'none',
      dark: 'inline-flex',
      light: 'none',
    })
    expect(getThemeModeIconDisplay('light')).toEqual({
      auto: 'none',
      dark: 'none',
      light: 'inline-flex',
    })
    expect(getThemeModeIconDisplayVariables()).toEqual({
      auto: '--theme-mode-auto-icon-display',
      dark: '--theme-mode-dark-icon-display',
      light: '--theme-mode-light-icon-display',
    })
    expect(
      getThemeModeIconDisplayVariables({ cssVariablePrefix: 'x' }),
    ).toEqual({
      auto: '--x-auto-icon-display',
      dark: '--x-dark-icon-display',
      light: '--x-light-icon-display',
    })
  })
})

describe('init script', () => {
  it('serializes config safely', () => {
    const lineSeparator = String.fromCharCode(0x2028)
    const paragraphSeparator = String.fromCharCode(0x2029)
    const script = createThemeModeInitScript({
      attribute: 'data-x</script>',
      storageKey: `mode${lineSeparator}key${paragraphSeparator}x`,
    })

    expect(script).toContain('data-x\\u003c/script>')
    expect(script).toContain('mode\\u2028key\\u2029x')
    expect(script).not.toContain('data-x</script>')
    expect(script).not.toContain(lineSeparator)
    expect(script).not.toContain(paragraphSeparator)
  })

  it('applies stored mode before hydration', () => {
    const root = createRoot()

    vi.stubGlobal('document', { documentElement: root })
    vi.stubGlobal('window', {
      localStorage: createStorage({ 'theme-mode': 'dark' }),
      matchMedia: vi.fn(() => ({ matches: true })),
    })

    runInitScript(createThemeModeInitScript())

    expect(root.attributes.get('data-theme')).toBe('dark')
    expect(root.attributes.get('data-theme-mode')).toBe('dark')
    expect(root.styles.get('--theme-mode-dark-icon-display')).toBe(
      'inline-flex',
    )
  })

  it('uses applied theme for auto mode and handles missing browser APIs', () => {
    const root = createRoot({
      'data-theme': 'light',
      'data-theme-mode': 'auto',
    })

    vi.stubGlobal('document', { documentElement: root })
    vi.stubGlobal('window', {})

    runInitScript(createThemeModeInitScript())

    expect(root.attributes.get('data-theme')).toBe('light')
    expect(root.attributes.get('data-theme-mode')).toBe('auto')
    expect(root.styles.get('--theme-mode-auto-icon-display')).toBe(
      'inline-flex',
    )
  })

  it('falls back when storage, media, root, or window are unavailable', () => {
    const root = createRoot()

    vi.stubGlobal('document', { documentElement: root })
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('blocked')
      },
      matchMedia: vi.fn(() => {
        throw new Error('blocked')
      }),
    })

    expect(() => runInitScript(createThemeModeInitScript())).not.toThrow()
    expect(root.attributes.get('data-theme')).toBe('dark')

    vi.stubGlobal('document', {})
    expect(() => runInitScript(createThemeModeInitScript())).not.toThrow()

    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    expect(() => runInitScript(createThemeModeInitScript())).not.toThrow()
  })
})
