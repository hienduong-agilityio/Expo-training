import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { initializeNotificationChannels } from './channels';

type ExpoPushTokenResult =
  | { ok: true; token: string }
  | { ok: false; message: string };

async function getExpoPushTokenResultAsync(): Promise<ExpoPushTokenResult> {
  if (Platform.OS === 'android') {
    try {
      await initializeNotificationChannels();
    } catch {
      // best-effort
    }
  }

  if (!Device.isDevice) {
    return { ok: false, message: 'Must use physical device for push notifications' };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return {
      ok: false,
      message: 'Permission not granted to get push token for push notification!',
    };
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    return { ok: false, message: 'Project ID not found' };
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    if (typeof pushTokenString === 'string' && pushTokenString.length > 0) {
      return { ok: true, token: pushTokenString };
    }
    return { ok: false, message: 'Empty push token from Expo' };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Token for debugging / server registration — does not throw and does not show alerts.
 */
export async function tryGetExpoPushTokenAsync(): Promise<ExpoPushTokenResult> {
  return getExpoPushTokenResultAsync();
}

function handleRegistrationError(errorMessage: string): never {
  console.warn('[ExpoPush]', errorMessage);
  throw new Error(errorMessage);
}

/** Strict registration (throws on failure). Prefer {@link tryGetExpoPushTokenAsync} for silent flows. */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  const r = await getExpoPushTokenResultAsync();
  if (r.ok) {
    console.log(r.token);
    return r.token;
  }
  handleRegistrationError(r.message);
}
