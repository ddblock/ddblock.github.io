import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
import astroPlugin from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import stylistic from '@stylistic/eslint-plugin';

// Common style rules
const styleRules = {
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/max-len': ['error', { 
    code: 100,
    ignoreUrls: true,
    ignoreStrings: true,
    ignoreTemplateLiterals: true,
    ignoreRegExpLiterals: true,
  }],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/arrow-parens': ['error', 'always'],
  '@stylistic/brace-style': ['error', '1tbs'],
};

// Astro-specific style rules with more lenient line length
const astroStyleRules = {
  ...styleRules,
  '@stylistic/max-len': ['error', { 
    code: 120,
    ignoreUrls: true,
    ignoreStrings: true,
    ignoreTemplateLiterals: true,
    ignoreRegExpLiterals: true,
    ignorePattern: '^\\s*<.*>$', // Ignore JSX/HTML lines
  }],
};

export default [
  // Base config for all files
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...styleRules,
    },
  },
  // JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...eslint.configs.recommended,
    rules: {
      ...styleRules,
    },
  },
  // Astro files
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin,
      'jsx-a11y': jsxA11y,
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
      ...astroStyleRules,
      'no-unused-vars': 'warn',
    },
  },
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...styleRules,
      'no-unused-vars': 'warn',
    },
  },
]; 