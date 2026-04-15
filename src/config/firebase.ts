import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';

const readExpoPublicFirebaseOptions = (): FirebaseOptions | null => {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey?.trim() || !appId?.trim()) {
    return null;
  }

  return {
    apiKey,
    appId,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};

const getExistingOrInitializeApp = (options: FirebaseOptions): FirebaseApp => {
  const apps = getApps();
  return apps.length === 0 ? initializeApp(options) : apps[0]!;
};

export const getFirebaseApp = (): FirebaseApp | null => {
  const options = readExpoPublicFirebaseOptions();
  return options ? getExistingOrInitializeApp(options) : null;
};
