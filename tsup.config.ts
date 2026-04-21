import { defineConfig } from 'tsup'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  clean: true,
  entry: {
    'core/index': 'src/core/index.ts',
    'nuxt/module': 'src/nuxt/module.ts',
    'vue/index': 'src/vue/index.ts',
  },
  external: ['@nuxt/kit', '@nuxt/schema', 'nuxt', 'vue'],
  format: ['esm', 'cjs'],
  publicDir: 'public',
  target: 'es2022',
})
