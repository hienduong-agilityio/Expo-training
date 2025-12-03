import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  containerSpacing: {
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 1,
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
    fontWeight: typography.fontWeights.regular,
    paddingVertical: spacing['2.5'],
    textAlignVertical: 'center',
    includeFontPadding: false,
    color: colors.text,
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
    paddingRight: spacing['2'],
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
