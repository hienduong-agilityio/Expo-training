import * as Notifications from 'expo-notifications';

/**
 * Ensure Expo can present notifications
 */
export async function ensureExpoNotificationPermissionsAsync(): Promise<Notifications.PermissionStatus> {
  const { status: existing } = await Notifications.getPermissionsAsync();

  if (existing === 'granted') {
    return existing;
  }

  const { status } = await Notifications.requestPermissionsAsync();

  return status;
}
