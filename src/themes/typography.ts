export const typography = {
  fontFamily: {
    montserrat: 'Montserrat',
    poppins: 'Poppins',
    roboto: 'Roboto',
  },
  fontSizes: {
    xxs: 10,
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 17,
    '2xl': 18,
    '3xl': 20,
    '4xl': 24,
    '5xl': 30,
    '6xl': 34,
    '7xl': 36,
    '8xl': 44,
  },
  fontWeights: {
    thin: '100', // Montserrat-Thin
    extraLight: '200', // Montserrat-ExtraLight
    light: '300', // Montserrat-Light
    regular: '400', // Montserrat-Regular, Poppins-Regular, Roboto-Regular
    medium: '500', // Montserrat-Medium, Roboto-Medium
    semiBold: '600', // Montserrat-SemiBold
    bold: '700', // Montserrat-Bold
    extraBold: '800', // Montserrat-ExtraBold
  },
  lineHeights: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 16,
    lg: 18,
    xl: 24,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
  },
  letterSpacing: {
    xs: 0,
    sm: 0.01,
    base: 0.02,
    md: 0.4,
  },
} as const;

export const fontFaces = {
  montserrat: {
    thin: 'Montserrat-Thin',
    extraLight: 'Montserrat-ExtraLight',
    light: 'Montserrat-Light',
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    extraBold: 'Montserrat-ExtraBold',
  },
  poppins: {
    regular: 'Poppins-Regular',
  },
  roboto: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
  },
} as const;
