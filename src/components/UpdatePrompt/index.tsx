import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useOTAUpdate } from '@app/hooks/useOTAUpdate';
import { borderRadius, colors, typography } from '@app/themes';

/**
 * Non-blocking prompt for EAS Update.
 *
 * - Renders nothing while an update is still downloading (silent UX).
 * - When a non-critical update is ready, prompts the user with "Restart now / Later".
 * - Critical updates are auto-applied by `useOTAUpdate`, so this component stays hidden for them.
 */
export const UpdatePrompt = () => {
  const {
    isUpdateReady,
    isApplying,
    releaseNotes,
    applyUpdate,
    dismissUpdate,
  } = useOTAUpdate();

  if (!isUpdateReady) {
    return null;
  }

  return (
    <Modal
      visible={isUpdateReady}
      transparent
      animationType="fade"
      onRequestClose={dismissUpdate}>
      <View style={styles.container} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={dismissUpdate}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.contentWrapper} pointerEvents="box-none">
          <View style={styles.content}>
            <Text style={styles.title}>Update available</Text>
            <Text style={styles.description}>
              {releaseNotes ??
                'A new version is ready. Restart the app to apply the update.'}
            </Text>

            <TouchableOpacity
              style={styles.buttonPrimary}
              disabled={isApplying}
              onPress={applyUpdate}>
              {isApplying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textPrimary}>Restart now</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={dismissUpdate}>
              <Text style={styles.textSecondary}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayModal,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  description: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonPrimary: {
    width: '100%',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: 8,
  },
  textPrimary: { color: colors.white, fontWeight: typography.fontWeights.semiBold },
  buttonSecondary: { paddingVertical: 10 },
  textSecondary: { color: colors.secondary, fontWeight: typography.fontWeights.medium },
});
