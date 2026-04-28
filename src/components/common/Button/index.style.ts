import { StyleSheet } from 'react-native';

// Themes
import { typography } from '@app/themes';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: 'center',
    height: 66,
    justifyContent: 'center',
  },
  label: {
    fontSize: 29,
    fontWeight: typography.fontWeights.semiBold,
  },
  fullWidth: { alignSelf: 'stretch' },
  inactive: { opacity: 0.7 },
});
