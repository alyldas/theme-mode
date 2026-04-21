import {
  computed,
  defineComponent,
  onMounted,
  ref,
  type ComputedRef,
  type PropType,
  type Ref,
} from 'vue'
import {
  applyThemeMode,
  getNextThemeMode,
  getThemeModeIconDisplay,
  normalizeThemeModeOptions,
  persistThemeMode,
  readAppliedTheme,
  readAppliedThemeMode,
  readStoredThemeMode,
  resolvePreferredTheme,
  resolveThemeForMode,
  type ResolvedThemeModeOptions,
  type ThemeMode,
  type ThemeModeCycle,
  type ThemeModeIconDisplay,
  type ThemeModeOptions,
  type ThemeModeStorage,
  type ThemeName,
} from '../core'

export interface ThemeModeLabels {
  auto: string
  dark: string
  light: string
}

export interface ThemeModeController {
  mode: Ref<ThemeMode>
  resolvedTheme: Ref<ThemeName>
  hydrateThemeMode: () => void
  setThemeMode: (value: ThemeMode) => void
  toggleThemeMode: () => void
}

export interface ThemeModeToggleSlotProps {
  iconDisplay: Record<ThemeMode, ThemeModeIconDisplay>
  label: string
  mode: ThemeMode
  nextMode: ThemeMode
  resolvedTheme: ThemeName
  setThemeMode: (value: ThemeMode) => void
  toggle: () => void
}

export interface ThemeModeToggleOptions {
  labels?: ThemeModeLabels
  pending?: boolean
  pendingLabel?: string
}

interface ThemeModeControllerState {
  controller: ThemeModeController
  hydrated: Ref<boolean>
  label: ComputedRef<string>
  nextMode: ComputedRef<ThemeMode>
}

const DEFAULT_THEME_MODE_LABELS: ThemeModeLabels = {
  auto: 'Switch to dark theme',
  dark: 'Switch to light theme',
  light: 'Switch to auto theme',
}
const DEFAULT_PENDING_LABEL = 'Toggle theme mode'
const PREFERRED_THEME_QUERY = '(prefers-color-scheme: light)'

const controllerStates = new WeakMap<
  ThemeModeController,
  ThemeModeControllerState
>()
let sharedControllerState: ThemeModeControllerState | undefined

const getWindow = (): Window | undefined =>
  typeof window === 'undefined' ? undefined : window

const getRoot = (): HTMLElement | undefined =>
  typeof document === 'undefined' ? undefined : document.documentElement

const getPreferredThemeQuery = (): MediaQueryList | undefined => {
  const browserWindow = getWindow()

  if (!browserWindow?.matchMedia) {
    return undefined
  }

  try {
    return browserWindow.matchMedia(PREFERRED_THEME_QUERY)
  } catch {
    return undefined
  }
}

const getPreferredTheme = (options: ResolvedThemeModeOptions): ThemeName =>
  resolvePreferredTheme(
    getPreferredThemeQuery()?.matches ?? false,
    options.fallbackTheme,
  )

const readClientStorage = (): ThemeModeStorage | undefined => {
  const browserWindow = getWindow()

  try {
    return browserWindow?.localStorage
  } catch {
    return undefined
  }
}

const resolveInitialThemeMode = (
  options: ResolvedThemeModeOptions,
): ThemeMode => readAppliedThemeMode(getRoot(), options) ?? options.defaultMode

const resolveInitialTheme = (
  mode: ThemeMode,
  options: ResolvedThemeModeOptions,
): ThemeName => {
  const appliedTheme = readAppliedTheme(getRoot(), options)

  if (mode === 'auto' && appliedTheme) {
    return appliedTheme
  }

  return resolveThemeForMode(mode, getPreferredTheme(options))
}

const getThemeModeLabel = (
  mode: ThemeMode,
  labels: ThemeModeLabels = DEFAULT_THEME_MODE_LABELS,
): string => labels[mode]

export const createThemeModeController = (
  options?: ThemeModeOptions,
): ThemeModeController => createThemeModeControllerState(options).controller

