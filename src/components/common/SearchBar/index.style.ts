import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    color: colors.text,
    marginHorizontal: spacing['2'],
  },
});
