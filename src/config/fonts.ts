import { useFonts } from 'expo-font';

const fontAssets = {
  'Montserrat-Thin': require('../assets/fonts/Montserrat-Thin.ttf'),
  'Montserrat-ExtraLight': require('../assets/fonts/Montserrat-ExtraLight.ttf'),
  'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf'),
  'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
  'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
  'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
} as const;

export const useAppFonts = () => useFonts(fontAssets);
