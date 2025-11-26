import { StyleSheet } from 'react-native';

// Themes
import { typography } from '@app/themes/typography';
import { colors } from '@app/themes/colors';
import { spacing } from '@app/themes/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['4'],
    backgroundColor: colors.grayLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  count: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
    marginTop: spacing['1'],
  },
  content: {
    flex: 1,
  },
});
