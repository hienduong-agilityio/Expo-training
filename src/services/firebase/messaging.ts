// React Native
import { Platform } from 'react-native';

// Expo
import * as Device from 'expo-device';

// React Native Firebase
import {
  getMessaging,
  registerDeviceForRemoteMessages,
  getToken,
  requestPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '@react-native-firebase/messaging';

// Services
import { initializeNotificationChannels } from '@app/services/notifications';
import { ensureDefaultFirebaseApp } from '@app/services/firebase/firebase';

// Constants
import { NOTIFICATION_TOPICS } from '@app/constants/notification';

/**
 * Subscribe device to a specific topic
 */
export const subscribeToNotificationTopic = async (
  topic: string,
): Promise<void> => {
  const app = ensureDefaultFirebaseApp();
  const messaging = getMessaging(app);

  await subscribeToTopic(messaging, topic);
};

/**
 * Unsubscribe device from a specific topic
 */
export const unsubscribeFromNotificationTopic = async (
  topic: string,
): Promise<void> => {
  const app = ensureDefaultFirebaseApp();
  const messaging = getMessaging(app);
  await unsubscribeFromTopic(messaging, topic);
};

/**
 * Subscribe device to all default topics
 */
export const subscribeToDefaultTopics = async (): Promise<void> => {
  const topics = Object.values(NOTIFICATION_TOPICS);

  await Promise.all(topics.map(topic => subscribeToNotificationTopic(topic)));
};

/**
 * Get FCM token
 */
export const getFcmToken = async (): Promise<string | undefined> => {
  const app = ensureDefaultFirebaseApp();
  const messaging = getMessaging(app);

  // iOS requires permission request and registration before getting token
  if (Platform.OS === 'ios') {
    if (!Device.isDevice) {
      return undefined;
    }

    const authStatus = await requestPermission(messaging);
    const enabled = authStatus === 1 || authStatus === 2;

    if (!enabled) {
      return undefined;
    }

    await registerDeviceForRemoteMessages(messaging);
  } else {
    // Android
    await registerDeviceForRemoteMessages(messaging);
  }

  await initializeNotificationChannels();

  const token = await getToken(messaging);

  return token ?? undefined;
};
