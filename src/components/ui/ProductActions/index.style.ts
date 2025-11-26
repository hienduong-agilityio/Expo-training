import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing['3'],
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3'],
    borderRadius: borderRadius.base,
    gap: spacing['1'],
  },
  addToCartButton: {
    backgroundColor: colors.secondary,
  },
  addToCartText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
  buyNowButton: {
    backgroundColor: colors.success,
  },
  buyNowText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
});
