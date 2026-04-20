import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Một lần duy nhất / process: log runtime info ra console.
 * Trong prod nên route vào Sentry/Analytics thay cho `console.log`.
 */
let runtimeInfoLogged = false;
const logRuntimeInfoOnce = () => {
  if (runtimeInfoLogged) {
    return;
  }
  runtimeInfoLogged = true;
  const info = {
    runtimeVersion: Updates.runtimeVersion,
    channel: Updates.channel,
    updateId: Updates.updateId,
    createdAt: Updates.createdAt?.toISOString?.(),
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
  };
  console.log('[OTA] runtime info', info);
};

/**
 * Best-practice OTA update hook for EAS Update.
 *
 * Tham khảo:
 *  - https://docs.expo.dev/eas-update/getting-started/
 *  - https://docs.expo.dev/versions/latest/sdk/updates/#useupdates
 *
 * Behaviour:
 *  1. Bỏ qua hoàn toàn ở dev / Expo Go (Updates module disabled).
 *  2. Tự động check khi app cold-start và mỗi lần app từ background trở lại
 *     foreground (>= MIN_CHECK_INTERVAL_MS để tránh spam).
 *  3. Nếu có update => tự fetch ngầm. Sau khi fetch xong:
 *       - Update có flag `isCritical` (đọc từ manifest extra) => reload ngay.
 *       - Ngược lại => set `isUpdateReady = true` để UI prompt user "Restart now / Later".
 *  4. Expose error riêng cho check/download để log telemetry.
 */
const MIN_CHECK_INTERVAL_MS = 60_000;

type CriticalManifestExtra = {
  isCritical?: boolean;
  releaseNotes?: string;
};

const readCriticalFlag = (
  manifest: Updates.Manifest | null | undefined,
): { isCritical: boolean; releaseNotes?: string } => {
  if (!manifest || typeof manifest !== 'object') {
    return { isCritical: false };
  }
  const extra = (manifest as { extra?: CriticalManifestExtra }).extra;
  return {
    isCritical: Boolean(extra?.isCritical),
    releaseNotes: extra?.releaseNotes,
  };
};

export const useOTAUpdate = () => {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    availableUpdate,
    downloadedUpdate,
    checkError,
    downloadError,
  } = Updates.useUpdates();

  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const lastCheckRef = useRef<number>(0);

  const checkForUpdates = useCallback(
    async (force = false) => {
      if (!Updates.isEnabled || __DEV__) {
        return;
      }
      const now = Date.now();
      if (!force && now - lastCheckRef.current < MIN_CHECK_INTERVAL_MS) {
        return;
      }
      lastCheckRef.current = now;
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[OTA] checkForUpdates failed', error);
        }
      }
    },
    [],
  );

  const applyUpdate = useCallback(async () => {
    if (isApplying) {
      return;
    }
    setIsApplying(true);
    try {
      await Updates.reloadAsync();
    } catch (error) {
      setIsApplying(false);
      if (__DEV__) {
        console.warn('[OTA] reloadAsync failed', error);
      }
    }
  }, [isApplying]);

  const dismissUpdate = useCallback(() => {
    setIsUpdateReady(false);
  }, []);

  useEffect(() => {
    logRuntimeInfoOnce();
    void checkForUpdates(true);

    const sub = AppState.addEventListener(
      'change',
      (next: AppStateStatus) => {
        if (next === 'active') {
          void checkForUpdates();
        }
      },
    );
    return () => sub.remove();
  }, [checkForUpdates]);

  useEffect(() => {
    if (!isUpdatePending || !downloadedUpdate) {
      return;
    }
    const { isCritical } = readCriticalFlag(downloadedUpdate.manifest);
    if (isCritical) {
      void applyUpdate();
      return;
    }
    setIsUpdateReady(true);
  }, [isUpdatePending, downloadedUpdate, applyUpdate]);

  return {
    runtimeVersion: currentlyRunning.runtimeVersion,
    channel: currentlyRunning.channel,
    updateId: currentlyRunning.updateId,
    isUpdateAvailable,
    isUpdatePending,
    isUpdateReady,
    isChecking,
    isDownloading,
    isApplying,
    checkError,
    downloadError,
    availableUpdate,
    downloadedUpdate,
    releaseNotes: downloadedUpdate
      ? readCriticalFlag(downloadedUpdate.manifest).releaseNotes
      : undefined,
    isNativePlatform: Platform.OS !== 'web',
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
  };
};
