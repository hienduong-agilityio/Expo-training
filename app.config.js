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

const pkg = require('./package.json');

const EXPO_OWNER = 'hienduongs-organization';

/** Must match the Expo project linked to this repo (EAS / expo.dev). */
const EAS_PROJECT_ID = 'aa1fbe91-06a1-4141-b4a9-9754bb2cadfa';

const GOOGLE_SERVICES_JSON_LOCAL = './config/google-services.json';
const GOOGLE_SERVICE_INFO_PLIST_LOCAL = './config/GoogleService-Info.plist';

/** Single source of truth: use `app.config.js` only. @see https://docs.expo.dev/workflow/configuration/ */
module.exports = () => ({
  expo: {
    name: 'StylishEcommerce',
    slug: 'expo-training',
    version: pkg.version,
    owner: EXPO_OWNER,
    scheme: 'stylish',
    icon: './assets/images/icon.png',
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#dbe7f0',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    android: {
      package: 'com.reactnativetemplate',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon-foreground.png',
        backgroundColor: '#dbe7f0',
      },
      "googleServicesFile": "./config/google-services.json"
    },
    ios: {
      bundleIdentifier: 'org.reactjs.native.example.StylishEcommerce',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      googleServicesFile:
        process.env.GOOGLE_SERVICE_INFO_PLIST ??
        GOOGLE_SERVICE_INFO_PLIST_LOCAL,
    },
    plugins: [
      withFirebaseMessagingToolsReplace,
      'expo-router',
      [
        'expo-notifications',
        {
          icon: './assets/images/notification-icon.png',
          color: '#dbe7f0',
          defaultChannel: 'general',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            extraPods: [
              {
                name: 'GoogleUtilities',
                modular_headers: true,
              },
            ],
          },
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './src/assets/fonts/Montserrat-Thin.ttf',
            './src/assets/fonts/Montserrat-ExtraLight.ttf',
            './src/assets/fonts/Montserrat-Light.ttf',
            './src/assets/fonts/Montserrat-Regular.ttf',
            './src/assets/fonts/Montserrat-Medium.ttf',
            './src/assets/fonts/Montserrat-SemiBold.ttf',
            './src/assets/fonts/Montserrat-Bold.ttf',
            './src/assets/fonts/Montserrat-ExtraBold.ttf',
            './src/assets/fonts/Poppins-Regular.ttf',
            './src/assets/fonts/Roboto-Regular.ttf',
            './src/assets/fonts/Roboto-Medium.ttf',
          ],
        },
      ],
      'expo-secure-store',
    ],
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
  },
});
