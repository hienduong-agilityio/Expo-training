import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  containerSpacing: {
    marginBottom: 10,
  },
  inputContainer: {
    borderRadius: 10,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    borderWidth: 1,
    borderColor: colors.black,
  },
  inputFocused: {
    borderWidth: 2,
    padding: 0,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontWeight: typography.fontWeights.medium,
    paddingVertical: spacing['2'],
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  label: {
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.base,
    color: colors.textOnPrimary,
    marginBottom: spacing['1.25'],
  },
  errorText: {
    fontWeight: typography.fontWeights.regular,
    fontSize: typography.fontSizes.sm,
    color: colors.error,
    marginTop: spacing['1.25'],
  },
  leftIcon: {
    paddingLeft: spacing['3'],
    paddingRight: spacing['1'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingLeft: spacing['2'],
    paddingRight: spacing['3'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
