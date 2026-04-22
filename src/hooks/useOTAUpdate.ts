import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import * as Updates from 'expo-updates';

const MIN_CHECK_INTERVAL_MS = 60_000;

const OTA_ENABLED = Updates.isEnabled && !__DEV__;

const logWarn = (ctx: string, error: unknown) => {
  if (__DEV__) {
    console.warn(`[OTA] ${ctx}`, error);
  }
};

const getReleaseNotes = (
  info: Updates.UpdateInfo | undefined,
): string | undefined => {
  if (info?.type !== 'new') {
    return undefined;
  }
  const extra = (
    info.manifest as { extra?: { releaseNotes?: string } } | undefined
  )?.extra;
  return extra?.releaseNotes;
};

/**
 * Drives the EAS Update lifecycle:
 * - Cold-start + foreground checks via `Updates.checkForUpdateAsync()`.
 * - Auto `Updates.fetchUpdateAsync()` when the server reports an update for the current runtime.
 * - `isUpdateReady` flips true when a new `updateId` finishes downloading so the UI can prompt.
 *
 * Runtime is bound to `package.json#version` (`runtimeVersion.policy: 'appVersion'`), so only
 * updates published for the same binary ever reach the device.
 *
 * Must be mounted **once** (see `<OTAUpdateGate />`). Mounting this hook from multiple
 * components would duplicate the cold-start / foreground check effects.
 */
export const useOTAUpdate = () => {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
    isChecking,
    isDownloading,
    downloadedUpdate,
    checkError,
    downloadError,
  } = Updates.useUpdates();

  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const lastCheckAtRef = useRef(0);
  const lastPromptedUpdateIdRef = useRef<string | null>(null);

  const checkForUpdate = useCallback(async (force = false) => {
    if (!OTA_ENABLED) {
      return;
    }

    const now = Date.now();

    if (!force && now - lastCheckAtRef.current < MIN_CHECK_INTERVAL_MS) {
      return;
    }

    lastCheckAtRef.current = now;

    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
      }
    } catch (error) {
      logWarn('checkForUpdate failed', error);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (isApplying) {
      return;
    }

    setIsApplying(true);

    try {
      await Updates.reloadAsync();
    } catch (error) {
      setIsApplying(false);
      logWarn('reloadAsync failed', error);
    }
  }, [isApplying]);

  const dismissUpdate = useCallback(() => {
    setIsUpdateReady(false);
  }, []);

  useEffect(() => {
    checkForUpdate(true);
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') {
        checkForUpdate();
      }
    });
    return () => sub.remove();
  }, [checkForUpdate]);

  useEffect(() => {
    if (!isUpdatePending || downloadedUpdate?.type !== 'new') {
      return;
    }
    const { updateId } = downloadedUpdate;
    if (!updateId || updateId === lastPromptedUpdateIdRef.current) {
      return;
    }
    lastPromptedUpdateIdRef.current = updateId;
    setIsUpdateReady(true);
  }, [isUpdatePending, downloadedUpdate]);

  return {
    runtimeVersion: currentlyRunning.runtimeVersion,
    channel: currentlyRunning.channel,
    updateId: currentlyRunning.updateId,
    isEmbeddedLaunch: currentlyRunning.isEmbeddedLaunch,
    isUpdateAvailable,
    isUpdatePending,
    isUpdateReady,
    isChecking,
    isDownloading,
    isApplying,
    checkError,
    downloadError,
    releaseNotes: getReleaseNotes(downloadedUpdate),
    isNativePlatform: Platform.OS !== 'web',
    checkForUpdate,
    applyUpdate,
    dismissUpdate,
  };
};

export type UseOTAUpdateReturn = ReturnType<typeof useOTAUpdate>;
