import { StyleSheet } from 'react-native';

// Themes
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFaces,
} from '@app/themes';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderRadius: borderRadius.base,
    marginHorizontal: spacing['4'],
    marginVertical: spacing['2'],
  },
  deliveryText: {
    fontFamily: fontFaces.montserrat.semiBold,
    fontSize: typography.fontSizes.base,
    color: colors.black,
    marginBottom: spacing['1.25'],
  },
  deliveryTime: {
    fontFamily: fontFaces.poppins.regular,
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.extraBold,
    color: colors.black,
  },
});