const createThemeModeControllerState = (
  options?: ThemeModeOptions,
): ThemeModeControllerState => {
  const resolvedOptions = normalizeThemeModeOptions(options)
  const themeMode = ref<ThemeMode>(resolveInitialThemeMode(resolvedOptions))
  const resolvedTheme = ref<ThemeName>(
    resolveInitialTheme(themeMode.value, resolvedOptions),
  )
  const hydrated = ref(false)
  let stopPreferredThemeListener: (() => void) | undefined

  const syncPreferredThemeListener = () => {
    stopPreferredThemeListener?.()
    stopPreferredThemeListener = undefined

    if (themeMode.value !== 'auto') {
      return
    }

    const query = getPreferredThemeQuery()

    if (!query) {
      return
    }

    const updatePreferredTheme = () => {
      if (themeMode.value !== 'auto') {
        return
      }

      const nextTheme = getPreferredTheme(resolvedOptions)
      resolvedTheme.value = nextTheme
      applyThemeMode(getRoot(), nextTheme, themeMode.value, resolvedOptions)
    }

    if (query.addEventListener) {
      query.addEventListener('change', updatePreferredTheme)
      stopPreferredThemeListener = () => {
        query.removeEventListener('change', updatePreferredTheme)
      }
      return
    }

    if (query.addListener) {
      query.addListener(updatePreferredTheme)
      stopPreferredThemeListener = () => {
        query.removeListener(updatePreferredTheme)
      }
    }
  }

  const commitThemeMode = (value: ThemeMode) => {
    themeMode.value = value

    const nextTheme = resolveThemeForMode(
      value,
      getPreferredTheme(resolvedOptions),
    )

    resolvedTheme.value = nextTheme
    applyThemeMode(getRoot(), nextTheme, value, resolvedOptions)
    persistThemeMode(value, readClientStorage(), resolvedOptions)
    syncPreferredThemeListener()
  }

  const setThemeMode = (value: ThemeMode) => {
    if (themeMode.value === value) {
      return
    }

    commitThemeMode(value)
  }

  const toggleThemeMode = () => {
    setThemeMode(getNextThemeMode(themeMode.value, resolvedOptions.cycle))
  }

  const hydrateThemeMode = () => {
    const root = getRoot()

    if (hydrated.value || !root) {
      return
    }

    const nextMode =
      readAppliedThemeMode(root, resolvedOptions) ??
      readStoredThemeMode(readClientStorage(), resolvedOptions)
    const nextTheme =
      nextMode === 'auto'
        ? (readAppliedTheme(root, resolvedOptions) ??
          resolveThemeForMode(nextMode, getPreferredTheme(resolvedOptions)))
        : nextMode

    themeMode.value = nextMode
    resolvedTheme.value = nextTheme
    applyThemeMode(root, nextTheme, nextMode, resolvedOptions)
    hydrated.value = true
    syncPreferredThemeListener()
  }

  const nextMode = computed(() =>
    getNextThemeMode(themeMode.value, resolvedOptions.cycle),
  )
  const label = computed(() =>
    hydrated.value ? getThemeModeLabel(themeMode.value) : DEFAULT_PENDING_LABEL,
  )
  const state: ThemeModeControllerState = {
    controller: {
      hydrateThemeMode,
      mode: themeMode,
      resolvedTheme,
      setThemeMode,
      toggleThemeMode,
    },
    hydrated,
    label,
    nextMode,
  }

  controllerStates.set(state.controller, state)

  return state
}

export const useThemeMode = (
  options?: ThemeModeOptions,
): ThemeModeController => {
  // Apps should have one document-level mode controller. Create explicit
  // controllers with createThemeModeController() when isolation is needed.
  sharedControllerState ??= createThemeModeControllerState(options)

  return sharedControllerState.controller
}

export const getThemeModeToggleSlotProps = (
  controller: ThemeModeController,
  options: ThemeModeToggleOptions = {},
): ThemeModeToggleSlotProps => {
  const state = controllerStates.get(controller)
  const mode = controller.mode.value
  const pendingLabel = options.pendingLabel ?? DEFAULT_PENDING_LABEL
  const label = options.pending
    ? pendingLabel
    : options.labels
      ? getThemeModeLabel(mode, options.labels)
      : (state?.label.value ?? getThemeModeLabel(mode))
  const nextMode = state?.nextMode.value ?? getNextThemeMode(mode)

  return {
    iconDisplay: getThemeModeIconDisplay(mode),
    label,
    mode,
    nextMode,
    resolvedTheme: controller.resolvedTheme.value,
    setThemeMode: controller.setThemeMode,
    toggle: controller.toggleThemeMode,
  }
}

export const ThemeModeToggle = defineComponent({
  name: 'ThemeModeToggle',
  props: {
    attribute: String,
    cssVariablePrefix: String,
    cycle: Array as PropType<ThemeModeCycle>,
    defaultMode: String as PropType<ThemeMode>,
    fallbackTheme: String as PropType<ThemeName>,
    labels: Object as PropType<ThemeModeLabels>,
    modeAttribute: String,
    pendingLabel: String,
    storageKey: String,
  },
  setup(props, { slots }) {
    const controller = useThemeMode(props)
    const mounted = ref(false)

    onMounted(() => {
      mounted.value = true
    })

    return () =>
      slots.default?.(
        getThemeModeToggleSlotProps(controller, {
          labels: props.labels,
          pending: !mounted.value,
          pendingLabel: props.pendingLabel,
        }),
      ) ?? null
  },
})
