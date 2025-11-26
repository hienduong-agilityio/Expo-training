import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    backgroundColor: colors.white,
  },
  label: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing['2'],
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['0.5'],
  },
  sizeButton: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: colors.primary,
  },
  disabledSizeButton: {
    borderColor: colors.borderDisabled,
    backgroundColor: colors.surfaceDisabled,
  },
  sizeButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  sizeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.primary,
  },
  selectedSizeText: {
    color: colors.white,
  },
  disabledSizeText: {
    color: colors.textDisabled,
  },
});
