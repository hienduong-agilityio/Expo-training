import { Dimensions, StyleSheet } from 'react-native';

// Themes
import { borderRadius, colors, spacing, typography } from '@app/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - spacing['4'] - spacing['4'],
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    marginVertical: spacing['2.5'],
    shadowColor: colors.black,
    shadowOffset: {
      width: spacing['0.5'],
      height: spacing['0.5'],
    },
    shadowOpacity: 0.1,
    shadowRadius: spacing['0.5'],
    elevation: 2,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 1.1,
    overflow: 'hidden',
    borderRadius: borderRadius.base,
    position: 'relative',
  },

  wishlistButton: {
    position: 'absolute',
    top: spacing['1.25'],
    right: spacing['1.25'],
    backgroundColor: colors.overlayWeak,
    borderRadius: borderRadius.base,
    padding: spacing['1.25'],
    shadowColor: colors.black,
    shadowOffset: {
      width: spacing['0'],
      height: spacing['0.5'],
    },
    shadowOpacity: 0.1,
    shadowRadius: spacing['0.5'],
    elevation: 3,
  },

  wishlistPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: colors.overlayWeak,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  detailsContainer: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['4'],
    paddingBottom: spacing['2'],
  },

  productName: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing['2'],
    letterSpacing: typography.letterSpacing.base,
  },

  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing['1'],
    opacity: 0.8,
  },

  priceContainer: {
    marginBottom: spacing['1.25'],
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },

  reviewCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.medium,
    opacity: 0.7,
  },
});
