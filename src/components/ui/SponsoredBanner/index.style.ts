import { StyleSheet } from 'react-native';

// Themes
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
  label: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    padding: spacing['2'],
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing['2'],
    marginBottom: spacing['0.5'],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['6'],
    backgroundColor: colors.surface,
    gap: spacing['1'],
  },
  footerText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },
});
