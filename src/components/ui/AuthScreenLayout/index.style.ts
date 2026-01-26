import { StyleSheet } from 'react-native';

// Themes
import { colors, fontFaces, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    paddingBottom: spacing['22.5'],
  },
  header: {
    marginBottom: spacing[10],
  },
  title: {
    fontFamily: fontFaces.montserrat.extraBold,
    fontSize: typography.fontSizes['8xl'],
    fontWeight: typography.fontWeights.extraBold,
    color: colors.text,
  },
  form: {
    gap: spacing[6],
  },
});
