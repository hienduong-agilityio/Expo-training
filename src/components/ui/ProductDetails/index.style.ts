import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    padding: spacing['3'],
    backgroundColor: colors.white,
  },
  productName: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing['1'],
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing['2'],
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  reviewCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing['1'],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  originalPrice: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: spacing['1'],
  },
  currentPrice: {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginRight: spacing['1'],
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing['1'],
    paddingVertical: spacing['0.5'],
    borderRadius: 4,
  },
  discountText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
  detailsContainer: {
    marginTop: spacing['2'],
  },
  detailsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing['1'],
  },
  detailsText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing['1'],
  },
  moreText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.semiBold,
  },
});
