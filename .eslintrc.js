module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/jsx-runtime', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // Disable the non-existent rule
    '@react-native/no-deep-imports': 'off',

    // Warn about the any type
    '@typescript-eslint/no-explicit-any': 'warn',

    // Detect StyleSheet rules which are not used in your React components
    'react-native/no-unused-styles': 2,

    // Detect JSX components with inline styles that contain literal values
    'react-native/no-inline-styles': 2,

    //Detect StyleSheet rules and inline styles containing color literals instead of variables
    'react-native/no-color-literals': 2,

    // Detect raw text outside of Text component
    'react-native/no-raw-text': 2,
  },
  overrides: [
    {
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
