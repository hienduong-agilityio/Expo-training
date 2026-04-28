import { View, Text } from 'react-native';

// Interfaces
import { IOnboardingItem } from '@app/interfaces/ui';

// Styles
import { styles } from './index.style';

export interface IOnboardingSlide {
  item: IOnboardingItem;
}

export const OnboardingSlide = ({ item }: IOnboardingSlide) => {
  return (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text
        style={styles.title}
        accessible
        accessibilityRole="header"
        accessibilityLabel={item.title}>
        {item.title}
      </Text>
      <Text
        style={styles.description}
        accessible
        accessibilityRole="text"
        accessibilityLabel={item.description}>
        {item.description}
      </Text>
    </View>
  );
};
