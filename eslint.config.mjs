import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['.typecheck/**', 'coverage/**', 'dist/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['*.mjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
)
