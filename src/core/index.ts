export type ThemeName = 'dark' | 'light'
export type ThemeMode = 'auto' | ThemeName
export type ThemeModeCycle = readonly ThemeMode[]
export type ThemeModeIconDisplay = 'inline-flex' | 'none'

export interface ThemeModeOptions {
  attribute?: string
  cssVariablePrefix?: string
  cycle?: ThemeModeCycle
  defaultMode?: ThemeMode
  fallbackTheme?: ThemeName
  modeAttribute?: string
  storageKey?: string
}

export interface ResolvedThemeModeOptions {
  attribute: string
  cssVariablePrefix: string
  cycle: ThemeModeCycle
  defaultMode: ThemeMode
  fallbackTheme: ThemeName
  modeAttribute: string
  storageKey: string
}

export interface ThemeModeStorage {
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
  setItem: (key: string, value: string) => void
}

export interface ThemeModeRoot {
  getAttribute: (name: string) => string | null
  setAttribute: (name: string, value: string) => void
  style?: {
    colorScheme?: string
    setProperty?: (name: string, value: string) => void
  }
}

export interface ThemeModeIconDisplayVariables {
  auto: string
  dark: string
  light: string
}

export const THEME_MODE_STORAGE_KEY = 'theme-mode'
export const THEME_MODE_ATTRIBUTE = 'data-theme'
export const THEME_MODE_MODE_ATTRIBUTE = 'data-theme-mode'
export const THEME_MODE_CSS_VARIABLE_PREFIX = 'theme-mode'
export const DEFAULT_THEME_MODE_CYCLE = ['auto', 'dark', 'light'] as const

export const DEFAULT_THEME_MODE_OPTIONS: ResolvedThemeModeOptions = {
  attribute: THEME_MODE_ATTRIBUTE,
  cssVariablePrefix: THEME_MODE_CSS_VARIABLE_PREFIX,
  cycle: DEFAULT_THEME_MODE_CYCLE,
  defaultMode: 'auto',
  fallbackTheme: 'dark',
  modeAttribute: THEME_MODE_MODE_ATTRIBUTE,
  storageKey: THEME_MODE_STORAGE_KEY,
}

export const isThemeName = (
  value: string | null | undefined,
): value is ThemeName => value === 'dark' || value === 'light'

export const isThemeMode = (
  value: string | null | undefined,
): value is ThemeMode => value === 'auto' || isThemeName(value)

const normalizeCycle = (cycle: ThemeModeCycle | undefined): ThemeModeCycle => {
  if (!cycle?.length) {
    return DEFAULT_THEME_MODE_CYCLE
  }

  const uniqueModes = cycle.filter(
    (mode, index, modes) => isThemeMode(mode) && modes.indexOf(mode) === index,
  )

  return uniqueModes.length ? uniqueModes : DEFAULT_THEME_MODE_CYCLE
}

const normalizeCssVariablePrefix = (prefix: string | undefined): string => {
  const normalizedPrefix = prefix?.trim().replace(/^--/, '')

  return normalizedPrefix || THEME_MODE_CSS_VARIABLE_PREFIX
}

export const normalizeThemeModeOptions = (
  options: ThemeModeOptions = {},
): ResolvedThemeModeOptions => ({
  attribute: options.attribute?.trim() || THEME_MODE_ATTRIBUTE,
  cssVariablePrefix: normalizeCssVariablePrefix(options.cssVariablePrefix),
  cycle: normalizeCycle(options.cycle),
  defaultMode: isThemeMode(options.defaultMode)
    ? options.defaultMode
    : DEFAULT_THEME_MODE_OPTIONS.defaultMode,
  fallbackTheme: isThemeName(options.fallbackTheme)
    ? options.fallbackTheme
    : DEFAULT_THEME_MODE_OPTIONS.fallbackTheme,
  modeAttribute: options.modeAttribute?.trim() || THEME_MODE_MODE_ATTRIBUTE,
  storageKey: options.storageKey?.trim() || THEME_MODE_STORAGE_KEY,
})

export const parseStoredThemeMode = (
  value: string | null | undefined,
  options?: ThemeModeOptions,
): ThemeMode => {
  const resolvedOptions = normalizeThemeModeOptions(options)

  return isThemeMode(value) ? value : resolvedOptions.defaultMode
}

export const resolvePreferredTheme = (
  prefersLight: boolean,
  fallbackTheme: ThemeName = DEFAULT_THEME_MODE_OPTIONS.fallbackTheme,
): ThemeName => (prefersLight ? 'light' : fallbackTheme)

export const resolveThemeForMode = (
  mode: ThemeMode,
  preferredTheme: ThemeName,
): ThemeName => (mode === 'auto' ? preferredTheme : mode)

export const getNextThemeMode = (
  mode: ThemeMode,
  cycle: ThemeModeCycle = DEFAULT_THEME_MODE_CYCLE,
): ThemeMode => {
  const resolvedCycle = normalizeCycle(cycle)
  const currentIndex = resolvedCycle.indexOf(mode)

  if (currentIndex === -1) {
    return resolvedCycle[0]
  }

  return resolvedCycle[(currentIndex + 1) % resolvedCycle.length]
}

export const readStoredThemeMode = (
  storage: ThemeModeStorage | null | undefined,
  options?: ThemeModeOptions,
): ThemeMode => {
  const resolvedOptions = normalizeThemeModeOptions(options)

  if (!storage) {
    return resolvedOptions.defaultMode
  }

  try {
    return parseStoredThemeMode(
      storage.getItem(resolvedOptions.storageKey),
      resolvedOptions,
    )
  } catch {
    return resolvedOptions.defaultMode
  }
}

