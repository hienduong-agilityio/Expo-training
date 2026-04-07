/**
 * Report bundle size analysis from JSON files
 */

const fs = require('fs');
const path = require('path');

const TMP_DIR = 'tmp';

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function readBundleAnalysis(platform) {
  const jsonFile = path.join(TMP_DIR, `${platform}.json`);

  if (!fs.existsSync(jsonFile)) {
    console.warn(`Bundle file not found: ${jsonFile}`);

    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    return data;
  } catch (error) {
    console.error(`Error reading ${jsonFile}:`, error.message);

    return null;
  }
}

function reportBundleSize(platform, data) {
  if (!data || !data.results || data.results.length === 0) {
    console.log(`${platform.toUpperCase()} bundle:`);

    return;
  }

  const totalBytes = data.results[0].totalBytes || 0;

  console.log(`${platform.toUpperCase()} bundle:`);
  console.log(`total size: ${formatBytes(totalBytes)}`);

  if (data.results[0].files && totalBytes > 0) {
    const files = data.results[0].files;
    const sortedFiles = Object.entries(files)
      .sort(([, a], [, b]) => b.size - a.size)
      .slice(0, 10);

    console.log('\n largest files:');

    sortedFiles.forEach(([file, info], index) => {
      const percentage = ((info.size / totalBytes) * 100).toFixed(2);

      console.log(`${index + 1}. ${file}`);
      console.log(`${formatBytes(info.size)} (${percentage}%)`);
    });
  }
}

function main() {
  console.log('Bundle report');

  const androidData = readBundleAnalysis('android');
  const iosData = readBundleAnalysis('ios');

  if (androidData) {
    reportBundleSize('android', androidData);
  }

  if (iosData) {
    reportBundleSize('ios', iosData);
  }

  if (!androidData && !iosData) {
    process.exit(1);
  }
}

main();
