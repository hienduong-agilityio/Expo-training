/**
 * Build production bundles (android / ios)
 */

const { execSync } = require('child_process');
const fs = require('fs');

const format = process.argv[2];

if (!format) {
  console.error('Usage: node analyze-bundle.js <json|html|tsv>');
  process.exit(1);
}

fs.mkdirSync('tmp', { recursive: true });

function run(command) {
  execSync(command, {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });
}

function bundleAndAnalyze(platform) {
  const bundleFile = `tmp/index.${platform}.bundle`;
  const sourcemapFile = `tmp/index.${platform}.bundle.map`;
  const outputFile = `tmp/${platform}.${format}`;

  const bundleCmd = `
    react-native bundle
      --platform ${platform}
      --dev false
      --entry-file index.js
      --bundle-output ${bundleFile}
      --sourcemap-output ${sourcemapFile}
  `.replace(/\s+/g, ' ');

  let analyzeCmd;

  if (format === 'html') {
    analyzeCmd = `
      npx source-map-explorer
        ${bundleFile}
        ${sourcemapFile}
        --html ${outputFile}
        --no-border-checks
    `.replace(/\s+/g, ' ');
  } else {
    analyzeCmd = `
      npx source-map-explorer
        ${bundleFile}
        ${sourcemapFile}
        --${format}
        --no-border-checks
        > ${outputFile}
    `.replace(/\s+/g, ' ');
  }

  run(bundleCmd, `Bundling ${platform}`);
  run(analyzeCmd, `Analyzing ${platform} (${format})`);
}

bundleAndAnalyze('android');
bundleAndAnalyze('ios');