export const persistThemeMode = (
  mode: ThemeMode,
  storage: ThemeModeStorage | null | undefined,
  options?: ThemeModeOptions,
): void => {
  if (!storage) {
    return
  }

  const resolvedOptions = normalizeThemeModeOptions(options)

  try {
    if (mode === resolvedOptions.defaultMode) {
      storage.removeItem(resolvedOptions.storageKey)
      return
    }

    storage.setItem(resolvedOptions.storageKey, mode)
  } catch {
    // Storage can be unavailable in private browsing or embedded contexts.
  }
}

export const getThemeModeIconDisplay = (
  mode: ThemeMode,
): Record<ThemeMode, ThemeModeIconDisplay> => ({
  auto: mode === 'auto' ? 'inline-flex' : 'none',
  dark: mode === 'dark' ? 'inline-flex' : 'none',
  light: mode === 'light' ? 'inline-flex' : 'none',
})

export const getThemeModeIconDisplayVariables = (
  options?: ThemeModeOptions,
): ThemeModeIconDisplayVariables => {
  const { cssVariablePrefix } = normalizeThemeModeOptions(options)

  return {
    auto: `--${cssVariablePrefix}-auto-icon-display`,
    dark: `--${cssVariablePrefix}-dark-icon-display`,
    light: `--${cssVariablePrefix}-light-icon-display`,
  }
}

export const readAppliedTheme = (
  root: ThemeModeRoot | null | undefined,
  options?: ThemeModeOptions,
): ThemeName | null => {
  const resolvedOptions = normalizeThemeModeOptions(options)
  const value = root?.getAttribute(resolvedOptions.attribute)

  return isThemeName(value) ? value : null
}

export const readAppliedThemeMode = (
  root: ThemeModeRoot | null | undefined,
  options?: ThemeModeOptions,
): ThemeMode | null => {
  const resolvedOptions = normalizeThemeModeOptions(options)
  const value = root?.getAttribute(resolvedOptions.modeAttribute)

  return isThemeMode(value) ? value : null
}

export const applyThemeModeIconDisplay = (
  root: ThemeModeRoot | null | undefined,
  mode: ThemeMode,
  options?: ThemeModeOptions,
): void => {
  const setProperty = root?.style?.setProperty

  if (!setProperty) {
    return
  }

  const display = getThemeModeIconDisplay(mode)
  const variables = getThemeModeIconDisplayVariables(options)

  setProperty.call(root.style, variables.auto, display.auto)
  setProperty.call(root.style, variables.dark, display.dark)
  setProperty.call(root.style, variables.light, display.light)
}

export const applyThemeMode = (
  root: ThemeModeRoot | null | undefined,
  theme: ThemeName,
  mode: ThemeMode,
  options?: ThemeModeOptions,
): void => {
  if (!root) {
    return
  }

  const resolvedOptions = normalizeThemeModeOptions(options)

  root.setAttribute(resolvedOptions.attribute, theme)
  root.setAttribute(resolvedOptions.modeAttribute, mode)

  if (root.style) {
    root.style.colorScheme = theme
  }

  applyThemeModeIconDisplay(root, mode, resolvedOptions)
}

// The init script is injected inline into HTML; escape the JSON boundary cases
// that can break a script tag or JavaScript parsing in older engines.
const serializeInitScriptConfig = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

export const createThemeModeInitScript = (
  options?: ThemeModeOptions,
): string => {
  const resolvedOptions = normalizeThemeModeOptions(options)
  const variables = getThemeModeIconDisplayVariables(resolvedOptions)
  const config = {
    attribute: resolvedOptions.attribute,
    defaultMode: resolvedOptions.defaultMode,
    fallbackTheme: resolvedOptions.fallbackTheme,
    iconDisplayVariables: variables,
    modeAttribute: resolvedOptions.modeAttribute,
    storageKey: resolvedOptions.storageKey,
  }

  return `;(() => {
  try {
    const config = ${serializeInitScriptConfig(config)}
    const browserWindow = globalThis.window
    const browserDocument = globalThis.document

    if (!browserWindow || !browserDocument) {
      return
    }

    const root = browserDocument.documentElement

    if (!root) {
      return
    }

    const isThemeName = (value) => value === 'dark' || value === 'light'
    const isThemeMode = (value) => value === 'auto' || isThemeName(value)
    const parseMode = (value) => (isThemeMode(value) ? value : config.defaultMode)
    const getPreferredTheme = () => {
      try {
        const query = browserWindow.matchMedia?.('(prefers-color-scheme: light)')
        return query?.matches ? 'light' : config.fallbackTheme
      } catch {
        return config.fallbackTheme
      }
    }

    let storedMode = null

    try {
      storedMode = browserWindow.localStorage?.getItem(config.storageKey) ?? null
    } catch {}

    const mode = parseMode(root.getAttribute(config.modeAttribute) || storedMode)
    const appliedTheme = root.getAttribute(config.attribute)
    const theme = mode === 'auto'
      ? (isThemeName(appliedTheme) ? appliedTheme : getPreferredTheme())
      : mode
    const iconDisplay = {
      auto: mode === 'auto' ? 'inline-flex' : 'none',
      dark: mode === 'dark' ? 'inline-flex' : 'none',
      light: mode === 'light' ? 'inline-flex' : 'none',
    }

    root.setAttribute(config.attribute, theme)
    root.setAttribute(config.modeAttribute, mode)
    root.style.colorScheme = theme
    root.style.setProperty(config.iconDisplayVariables.auto, iconDisplay.auto)
    root.style.setProperty(config.iconDisplayVariables.dark, iconDisplay.dark)
    root.style.setProperty(config.iconDisplayVariables.light, iconDisplay.light)
  } catch {}
})()`
}
