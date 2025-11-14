import { useNavigation } from '@react-navigation/native';

// Components
import { View, Text } from 'react-native';
import { Button } from '@app/components/common/Button';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

// Types
import type { PrivateStackParamList } from '@app/interfaces';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Styles
import { styles } from './index.style';

// Enums
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen (demo)</Text>

      <Button
        label="Go to Wishlist tabsssss"
        size={'lg'}
        variant={BUTTON_VARIANTS.SOLID}
        color={BUTTON_COLORS.PRIMARY}
        onPress={() => navigation.navigate(PRIVATE_SCREENS.WISHLIST)}
      />
      <Button
        label="Go to Cart tabs"
        size={'lg'}
        variant={BUTTON_VARIANTS.SOLID}
        color={BUTTON_COLORS.PRIMARY}
        onPress={() => navigation.navigate(PRIVATE_SCREENS.CART)}
      />
      <Button
        label="Go to Search tabs"
        size={'lg'}
        variant={BUTTON_VARIANTS.SOLID}
        color={BUTTON_COLORS.PRIMARY}
        onPress={() => navigation.navigate(PRIVATE_SCREENS.SEARCH)}
      />
      <Button
        label="Go to Settings tabs"
        size={'lg'}
        variant={BUTTON_VARIANTS.SOLID}
        color={BUTTON_COLORS.PRIMARY}
        onPress={() => navigation.navigate(PRIVATE_SCREENS.SETTINGS)}
      />
    </View>
  );
};
