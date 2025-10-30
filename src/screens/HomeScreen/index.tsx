import { useNavigation } from '@react-navigation/native';

// Components
import { View, Button, Text } from 'react-native';

// Constants
import { SCREENS } from '@app/constants';

// Types
import type { AppStackParamList } from '@app/interfaces';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Styles
import { styles } from './index.style';

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen (demo)</Text>

      <Button
        title="Go to Wishlist tab"
        onPress={() => navigation.navigate(SCREENS.WISHLIST)}
      />
      <Button
        title="Go to Cart tab"
        onPress={() => navigation.navigate(SCREENS.CART)}
      />
      <Button
        title="Go to Search tab"
        onPress={() => navigation.navigate(SCREENS.SEARCH)}
      />
      <Button
        title="Go to Settings tab"
        onPress={() => navigation.navigate(SCREENS.SETTINGS)}
      />
    </View>
  );
};
