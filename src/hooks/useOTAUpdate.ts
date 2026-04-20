import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Minimum interval between consecutive update checks triggered by app-resume.
 * Prevents spam when users quickly background/foreground the app.
 */
const MIN_CHECK_INTERVAL_MS = 60_000;

type CriticalManifestExtra = {
  isCritical?: boolean;
  releaseNotes?: string;
};

let runtimeInfoLogged = false;

/**
 * Log runtime info once per process so QA and crash reports can correlate
 * behaviour with the actual update running on-device. In production this
 * should be forwarded to Sentry/Datadog instead of `console.log`.
 */
const logRuntimeInfoOnce = () => {
  if (runtimeInfoLogged) {
    return;
  }
  runtimeInfoLogged = true;
  console.log('[OTA] runtime info', {
    runtimeVersion: Updates.runtimeVersion,
    channel: Updates.channel,
    updateId: Updates.updateId,
    createdAt: Updates.createdAt?.toISOString?.(),
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
  });
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

/**
 * Fire-and-forget async work without `void` + explicit rejection handling
 * (covers cases where a promise rejects outside an inner try/catch).
 */
const runUpdatePromise = (promise: Promise<unknown>, context: string) => {
  promise.catch((error: unknown) => {
    if (__DEV__) {
      console.warn(`[OTA] ${context}`, error);
    }
  });
};

/**
 * Best-practice OTA hook built on top of `expo-updates`.
 *
 * Behaviour:
 *   1. No-op in dev / Expo Go (`Updates.isEnabled` is false there).
 *   2. Checks on cold start and on each background → foreground transition,
 *      throttled by `MIN_CHECK_INTERVAL_MS`.
 *   3. If an update is available it is fetched silently. On completion:
 *        - Critical updates (`manifest.extra.isCritical`) reload immediately.
 *        - Otherwise `isUpdateReady` becomes true so the UI can prompt the user.
 *   4. Check/download errors are surfaced so callers can forward them to telemetry.
 *
 * Docs:
 *   - https://docs.expo.dev/eas-update/getting-started/
 *   - https://docs.expo.dev/versions/latest/sdk/updates/#useupdates
 */
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
    runUpdatePromise(checkForUpdates(true), 'checkForUpdates (cold start)');

    const sub = AppState.addEventListener(
      'change',
      (next: AppStateStatus) => {
        if (next === 'active') {
          runUpdatePromise(checkForUpdates(), 'checkForUpdates (foreground)');
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      runUpdatePromise(applyUpdate(), 'applyUpdate (critical)');
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
