import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    gap: spacing['5'],
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.semiBold,
  },
  list: {
    gap: spacing['4'],
  },
});
