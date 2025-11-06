import { StyleSheet } from 'react-native';

// Themes
import { typography } from '@app/themes';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: typography.fontWeights.medium,
  },
  fullWidth: { alignSelf: 'stretch' },
  inactive: { opacity: 0.7 },
});
