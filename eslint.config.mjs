// @ts-check

import eslint from '@eslint/js';
import * as eslintPluginAstro from 'eslint-plugin-astro';
// @ts-expect-error No types available
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import * as eslintPluginTypescript from 'typescript-eslint';

export default eslintPluginTypescript.config(
  eslint.configs.recommended,
  eslintPluginTypescript.configs.strictTypeChecked,

  eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      semi: ['error', 'always'],
      'no-console': 'off', // JS code is for the server side during builds anyway, so logging stuff is fine
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      // These rules are incompatible with Astro due to the way it handles JSX
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  eslintPluginImport.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,astro}'],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json'],
        },
      },
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  eslintPluginPrettierRecommended,
);
