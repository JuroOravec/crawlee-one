// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const crawleeOneRoot = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/examples/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: crawleeOneRoot,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    rules: {
      'max-params': ['error', 4],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  }
);
