import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: spacing['1.25'],
    paddingHorizontal: spacing['2'],
  },
  prevButton: {
    backgroundColor: colors.background,
  },
  nextButton: {
    backgroundColor: colors.background,
  },
  buttonText: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.medium,
  },
  prevButtonText: {
    color: colors.textMuted,
  },
  nextButtonText: {
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.3,
  },
  disabledButtonText: {
    color: colors.textDisabled,
  },
});
