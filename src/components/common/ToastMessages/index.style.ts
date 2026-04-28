import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing['4'],
    right: spacing['4'],
    top: spacing['15'],
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    borderRadius: borderRadius.base,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: borderRadius.base,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 999,
  },
  containerBottom: {
    top: 'auto',
    bottom: spacing['10'],
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: spacing['1'],
    borderTopLeftRadius: borderRadius.base,
    borderBottomLeftRadius: borderRadius.base,
    backgroundColor: colors.error,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: spacing['8'],
    height: spacing['8'],
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceVariant,
  },
  iconText: {
    fontSize: typography.fontSizes.lg,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    color: colors.text,
    fontSize: typography.fontSizes.base,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  retryButton: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  retryText: {
    color: colors.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  closeButton: {
    paddingHorizontal: spacing['1'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.base,
  },
});
