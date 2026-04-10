import { colors, spacing, typography } from '@app/themes';

// Styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  content: {
    gap: spacing[4],
  },
  text: {
    fontSize: typography.fontSizes.base,
    color: colors.text,
  },
});
