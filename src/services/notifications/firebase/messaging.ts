import { Platform } from 'react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import {
  NOTIFICATION_TIMING,
  NOTIFICATION_TOPICS,
} from '@app/constants/notification';
import type { NotificationData } from '@app/interfaces/notification';

import { initializeNotificationChannels } from '../channels';
import { setupNotificationHandlers } from '../handlers';
import {
  mapExpoNotificationToRemotePayload,
  parseRemotePayloadToNotificationData,
} from '../notificationPayload';
import { presentForegroundRemotePush } from './foregroundPush';

const activeListenerRegistration = {
  dispose: undefined as (() => void) | undefined,
};

const runOnAndroid = async (action: () => Promise<unknown>): Promise<void> => {
  if (Platform.OS === 'android') {
    await action();
  }
};

const ensureTokenPermission = async (): Promise<boolean> => {
  const { status: initial } = await Notifications.getPermissionsAsync();
  if (initial === 'granted') {
    return true;
  }
  if (Platform.OS !== 'android') {
    return false;
  }
  const { status: afterRequest } =
    await Notifications.requestPermissionsAsync();
  return afterRequest === 'granted';
};

export const deliverPendingQuitStateNotification = async (
  onOpened?: (data: NotificationData | undefined) => void,
): Promise<void> => {
  if (!onOpened) {
    return;
  }

  const response = await Notifications.getLastNotificationResponseAsync().catch(
    () => null,
  );
  const fromTap = response?.notification;
  if (!fromTap) {
    return;
  }

  const payload = mapExpoNotificationToRemotePayload(fromTap);
  const data = parseRemotePayloadToNotificationData(payload);

  setTimeout(
    () => onOpened(data),
    NOTIFICATION_TIMING.INITIAL_NOTIFICATION_DELAY,
  );
};

export const subscribeToNotificationTopic = (topic: string): Promise<void> =>
  runOnAndroid(() => Notifications.subscribeToTopicAsync(topic));

export const unsubscribeFromNotificationTopic = (
  topic: string,
): Promise<void> =>
  runOnAndroid(() => Notifications.unsubscribeFromTopicAsync(topic));

export const subscribeToDefaultTopics = (): Promise<void> =>
  subscribeToNotificationTopic(NOTIFICATION_TOPICS.ALL);

export const getFcmToken = async (): Promise<string | undefined> => {
  if (Platform.OS === 'ios' && !Device.isDevice) {
    return undefined;
  }

  await initializeNotificationChannels();

  if (!(await ensureTokenPermission())) {
    return undefined;
  }

  try {
    const { data } = await Notifications.getDevicePushTokenAsync();
    return typeof data === 'string' ? data : undefined;
  } catch {
    return undefined;
  }
};

export const registerListenerWithFCM = (
  onOpened?: (data: NotificationData | undefined) => void,
  onTokenChanged?: (token: string) => void,
): (() => void) | undefined => {
  try {
    activeListenerRegistration.dispose?.();
    activeListenerRegistration.dispose = undefined;

    const teardown: Array<() => void> = [setupNotificationHandlers(onOpened)];

    const foreground = Notifications.addNotificationReceivedListener(
      notification => {
        presentForegroundRemotePush(notification).catch(() => {});
      },
    );

    teardown.push(() => foreground.remove());

    if (onTokenChanged) {
      const tokenSub = Notifications.addPushTokenListener(deviceToken => {
        const token =
          typeof deviceToken.data === 'string' && deviceToken.data.length > 0
            ? deviceToken.data
            : undefined;
        if (!token) {
          return;
        }
        Promise.resolve(onTokenChanged(token)).catch(() => {});
      });
      teardown.push(() => tokenSub.remove());
    }

    const dispose = () => {
      teardown.forEach(off => off());
      activeListenerRegistration.dispose = undefined;
    };

    activeListenerRegistration.dispose = dispose;
    return dispose;
  } catch {
    return undefined;
  }
};
