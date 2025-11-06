import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: spacing['2'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    marginBottom: spacing['2'],
  },
  headerLeft: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing['0.5'],
  },
  actionButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    marginBottom: spacing['2'],
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  itemCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing['2'],
    marginBottom: spacing['2'],
    gap: spacing['0.5'],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing['0.5'],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing['0.5'],
  },
  filterButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  productsScrollView: {
    paddingLeft: spacing['2'],
  },
  productsContainer: {
    paddingRight: spacing['2'],
  },
  productCard: {
    width: 160,
    marginRight: spacing['2'],
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: spacing['0.5'],
  },
  productName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing['0.5'],
  },
  productDescription: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing['0.5'],
    lineHeight: 16,
  },
  productPrice: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing['0.5'],
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['0.5'],
  },
  reviewCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
});
