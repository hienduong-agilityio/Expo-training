import { StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@app/themes';

/**
 * Styles for HomeScreen
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing['6'],
    paddingBottom: spacing['6'],
    paddingHorizontal: spacing['6'],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing['6'],
    marginBottom: spacing['6'],
  },

  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButton: {
    width: spacing['12'],
    height: spacing['12'],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginHorizontal: spacing['2'],
  },

  searchBarContainer: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['4'],
    paddingBottom: spacing['4'],
    backgroundColor: colors.background,
  },

  section: {
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['6'],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
  },

  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },

  filterButtons: {
    flexDirection: 'row',
    gap: spacing['2'],
  },

  filterButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  filterButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginLeft: spacing['0.5'],
  },

  // Categories Styles
  categoriesContainer: {
    marginTop: spacing['0.5'],
    backgroundColor: colors.surface,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },

  categoryItem: {
    alignItems: 'center',
    marginRight: spacing['6'],
  },

  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: spacing['0.5'],
    borderWidth: 2,
    borderColor: colors.surfaceVariant,
  },

  categoryImage: {
    width: '100%',
    height: '100%',
  },

  categoryName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    textAlign: 'center',
  },

  // Promotional Banner Styles
  promoBanner: {
    width: '100%',
    height: 200,
    marginHorizontal: spacing['6'],
    marginVertical: spacing['6'],
    borderRadius: borderRadius.lg,
    padding: spacing['6'],
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  promoBackgroundImage: {
    borderRadius: borderRadius.lg,
    resizeMode: 'cover',
  },

  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },

  promoText: {
    flex: 1,
    maxWidth: '60%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  promoTitle: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.extraBold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },

  promoSubtitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
    marginBottom: 2,
  },

  promoDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.white,
    marginBottom: spacing['6'],
  },

  shopNowButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
    alignSelf: 'flex-start',
  },

  shopNowText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },

  // Deal of the Day Styles
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
    backgroundColor: colors.countdown,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },

  dealTitleContainer: {
    flex: 1,
  },

  dealTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },

  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },

  countdownText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing['0.5'],
  },

  viewAllButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
  },

  // Special Offers Banner Styles
  specialOffersBanner: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing['6'],
    marginVertical: spacing['6'],
    borderRadius: borderRadius.lg,
    padding: spacing['6'],
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  offerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: spacing['6'],
    backgroundColor: colors.surfaceVariant,
  },

  offerIconImage: {
    width: '100%',
    height: '100%',
  },

  offerEmoji: {
    fontSize: typography.fontSizes.lg,
    marginLeft: spacing['0.5'],
  },

  offerContent: {
    flex: 1,
  },

  offerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['0.5'],
  },

  offerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },

  offerDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Trending Products Styles
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['6'],
    backgroundColor: colors.primary,
    padding: spacing['2'],
    borderRadius: borderRadius.md,
  },

  trendingTitleContainer: {
    flex: 1,
  },

  trendingTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },

  lastDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },

  lastDateText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing['0.5'],
  },

  // Summer Sale Banner Styles
  summerSaleContainer: {
    marginHorizontal: spacing['6'],
    marginVertical: spacing['6'],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  summerSaleImage: {
    width: '100%',
    height: 200,
  },

  // New Arrivals Styles
  newArrivalsSection: {
    backgroundColor: colors.white,
    padding: spacing['6'],
  },

  newArrivalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  newArrivalsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 2,
  },

  newArrivalsSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },

  newArrivalsViewAllButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  newArrivalsViewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },

  // Sponsored Banner Styles
  sponsoredBanner: {
    marginHorizontal: spacing['6'],
    marginVertical: spacing['6'],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  sponsoredLabel: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    padding: spacing['2'],
  },

  sponsoredImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing['2'],
    marginBottom: spacing['0.5'],
  },

  sponsoredOverlay: {
    position: 'absolute',
    top: spacing['6'] + spacing['2'],
    left: spacing['6'],
    right: spacing['6'],
    alignItems: 'center',
  },

  sponsoredTitle: {
    fontSize: typography.fontSizes['6xl'],
    fontWeight: typography.fontWeights.extraBold,
    color: colors.white,
    textAlign: 'center',
    textShadowColor: colors.overlayStrong,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },

  sponsoredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['6'],
    backgroundColor: colors.surface,
    gap: spacing['1'],
  },

  sponsoredFooterText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },

  loadingContainer: {
    padding: spacing['5'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: colors.error || '#FF0000',
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
  },
});
