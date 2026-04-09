const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const { createSerializer } = require('react-native-bundle-discovery');
const { withRozenite } = require('@rozenite/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const mySerializer = createSerializer({
  includeCode: false, // Useful if you want to compare source/bundle code (but a report file will be larger)
  projectRoot: __dirname,
  // ⚠️ WARNING: In a monorepo setup, this should point to the monorepo root, not the individual package directory.
});

const customConfig = {
  transformer: {
    unstable_allowRequireContext: true,
  },
  resolver: {
    alias: {
      '@app': './src',
    },
  },
  serializer: {
    customSerializer: mySerializer,
  },
};

// Merge default config with custom config
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Apply Rozenite configuration
const isRozeniteEnabled =
  process.env.WITH_ROZENITE === 'true' ||
  (process.env.WITH_ROZENITE === undefined &&
    process.env.NODE_ENV !== 'production');

/**
 * RN may set watcher.unstable_workerThreads; expo-doctor's Metro schema rejects it.
 * withRozenite() returns an async loader — strip on the resolved config, not on the function.
 */
function stripUnstableWatcherThreads(config) {
  if (!config || typeof config !== 'object') return;
  if (config.watcher && typeof config.watcher === 'object') {
    const { unstable_workerThreads: _w, ...rest } = config.watcher;
    if (Object.keys(rest).length === 0) {
      delete config.watcher;
    } else {
      config.watcher = rest;
    }
  }
}

stripUnstableWatcherThreads(mergedConfig);

const loadRozeniteConfig = withRozenite(mergedConfig, {
  enabled: isRozeniteEnabled,
  include: [
    '@rozenite/performance-monitor-plugin',
    '@rozenite/network-activity-plugin',
    '@rozenite/tanstack-query-plugin',
  ],
});

module.exports = async function metroConfig() {
  const config = await loadRozeniteConfig();
  stripUnstableWatcherThreads(config);
  return config;
};
