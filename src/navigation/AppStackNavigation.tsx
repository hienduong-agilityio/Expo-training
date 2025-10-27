import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { LoginScreen, RegisterScreen } from '@app/screens';

// Constants
import { API_CONFIG, SCREENS } from '@app/constants';

// Interfaces
import { AppStackParamList } from '@app/interfaces';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export const AppStackNavigation = () => {
  console.log('API_BASE_URL:', API_CONFIG.BASE_URL);
  console.log('STRAPI_BASE_URL:', API_CONFIG.STRAPI_BASE_URL);

  return (
    <AppStack.Navigator>
      <AppStack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
      <AppStack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />
    </AppStack.Navigator>
  );
};
