import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

// Types
import type { SpecialOffersBannerType } from '@app/constants/banner';

// Styles
import { styles } from './index.style';

interface SpecialOffersBannerProps {
  banner: SpecialOffersBannerType;
}

export const SpecialOffersBanner = ({ banner }: SpecialOffersBannerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FastImage
          source={{ uri: banner.image, priority: FastImage.priority.normal }}
          style={styles.iconImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{banner.title}</Text>
          <Text style={styles.emoji}>😱</Text>
        </View>
        <Text style={styles.description}>{banner.description}</Text>
      </View>
    </View>
  );
};
