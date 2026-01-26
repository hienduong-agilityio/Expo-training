import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: typography.fontWeights.semiBold,
    fontSize: typography.fontSizes['2xl'],
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  inactive: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
});
