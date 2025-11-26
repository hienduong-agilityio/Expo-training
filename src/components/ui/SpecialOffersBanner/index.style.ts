import { StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@app/themes';

export const styles = StyleSheet.create({
  container: {
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: spacing['6'],
    backgroundColor: colors.surfaceVariant,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: typography.fontSizes.lg,
    marginLeft: spacing['0.5'],
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['0.5'],
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

