module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // TODO: Disabled 'babel-plugin-react-compiler' due to React compiler compatibility issues.
    // 'babel-plugin-react-compiler',
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@app': './src/',
        },
      },
    ],
  ],
};
