import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { initializeNotificationChannels } from './channels';

type ExpoPushTokenResult =
  | { ok: true; token: string }
  | { ok: false; message: string };

/**
 * Initialize Android channels and request notification permission.
 * Works on **both** emulator and real device — required before any
 * `scheduleNotificationAsync` call (and before the Android 13+ permission prompt).
 */
export async function ensureNotificationPermissionAsync(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      await initializeNotificationChannels();
    } catch {
      // best-effort; channels are not fatal for local notifications on newer OS versions
    }
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function getExpoPushTokenResultAsync(): Promise<ExpoPushTokenResult> {
  const granted = await ensureNotificationPermissionAsync();
  if (!granted) {
    return {
      ok: false,
      message: 'Permission not granted to get push token for push notification!',
    };
  }

  if (!Device.isDevice) {
    return {
      ok: false,
      message: 'Must use physical device for push notifications',
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
 * Real device only (Expo/FCM requires a physical device to mint a push token).
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
