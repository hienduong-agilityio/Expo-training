import { useCallback } from 'react';
import Config from 'react-native-config';
import { StyleSheet, Text, View } from 'react-native';

// Components
import { Button } from '@app/components';

// Constants
import { SCREENS } from '@app/constants';

// Interfaces
import { AppStackScreenProps } from '@app/interfaces';
import { fontFaces } from '@app/themes';

type LoginScreenProps = AppStackScreenProps<typeof SCREENS.LOGIN>;

const BUTTON_BACKGROUND_COLOR = '#f5fcff';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const handleRegister = useCallback(() => {
    navigation.navigate(SCREENS.REGISTER);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Todo: Remove this after testing */}
      <Text style={styles.title}>App Config</Text>
      <Text style={[styles.title, styles.fontExtraBold]}>
        Montserrat-ExtraBold
      </Text>
      <Text style={[styles.title, styles.fontExtraLight]}>
        Montserrat-ExtraLight
      </Text>
      <Text style={[styles.title, styles.fontLight]}>Montserrat-Light</Text>
      <Text style={[styles.title, styles.fontMedium]}>Montserrat-Medium</Text>
      <Text style={[styles.title, styles.fontRegular]}>Montserrat-Regular</Text>
      <Text style={[styles.title, styles.fontSemiBold]}>
        Montserrat-SemiBold
      </Text>
      <Text style={[styles.title, styles.fontThin]}>Montserrat-Thin</Text>
      <Text style={[styles.title, styles.fontPoppins]}>Poppins-Regular</Text>
      <Text style={[styles.title, styles.fontRobotoMedium]}>Roboto-Medium</Text>
      <Text style={[styles.title, styles.fontRobotoRegular]}>
        Roboto-Regular
      </Text>
      <Text>{`We are running on ${Config.STRAPI_BASE_URL}`}</Text>
      <Text>{`We are running on ${Config.API_BASE_URL}`}</Text>
      <Button onPress={handleRegister}>
        <Text>Register</Text>
      </Button>
    </View>
  );
};

// Todo: Remove this after testing
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
  },
  title: {
    fontSize: 30,
    fontFamily: fontFaces.montserrat.bold,
  },
  fontExtraBold: {
    fontFamily: fontFaces.montserrat.extraBold,
  },
  fontExtraLight: {
    fontFamily: fontFaces.montserrat.extraLight,
  },
  fontLight: {
    fontFamily: fontFaces.montserrat.light,
  },
  fontMedium: {
    fontFamily: fontFaces.montserrat.medium,
  },
  fontRegular: {
    fontFamily: fontFaces.montserrat.regular,
  },
  fontSemiBold: {
    fontFamily: fontFaces.montserrat.semiBold,
  },
  fontThin: {
    fontFamily: fontFaces.montserrat.thin,
  },
  fontPoppins: {
    fontFamily: fontFaces.poppins.regular,
  },
  fontRobotoMedium: {
    fontFamily: fontFaces.roboto.medium,
  },
  fontRobotoRegular: {
    fontFamily: fontFaces.roboto.regular,
  },
});
