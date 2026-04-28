import { StyleSheet } from 'react-native';

// Themes

import { colors, spacing, borderRadius } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['4'],
    marginBottom: spacing[6],
  },
  button: {
    width: spacing['16'],
    height: spacing['16'],
    padding: spacing['4'],
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
