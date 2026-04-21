import { createRenderer, h, nextTick, ref, type VNode } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  ThemeMode,
  ThemeModeRoot,
  ThemeModeStorage,
  ThemeName,
} from '../src/core'
import {
  ThemeModeToggle,
  createThemeModeController,
  getThemeModeToggleSlotProps,
  useThemeMode,
} from '../src/vue'

interface RenderNode {
  children: RenderNode[]
  parent?: RenderNode
  props: Record<string, unknown>
  text?: string
  type: string
}

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

const stubBrowser = (
  root: ThemeModeRoot,
  options: {
    localStorage?: ThemeModeStorage
    matchMedia?: Window['matchMedia']
  } = {},
) => {
  vi.stubGlobal('document', { documentElement: root })
  vi.stubGlobal('window', {
    localStorage: options.localStorage,
    matchMedia: options.matchMedia,
  })
}

const renderer = createRenderer<RenderNode, RenderNode>({
  createComment: (text) => ({
    children: [],
    props: {},
    text,
    type: 'comment',
  }),
  createElement: (type) => ({
    children: [],
    props: {},
    type,
  }),
  createText: (text) => ({
    children: [],
    props: {},
    text,
    type: 'text',
  }),
  insert: (child, parent) => {
    child.parent = parent
    parent.children.push(child)
  },
  nextSibling: () => null,
  parentNode: (node) => node.parent ?? null,
  patchProp: (el, key, _previousValue, nextValue) => {
    el.props[key] = nextValue
  },
  remove: (child) => {
    const parent = child.parent

    if (!parent) {
      return
    }

    parent.children = parent.children.filter((node) => node !== child)
  },
  setElementText: (node, text) => {
    node.text = text
  },
  setText: (node, text) => {
    node.text = text
  },
})

const render = (vnode: VNode) => {
  const root: RenderNode = {
    children: [],
    props: {},
    type: 'root',
  }

  renderer.render(vnode, root)

  return root
}

