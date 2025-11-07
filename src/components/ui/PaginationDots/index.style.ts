import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, colors, spacing } from '@app/themes';

export const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['7.5'],
  },
  dot: {
    width: spacing['2.5'],
    height: spacing['2.5'],
    borderRadius: borderRadius.base,
    marginHorizontal: spacing['1'],
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: spacing['8.5'],
  },
  inactiveDot: {
    backgroundColor: colors.border,
  },
});
