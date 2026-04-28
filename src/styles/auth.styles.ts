import { StyleSheet } from 'react-native';

// Themes
import { colors } from '@app/themes/colors';

export const authStyles = StyleSheet.create({
  // Layout styles
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 22,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    marginTop: 80,
    marginBottom: 40,
  },

  // Header styles
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },

  // Form styles
  form: {
    gap: 20,
  },

  // Link styles
  linkContainer: {
    alignSelf: 'flex-end',
    marginTop: -20,
    marginBottom: 30,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },

  // Terms/Agreement styles
  agreementContainer: {
    marginTop: -20,
    marginBottom: 20,
  },
  agreementText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 20,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'left',
  },

  // Divider styles
  divider: {
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
    fontWeight: '500',
  },

  // Social buttons styles
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Navigation styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },
  navigationLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
