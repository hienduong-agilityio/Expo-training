import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography, borderRadius } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius['2xl'],
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing[1],
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.md,
  },

  labelText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing[1],
  },

  actionButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius['2xl'],
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.overlayWeak.replace('0.08', '0'),
  },

  actionText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },

  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
