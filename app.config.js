const { NON_STANDARD_SYMBOL } = require('@expo/config/build/environment');
const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

const { ensureToolsAvailable, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

const FCM_META_TOOLS_REPLACE = [
  {
    name: 'com.google.firebase.messaging.default_notification_channel_id',
    replace: 'android:value',
  },
  {
    name: 'com.google.firebase.messaging.default_notification_color',
    replace: 'android:resource',
  },
];

function withFirebaseMessagingToolsReplace(config) {
  return withAndroidManifest(config, cfg => {
    const manifest = cfg.modResults;

    ensureToolsAvailable(manifest);

    const mainApplication = getMainApplicationOrThrow(manifest);
    const items = mainApplication['meta-data'];

    if (!Array.isArray(items)) {
      return cfg;
    }

    for (const item of items) {
      const metaName = item?.$?.['android:name'];
      const rule = FCM_META_TOOLS_REPLACE.find(r => r.name === metaName);
      if (rule) {
        item.$['tools:replace'] = rule.replace;
      }
    }
    return cfg;
  });
}

const EXPO_OWNER = 'hienduong';

/**
 * `config` is the **expo** object from app.json (merged with defaults), not `{ expo: ... }`.
 * Return `{ expo }` and preserve NON_STANDARD_SYMBOL on the return value so static+dynamic
 * merge is detected (expo-doctor / mayHaveUnusedStaticConfig).
 * @see https://docs.expo.dev/workflow/configuration/
 */
module.exports = ({ config }) => {
  const expo = {
    ...config,
    owner: EXPO_OWNER,
    plugins: [withFirebaseMessagingToolsReplace, ...(config.plugins ?? [])],
  };
  const result = { expo };
  if (config[NON_STANDARD_SYMBOL]) {
    result[NON_STANDARD_SYMBOL] = config[NON_STANDARD_SYMBOL];
  }
  return result;
};
