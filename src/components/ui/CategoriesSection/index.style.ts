import { StyleSheet } from 'react-native';

// Themes
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing['6'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  count: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
    marginTop: spacing['1'],
  },
  categoriesContainer: {
    marginTop: spacing['0.5'],
    backgroundColor: colors.surface,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },
});
