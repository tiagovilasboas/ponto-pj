import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores([
    'dist',
    'build',
    'coverage',
    'node_modules',
    'src/test/**/*',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.test.js',
    '**/*.test.jsx',
    '*.min.js',
    '*.min.css',
    '.env*',
    '.vscode',
    '.idea',
    '.DS_Store',
    'Thumbs.db',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
