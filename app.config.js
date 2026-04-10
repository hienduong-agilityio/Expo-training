const appJson = require('./app.json');
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

/** First entry runs last on AndroidManifest — must run after expo-notifications. */
module.exports = {
  expo: {
    ...appJson.expo,
    owner: EXPO_OWNER,
    plugins: [withFirebaseMessagingToolsReplace, ...appJson.expo.plugins],
  },
};
