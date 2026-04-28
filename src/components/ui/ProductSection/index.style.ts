import { StyleSheet } from 'react-native';

// Themes
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['6'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
  },
  titleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
    backgroundColor: colors.countdown,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },
  dealTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
    backgroundColor: colors.primary,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },
  trendingTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },
  newArrivalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newArrivalsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  newArrivalsSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['0.5'],
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  iconText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing['0.5'],
  },
  viewAllButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
  },
  newArrivalsViewAllButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['0.5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  newArrivalsViewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
  loadingContainer: {
    padding: spacing['5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.error || '#FF0000',
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
  },
});
