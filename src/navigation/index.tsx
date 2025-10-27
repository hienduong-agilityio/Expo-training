import { NavigationContainer } from '@react-navigation/native';

import { AppStackNavigation } from './AppStackNavigation';

export const Navigation = () => {
  return (
    <NavigationContainer>
      <AppStackNavigation />
    </NavigationContainer>
  );
};
