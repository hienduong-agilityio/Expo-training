import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semiBold,
    marginBottom: spacing[2],
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: spacing['30'],
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productName: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  productPrice: {
    fontSize: typography.fontSizes.base,
    color: colors.text,
  },
  removeButton: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    textDecorationLine: 'underline',
  },
});
