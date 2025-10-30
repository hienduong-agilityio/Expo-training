import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semiBold,
    marginBottom: spacing[2],
    color: colors.text,
  },
});
