import { StyleSheet } from 'react-native';

// Themes

import { colors, spacing, borderRadius } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['5'],
    marginBottom: spacing['7.5'],
  },
  button: {
    width: spacing['14'],
    height: spacing['14'],
    padding: spacing['2'],
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
