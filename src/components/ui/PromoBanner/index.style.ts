import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, typography, borderRadius } from '@app/themes';

// Types
import type { HeaderStyle } from '@app/interfaces/ui';

export const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.md,
    marginTop: spacing[0.5],
  },

  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
});

const dealStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.countdown,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing[0.5],
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    opacity: 0.9,
  },
  labelText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing[0.5],
  },
  actionButton: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.transparent,
  },
  actionText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
  },
});

const trendingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing[0.5],
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    opacity: 0.9,
  },
  labelText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing[0.5],
  },
  actionButton: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.transparent,
  },
  actionText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
  },
});

const styleMap: Record<HeaderStyle, typeof dealStyles> = {
  deal: dealStyles,
  trending: trendingStyles,
};

export const getHeaderStyle = (headerStyle: HeaderStyle = 'deal') => {
  return styleMap[headerStyle] || dealStyles;
};
