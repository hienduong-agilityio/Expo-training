import { StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing['6'],
    marginVertical: spacing['6'],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  newArrivalsSection: {
    backgroundColor: colors.white,
    padding: spacing['6'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  viewAllButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
});

