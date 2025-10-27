import { useCallback } from 'react';
import Config from 'react-native-config';
import { StyleSheet, Text, View } from 'react-native';

// Components
import { Button } from '@app/components';

// Constants
import { SCREENS } from '@app/constants';

// Interfaces
import { AppStackScreenProps } from '@app/interfaces';

type LoginScreenProps = AppStackScreenProps<typeof SCREENS.LOGIN>;

const BUTTON_BACKGROUND_COLOR = '#f5fcff';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const handleRegister = useCallback(() => {
    navigation.navigate(SCREENS.REGISTER);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>{`We are running on ${Config.ENVIRONMENT}`}</Text>
      <Button onPress={handleRegister}>
        <Text>Register</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
  },
});
