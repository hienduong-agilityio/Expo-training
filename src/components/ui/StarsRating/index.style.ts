import { StyleSheet } from 'react-native';

// Themes
import { colors, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: typography.fontSizes['3xl'],
    marginHorizontal: 2,
  },
  starActive: {
    color: colors.starActive,
  },
  starInactive: {
    color: colors.starInactive,
  },
});
