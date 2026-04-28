import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

import type { UseOTAUpdateReturn } from '@app/hooks/useOTAUpdate';
import { colors } from '@app/themes';

const VISIBLE_CHANNELS = new Set(['development', 'preview']);

const shortId = (id?: string | null) =>
  id && id.length > 8 ? `${id.slice(0, 8)}…` : id ?? 'embedded';

type RuntimeBadgeProps = Pick<
  UseOTAUpdateReturn,
  | 'runtimeVersion'
  | 'channel'
  | 'updateId'
  | 'isUpdateAvailable'
  | 'isUpdatePending'
  | 'isChecking'
  | 'isDownloading'
  | 'checkForUpdate'
>;

/**
 * QA-only corner badge. Visible in `__DEV__` and on `development` / `preview` channels.
 * Tap the badge to expand; tap "Check now" to manually exercise
 * `Updates.checkForUpdateAsync()` + `Updates.fetchUpdateAsync()`.
 */
export const RuntimeBadge = ({
  runtimeVersion,
  channel,
  updateId,
  isUpdateAvailable,
  isUpdatePending,
  isChecking,
  isDownloading,
  checkForUpdate,
}: RuntimeBadgeProps) => {
  const [expanded, setExpanded] = useState(false);

  const visible = __DEV__ || (channel ? VISIBLE_CHANNELS.has(channel) : false);
  if (!visible) {
    return null;
  }

  const busyLabel = isChecking
    ? 'Checking…'
    : isDownloading
      ? 'Downloading…'
      : 'Check now';

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setExpanded(v => !v)}>
        <View style={styles.badge}>
          <Text style={styles.text}>
            rt {runtimeVersion ?? '?'} · {channel ?? 'embedded'} ·{' '}
            {shortId(updateId)}
          </Text>
          {expanded && (
            <View style={styles.details}>
              <Text style={styles.detailText}>
                isEmbeddedLaunch: {String(Updates.isEmbeddedLaunch)}
              </Text>
              <Text style={styles.detailText}>
                isEmergencyLaunch: {String(Updates.isEmergencyLaunch)}
              </Text>
              <Text style={styles.detailText}>
                isUpdateAvailable: {String(isUpdateAvailable)}
              </Text>
              <Text style={styles.detailText}>
                isUpdatePending: {String(isUpdatePending)}
              </Text>
              <Text style={styles.detailText}>
                createdAt: {Updates.createdAt?.toISOString?.() ?? '—'}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
      {expanded && (
        <Pressable
          disabled={isChecking || isDownloading}
          onPress={() => checkForUpdate(true)}
          style={[
            styles.button,
            (isChecking || isDownloading) && styles.buttonDisabled,
          ]}>
          <Text style={styles.buttonText}>{busyLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    zIndex: 9999,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: colors.overlayStrong,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: 280,
  },
  text: { color: colors.white, fontSize: 10, fontFamily: 'monospace' },
  details: { marginTop: 4 },
  detailText: {
    color: colors.gray,
    fontSize: 9,
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 4,
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
