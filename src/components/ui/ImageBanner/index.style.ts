import { StyleSheet } from 'react-native';

// Themes
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  banner: {
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
  backgroundImage: {
    borderRadius: borderRadius.lg,
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  text: {
    flex: 1,
    maxWidth: '60%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.extraBold,
    color: colors.white,
    marginBottom: spacing['0.5'],
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
    marginBottom: 2,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.white,
    marginBottom: spacing['6'],
  },
  button: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['2'],
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.white,
  },
});