const findRenderNode = (
  node: RenderNode,
  type: string,
): RenderNode | undefined => {
  if (node.type === type) {
    return node
  }

  for (const child of node.children) {
    const foundNode = findRenderNode(child, type)

    if (foundNode) {
      return foundNode
    }
  }

  return undefined
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useThemeMode controller', () => {
  it('hydrates from storage and exposes stable slot props', () => {
    const root = createRoot()
    const localStorage = createStorage({ 'theme-mode': 'dark' })

    stubBrowser(root, {
      localStorage,
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const controller = createThemeModeController()

    expect(getThemeModeToggleSlotProps(controller).label).toBe(
      'Toggle theme mode',
    )
    controller.hydrateThemeMode()

    expect(controller.mode.value).toBe('dark')
    expect(controller.resolvedTheme.value).toBe('dark')
    expect(root.attributes.get('data-theme')).toBe('dark')
    expect(root.attributes.get('data-theme-mode')).toBe('dark')
    expect(getThemeModeToggleSlotProps(controller).label).toBe(
      'Switch to light theme',
    )

    const slotProps = getThemeModeToggleSlotProps(controller, {
      labels: {
        auto: 'auto label',
        dark: 'dark label',
        light: 'light label',
      },
    })

    expect(Object.keys(slotProps).sort()).toEqual([
      'iconDisplay',
      'label',
      'mode',
      'nextMode',
      'resolvedTheme',
      'setThemeMode',
      'toggle',
    ])
    expect(slotProps.label).toBe('dark label')
    expect(slotProps.nextMode).toBe('light')
    expect(slotProps.resolvedTheme).toBe('dark')

    slotProps.toggle()

    expect(controller.mode.value).toBe('light')
    expect(controller.resolvedTheme.value).toBe('light')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme-mode', 'light')
  })

  it('hydrates from DOM before storage and keeps pending labels stable', () => {
    const root = createRoot({
      'data-theme': 'light',
      'data-theme-mode': 'auto',
    })

    stubBrowser(root, {
      localStorage: createStorage({ 'theme-mode': 'dark' }),
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const controller = createThemeModeController()
    controller.hydrateThemeMode()

    expect(controller.mode.value).toBe('auto')
    expect(controller.resolvedTheme.value).toBe('light')
    expect(
      getThemeModeToggleSlotProps(controller, {
        pending: true,
        pendingLabel: 'Loading',
      }).label,
    ).toBe('Loading')
  })

  it('uses fallback state without browser APIs', () => {
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)

    const controller = createThemeModeController({ defaultMode: 'light' })

    expect(controller.mode.value).toBe('light')
    expect(controller.resolvedTheme.value).toBe('light')
    expect(() => controller.hydrateThemeMode()).not.toThrow()
    expect(() => controller.setThemeMode('dark')).not.toThrow()
    expect(controller.resolvedTheme.value).toBe('dark')
  })

  it('handles unavailable storage and missing matchMedia', () => {
    const root = createRoot()

    vi.stubGlobal('document', { documentElement: root })
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('blocked')
      },
    })

    const controller = createThemeModeController()

    controller.hydrateThemeMode()
    controller.toggleThemeMode()

    expect(controller.mode.value).toBe('dark')
    expect(root.attributes.get('data-theme')).toBe('dark')

    stubBrowser(createRoot(), {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => {
        throw new Error('blocked')
      }),
    })

    const throwingMatchMediaController = createThemeModeController()

    throwingMatchMediaController.hydrateThemeMode()
    expect(throwingMatchMediaController.resolvedTheme.value).toBe('dark')
  })

  it('uses fallback state when document exists without window', () => {
    vi.stubGlobal('document', { documentElement: createRoot() })
    vi.stubGlobal('window', undefined)

    const controller = createThemeModeController({ defaultMode: 'auto' })

    controller.hydrateThemeMode()

    expect(controller.mode.value).toBe('auto')
    expect(controller.resolvedTheme.value).toBe('dark')
  })

  it('updates auto mode through modern media query listeners', () => {
    const root = createRoot()
    const listeners = new Map<string, () => void>()
    const query = {
      addEventListener: vi.fn((eventName: string, listener: () => void) => {
        listeners.set(eventName, listener)
      }),
      matches: false,
      removeEventListener: vi.fn(),
    }

    stubBrowser(root, {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => query as unknown as MediaQueryList),
    })

    const controller = createThemeModeController()

    controller.hydrateThemeMode()
    query.matches = true
    listeners.get('change')?.()

    expect(controller.resolvedTheme.value).toBe('light')
    expect(root.attributes.get('data-theme')).toBe('light')

    controller.setThemeMode('dark')
    expect(query.removeEventListener).toHaveBeenCalled()

    listeners.get('change')?.()
    expect(controller.resolvedTheme.value).toBe('dark')
  })

  it('supports legacy media query listeners and no listener APIs', () => {
    const root = createRoot()
    let legacyListener: (() => void) | undefined
    const legacyQuery = {
      addListener: vi.fn((listener: () => void) => {
        legacyListener = listener
      }),
      matches: false,
      removeListener: vi.fn(),
    }

    stubBrowser(root, {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => legacyQuery as unknown as MediaQueryList),
    })

    const legacyController = createThemeModeController()

    legacyController.hydrateThemeMode()
    legacyQuery.matches = true
    legacyListener?.()
    expect(legacyController.resolvedTheme.value).toBe('light')

    legacyController.setThemeMode('dark')
    expect(legacyQuery.removeListener).toHaveBeenCalled()

    stubBrowser(createRoot(), {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const controllerWithoutListeners = createThemeModeController()

    expect(() => controllerWithoutListeners.hydrateThemeMode()).not.toThrow()
  })

  it('ignores duplicate sets and storage write failures', () => {
    const root = createRoot()
    const localStorage = createStorage()

    stubBrowser(root, {
      localStorage,
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const controller = createThemeModeController()

    controller.hydrateThemeMode()
    controller.setThemeMode('auto')
    expect(localStorage.removeItem).not.toHaveBeenCalled()

    vi.stubGlobal('window', {
      localStorage: {
        ...localStorage,
        setItem: vi.fn(() => {
          throw new Error('blocked')
        }),
      },
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    expect(() => controller.setThemeMode('dark')).not.toThrow()
  })

  it('uses shared singleton state in useThemeMode', () => {
    const root = createRoot()

    stubBrowser(root, {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const firstController = useThemeMode()
    const secondController = useThemeMode({ storageKey: 'ignored' })

    expect(secondController).toBe(firstController)
  })
})

describe('ThemeModeToggle', () => {
  it('builds slot props for external controllers without internal state', () => {
    const setThemeMode = vi.fn()
    const toggleThemeMode = vi.fn()
    const slotProps = getThemeModeToggleSlotProps({
      hydrateThemeMode: vi.fn(),
      mode: ref<ThemeMode>('light'),
      resolvedTheme: ref<ThemeName>('light'),
      setThemeMode,
      toggleThemeMode,
    })

    expect(slotProps.label).toBe('Switch to auto theme')
    expect(slotProps.nextMode).toBe('auto')
    expect(slotProps.setThemeMode).toBe(setThemeMode)
    expect(slotProps.toggle).toBe(toggleThemeMode)
  })

  it('renders only the custom slot and keeps hydration labels stable', async () => {
    const root = createRoot()

    stubBrowser(root, {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })
    useThemeMode().hydrateThemeMode()

    const tree = render(
      h(
        ThemeModeToggle,
        { pendingLabel: 'Pending' },
        {
          default: (slotProps: { label: string; toggle: () => void }) =>
            h(
              'button',
              {
                onClick: slotProps.toggle,
                title: slotProps.label,
              },
              slotProps.label,
            ),
        },
      ),
    )
    const button = findRenderNode(tree, 'button')

    expect(button?.props.title).toBe('Pending')
    expect(button?.text).toBe('Pending')

    await nextTick()

    expect(button?.props.title).toBe('Switch to dark theme')
  })

  it('renders nothing without a slot', () => {
    const tree = render(h(ThemeModeToggle))

    expect(findRenderNode(tree, 'button')).toBeUndefined()
    expect(findRenderNode(tree, 'comment')).toBeDefined()
  })

  it('uses a custom cycle from component props', async () => {
    vi.resetModules()

    const root = createRoot()

    stubBrowser(root, {
      localStorage: createStorage(),
      matchMedia: vi.fn(() => ({ matches: false }) as MediaQueryList),
    })

    const { ThemeModeToggle: FreshThemeModeToggle } = await import('../src/vue')
    const tree = render(
      h(
        FreshThemeModeToggle,
        { cycle: ['light', 'auto'] },
        {
          default: (slotProps: {
            mode: ThemeMode
            nextMode: ThemeMode
            toggle: () => void
          }) =>
            h(
              'button',
              {
                onClick: slotProps.toggle,
                title: slotProps.nextMode,
              },
              `${slotProps.mode}:${slotProps.nextMode}`,
            ),
        },
      ),
    )
    const button = findRenderNode(tree, 'button')

    expect(button?.props.title).toBe('light')
    expect(button?.text).toBe('auto:light')
    ;(button?.props.onClick as (() => void) | undefined)?.()
    await nextTick()

    expect(button?.props.title).toBe('auto')
    expect(button?.text).toBe('light:auto')
  })
})
