import { View, Text, Image, TouchableOpacity } from 'react-native';

// Types
import type { SaleBanner } from '@app/constants/banner';

// Styles
import { styles } from './index.style';

interface ISummerSaleBannerProps {
  banner: SaleBanner;
  newArrivalsTitle: string;
  newArrivalsSubtitle: string;
  actionLabel: string;
  onPressViewAll: () => void;
}

export const SummerSaleBanner = ({
  banner,
  newArrivalsTitle,
  newArrivalsSubtitle,
  actionLabel,
  onPressViewAll,
}: ISummerSaleBannerProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: banner.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.newArrivalsSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{newArrivalsTitle}</Text>
            <Text style={styles.subtitle}>{newArrivalsSubtitle}</Text>
          </View>
          <TouchableOpacity style={styles.viewAllButton} onPress={onPressViewAll}>
            <Text style={styles.viewAllText}>{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
