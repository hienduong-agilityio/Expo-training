import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    minHeight: 200,
  },
  icon: {
    marginBottom: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.base,
  },
  button: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing['1.25'],
    borderRadius: borderRadius.base,
  },
  text: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
});
