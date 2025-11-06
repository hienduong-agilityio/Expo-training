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
    paddingHorizontal: spacing['6.75'],
    paddingVertical: spacing['2.75'],
    borderRadius: borderRadius.base,
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
