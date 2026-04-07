import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['4'],
    minHeight: spacing['14'],
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    width: spacing['12'],
    height: spacing['12'],
  },
  label: {
    marginLeft: 'auto',
    color: colors.textSecondary,
    fontSize: typography.fontSizes.lg,
    letterSpacing: typography.letterSpacing.md,
  },
});
