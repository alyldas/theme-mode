// noinspection JSUnusedGlobalSymbols
export default {
  test: {
    coverage: {
      exclude: ['smoke/**', 'src/nuxt/**'],
      include: ['src/core/**/*.ts', 'src/vue/**/*.ts'],
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
}
