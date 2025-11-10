import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
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
    marginVertical: spacing['7.5'],
  },
  dividerLabel: {
    fontSize: typography.fontSizes['2xl'],
    color: colors.textMuted,
    marginHorizontal: spacing['5'],
    fontWeight: typography.fontWeights.medium,
  },
});
