import { useNavigation } from '@react-navigation/native';

// Components
import { View, Text, Button } from 'react-native';

// Types
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@app/interfaces';

// Constants
import { SCREENS } from '@app/constants';

// Styles
import { styles } from './index.style';

export const SearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SearchScreen</Text>

      <Button
        title="Go Home"
        onPress={() => navigation.navigate(SCREENS.HOME)}
      />
      <Button
        title="Go Wishlist"
        onPress={() => navigation.navigate(SCREENS.WISHLIST)}
      />
      <Button
        title="Go Cart"
        onPress={() => navigation.navigate(SCREENS.CART)}
      />
      <Button
        title="Go Settings"
        onPress={() => navigation.navigate(SCREENS.SETTINGS)}
      />
    </View>
  );
};
