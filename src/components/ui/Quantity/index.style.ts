import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.base,
    backgroundColor: colors.surfaceVariant,
    padding: spacing['0.5'],
    alignSelf: 'flex-start',
  },
  stepBtn: {
    width: spacing['6'],
    height: spacing['6'],
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stepText: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semiBold,
    color: colors.primary,
  },
  quantityValue: {
    minWidth: spacing['7'],
    textAlign: 'center',
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },
  pressed: {
    opacity: 0.5,
  },
  disabledBtn: {
    backgroundColor: colors.surfaceMuted,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
