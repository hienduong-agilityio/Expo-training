import { StyleSheet } from 'react-native';

import { colors, spacing } from '@app/themes';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[2],
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
});
