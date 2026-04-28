import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingTop: spacing[6],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderSummary: {
    marginBottom: spacing[6],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  summaryLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[3],
  },
  totalLabel: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },
  totalValue: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  button: {
    marginTop: spacing[4],
  },
});
