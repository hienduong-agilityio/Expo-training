import { StyleSheet } from 'react-native';

// Themes
import { borderRadius, spacing } from '@app/themes/dimensions';
import { typography } from '@app/themes/typography';
import { colors } from '@app/themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing['4'],
    pointerEvents: 'box-none',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlayStrong,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  content: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing['4'],
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: spacing['10'],
    height: spacing['10'],
    marginBottom: spacing['4'],
    tintColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing['4'],
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['4'],
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: spacing['4'],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  textPrimary: {
    color: colors.white,
    fontWeight: typography.fontWeights.semiBold,
    fontSize: typography.fontSizes.base,
  },
  buttonSecondary: {
    width: '100%',
    padding: spacing['4'],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  textSecondary: {
    color: colors.text,
    fontWeight: typography.fontWeights.semiBold,
    fontSize: typography.fontSizes.base,
  },
});
