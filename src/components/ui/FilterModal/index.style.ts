import { StyleSheet } from 'react-native';

// Themes
import { colors, spacing, borderRadius, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: spacing['14.5'],
    padding: 0,
    width: '100%',
    maxWidth: undefined,
    position: 'absolute',
    bottom: 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2.5'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.bold,
  },

  section: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2.5'],
  },

  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing['2'],
  },

  categoriesContainer: {
    maxHeight: 200,
  },

  categoryItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['3.5'],
    paddingVertical: spacing['2'],
    marginBottom: spacing['0.5'],
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },

  categoryTextActive: {
    color: colors.surface,
  },

  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing['3'],
    paddingTop: spacing['3'],
    gap: spacing['3'],
  },

  clearButton: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    paddingVertical: spacing['2'],
    alignItems: 'center',
  },

  clearButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },

  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing['2'],
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.surface,
  },
});
