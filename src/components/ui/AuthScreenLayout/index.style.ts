import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    marginTop: spacing[10],
    marginBottom: spacing[10],
  },
  header: {
    marginBottom: spacing[10],
  },
  title: {
    fontSize: typography.fontSizes['6xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  form: {
    gap: spacing[5],
  },
});
