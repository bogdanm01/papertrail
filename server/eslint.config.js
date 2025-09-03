// eslint.config.js
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default [
  { ignores: ['dist/**'] },

  // JS base rules (note we use `eslint`, not `js`)
  eslint.configs.recommended,

  // TS rule sets (these are arrays; spread them)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Perfectionist preset
  perfectionist.configs['recommended-natural'],

  // Enable type-aware linting for TS files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // points to your server/tsconfig.json
        tsconfigRootDir, // resolves relative to this file
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
