// Themes
import {
  borderRadius,
  colors,
  iconSize,
  spacing,
  typography,
} from '@app/themes';

// Styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing['6'],
  },
  imageContainer: {
    width: iconSize['7xl'],
    height: iconSize['7xl'],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing['2'],
    borderWidth: spacing['0.5'],
    borderColor: colors.borderDisabled,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.black,
    textAlign: 'center',
  },
});
