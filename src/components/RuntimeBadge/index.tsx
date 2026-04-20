import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

import { useOTAUpdate } from '@app/hooks/useOTAUpdate';

const VISIBLE_CHANNELS = new Set(['development', 'preview']);

const shortId = (id?: string | null) =>
  id && id.length > 8 ? `${id.slice(0, 8)}…` : (id ?? 'embedded');

/**
 * Badge nhỏ ở góc cho QA verify đang chạy đúng runtime / update nào.
 * Chỉ hiển thị ở `__DEV__`, `development`, hoặc `preview` channel.
 * Tap vào để toggle expand chi tiết.
 */
export const RuntimeBadge = () => {
  const { runtimeVersion, channel, updateId, isUpdateAvailable, isUpdatePending } =
    useOTAUpdate();
  const [expanded, setExpanded] = useState(false);

  const visible = __DEV__ || (channel ? VISIBLE_CHANNELS.has(channel) : false);
  if (!visible) {
    return null;
  }

  return (
    <Pressable style={styles.wrapper} onPress={() => setExpanded(v => !v)}>
      <View style={styles.badge}>
        <Text style={styles.text}>
          rt {runtimeVersion ?? '?'} · {channel ?? 'embedded'} · {shortId(updateId)}
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
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    zIndex: 9999,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: 280,
  },
  text: { color: '#fff', fontSize: 10, fontFamily: 'monospace' },
  details: { marginTop: 4 },
  detailText: { color: '#ddd', fontSize: 9, fontFamily: 'monospace' },
});
