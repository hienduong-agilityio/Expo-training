import { Platform } from 'react-native';
import * as Application from 'expo-application';

/**
 * Stable per-install device id for backend device-token rows (replaces react-native-device-info getUniqueId).
 * Android: ANDROID_ID. iOS: identifierForVendor (can be null briefly after reboot — caller may retry).
 */
export async function getStableDeviceId(): Promise<string> {
  if (Platform.OS === 'android') {
    return Application.getAndroidId();
  }
  const idfv = await Application.getIosIdForVendorAsync();

  if (idfv) {
    return idfv;
  }

  const bundle = Application.applicationId ?? 'app';

  return `ios-unknown:${bundle}`;
}
