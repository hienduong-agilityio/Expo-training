import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing['2'],
    textAlign: 'center',
  },

  message: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['4'],
    lineHeight: 20,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing['3'],
    width: '100%',
  },

  button: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: colors.surfaceVariant,
  },

  confirmButton: {
    backgroundColor: colors.primary,
  },

  confirmButtonDestructive: {
    backgroundColor: colors.error,
  },

  cancelButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },

  confirmButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.surface,
  },
});
