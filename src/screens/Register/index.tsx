import { StyleSheet, Text, View } from 'react-native';

// Components
import { Button } from '@app/components';

// Constants
import { SCREENS } from '@app/constants';

// Interfaces
import { AppStackScreenProps } from '@app/interfaces';

type RegisterScreenProps = AppStackScreenProps<typeof SCREENS.REGISTER>;

const BUTTON_BACKGROUND_COLOR = '#f5fcff';

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  return (
    <View style={styles.container}>
      <Button onPress={navigation.goBack}>
        <Text>Back to Login</Text>
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
  },
});
