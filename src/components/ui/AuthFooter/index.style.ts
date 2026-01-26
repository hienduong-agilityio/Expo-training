import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  footerContainer: {
    marginTop: spacing[4],
  },
  agreementContainer: {
    marginTop: -spacing['5'],
    marginBottom: spacing['5'],
  },
  agreementText: {
    fontSize: typography.fontSizes['2xl'],
    color: colors.textMuted,
    fontWeight: typography.fontWeights.regular,
    textAlign: 'left',
    lineHeight: typography.lineHeights.base,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  navigationText: {
    fontSize: typography.fontSizes['2xl'],
    color: colors.text,
    fontWeight: typography.fontWeights.regular,
  },
  navigationLink: {
    fontSize: typography.fontSizes['2xl'],
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
    textDecorationLine: 'underline',
  },
  divider: {
    alignItems: 'center',
    marginTop: spacing[12],
    marginBottom: spacing[7],
  },
  dividerLabel: {
    fontSize: typography.fontSizes.xl,
    color: colors.textMuted,
    marginHorizontal: spacing['5'],
    fontWeight: typography.fontWeights.medium,
  },
});
