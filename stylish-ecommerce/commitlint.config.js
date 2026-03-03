module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of these values
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only changes
        'style', // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system or external dependencies
        'ci', // CI configuration changes
        'chore', // Other changes that don't modify src or test files
        'revert', // Revert a previous commit
      ],
    ],
    // Subject should not be empty
    'subject-empty': [2, 'never'],
    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Subject should be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Type should not be empty
    'type-empty': [2, 'never'],
    // Type should be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Header max length
    'header-max-length': [2, 'always', 100],
  },
};
