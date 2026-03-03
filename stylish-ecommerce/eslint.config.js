// ESLint flat config (CommonJS - use require/module.exports so Node loads as CJS)
// Requires ESLint 9+ for eslint-config-expo/flat
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const reactCompiler = require('eslint-plugin-react-compiler');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = [
  // Expo base (TypeScript, React, React Hooks)
  ...expoConfig,

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'web-build/',
      'ios/',
      'android/',
      'coverage/',
      'metro.config.js',
      'jest.config.js',
      'babel.config.js',
      '**/*.d.ts',
      'jest.setup.js',
    ],
  },

  // Import resolver
  {
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  },

  // Enabling the linter for automatic memoization
  reactCompiler.configs.recommended,

  // Prettier config to disable conflicting rules
  prettierConfig,

  // TypeScript custom rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },

  // React + React Native + general
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      'react-native': reactNativePlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Native specific rules
      'react-native/no-inline-styles': 'error',

      // TODO: Uncomment this when we have a way to test this rule
      // 'react-native/no-unused-styles': 'error',
      'react-native/no-color-literals': 'error',
      'react-native/no-deep-imports': 'off',
      'react-native/no-raw-text': [
        'warn',
        { skip: ['ThemedText'] },
      ],

      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Test files - relax some rules
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    rules: {
      'react-native/no-raw-text': 'off',
      'react-native/no-color-literals': 'off',
    },
  },
];
