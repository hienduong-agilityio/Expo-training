import { StyleSheet, Dimensions } from 'react-native';

// Themes
import { colors, spacing, typography } from '@app/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['10'],
  },
  iconContainer: {
    marginBottom: spacing['10'],
  },
  title: {
    fontSize: typography.fontSizes['6xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  description: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.base,
    paddingHorizontal: spacing['5'],
  },
});
