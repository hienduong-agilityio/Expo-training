import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  filterButtons: {
    flexDirection: 'row',
    gap: spacing['4'],
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1.25'],
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginLeft: spacing['0.5'],
  },
});
