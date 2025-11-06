import { StyleSheet } from 'react-native';

// Themes
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: spacing['4'],
    borderRadius: borderRadius.base,
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: spacing['3'],
  },
  image: {
    width: spacing['30'],
    height: '100%',
    borderRadius: borderRadius.base,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing['4'],
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
  info: {
    flex: 1,
    minHeight: spacing['30'],
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    lineHeight: typography.lineHeights.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['1'],
  },
  dot: {
    color: colors.textMuted,
  },
  quantityText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
  quantitySection: {
    marginTop: spacing['3'],
    marginBottom: spacing['3'],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing['1'],
  },
  removeBtn: {
    paddingHorizontal: spacing['4'],
    height: spacing['9'],
    borderRadius: borderRadius.base,
    backgroundColor: colors.error + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.error,
  },
  totalWrap: {
    alignItems: 'flex-end',
    minWidth: spacing['8'],
  },
  totalLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
});
