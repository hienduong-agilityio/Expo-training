import { colors, spacing, typography } from '@app/themes';

// Styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  content: {
    gap: spacing[4],
  },
  photoSection: {
    gap: spacing[2],
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.text + '14',
  },
  photoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  text: {
    fontSize: typography.fontSizes.base,
    color: colors.text,
  },
});
