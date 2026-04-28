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
      googleServicesFile: './config/google-services.json',
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
    /**
     * EAS Update configuration.
     * Docs: https://docs.expo.dev/eas-update/getting-started/
     *
     * - `runtimeVersion.policy: 'appVersion'` — each `package.json#version`
     *   (0.0.1, 0.0.2, …) becomes its own runtime. The server only serves
     *   updates whose runtime matches the native binary, preventing
     *   incompatible JS bundles from reaching users.
     * - `checkAutomatically: 'ON_ERROR_RECOVERY'` — the SDK does not auto-prompt
     *   on launch. We drive checks explicitly via `Updates.useUpdates()` inside
     *   `src/hooks/useOTAUpdate.ts` for a non-blocking UX.
     * - `fallbackToCacheTimeout: 0` — never block the splash screen waiting for
     *   an update; the user reaches the app immediately and any update is
     *   applied on the next restart.
     * - `requestHeaders['expo-channel-name']` — lets the dashboard filter by
     *   channel and matches the binary to the right branch.
     */
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
      enabled: true,
      checkAutomatically: 'ON_ERROR_RECOVERY',
      fallbackToCacheTimeout: 0,
      requestHeaders: {
        'expo-channel-name': process.env.EAS_UPDATE_CHANNEL ?? 'production',
      },
    },
  },
});
