import { NavigationContainer } from '@react-navigation/native';

// Navigation
import { AppStackNavigation } from '@app/navigation/AppStackNavigation';

export const Navigation = () => {
  return (
    <NavigationContainer>
      <AppStackNavigation />
    </NavigationContainer>
  );
};
