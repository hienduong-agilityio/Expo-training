import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

// Types
import type { ISaleBanner } from '@app/interfaces';

// Styles
import { styles } from './index.style';

interface ISummerSaleBannerProps {
  banner: ISaleBanner;
  newArrivalsTitle: string;
  newArrivalsSubtitle: string;
  actionLabel: string;
  onPressViewAll: () => void;
}

export const SummerSaleBanner = memo(function SummerSaleBanner({
  banner,
  newArrivalsTitle,
  newArrivalsSubtitle,
  actionLabel,
  onPressViewAll,
}: ISummerSaleBannerProps) {
  const handlePressViewAll = () => onPressViewAll();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: banner.image }}
        style={styles.image}
        contentFit="cover"
        priority="normal"
      />
      <View style={styles.newArrivalsSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{newArrivalsTitle}</Text>
            <Text style={styles.subtitle}>{newArrivalsSubtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handlePressViewAll}>
            <Text style={styles.viewAllText}>{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
