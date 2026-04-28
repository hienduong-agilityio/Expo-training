// const ReactCompilerConfig = {
//   target: '19',
// };

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // ['babel-plugin-react-compiler', ReactCompilerConfig],
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
