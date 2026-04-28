module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['prettier', 'react-hooks', 'eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',

    // Disable the non-existent rule
    '@react-native/no-deep-imports': 'off',

    // Warn about the any type
    '@typescript-eslint/no-explicit-any': 'warn',

    // TypeScript specific rules - check for unused variables
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Detect StyleSheet rules which are not used in your React components
    'react-native/no-unused-styles': 2,

    // Detect JSX components with inline styles that contain literal values
    'react-native/no-inline-styles': 2,

    //Detect StyleSheet rules and inline styles containing color literals instead of variables
    'react-native/no-color-literals': 2,

    // Detect raw text outside of Text component
    'react-native/no-raw-text': 2,

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['jest.config.js'],
      env: { node: true },
      globals: {
        globalThis: 'readonly',
      },
    },
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
