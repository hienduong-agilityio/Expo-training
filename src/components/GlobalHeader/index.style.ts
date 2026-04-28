import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius } from '@app/themes';

export const styles = StyleSheet.create({
  headerStyles: {
    backgroundColor: colors.grayLight,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
  },

  menuButton: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButton: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: borderRadius.full,
    justifyContent: 'center',
  },
});
