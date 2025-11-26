import { View, Text, Image } from 'react-native';

// Types
import type { SPECIAL_OFFERS_BANNER } from '@app/constants/banner';

// Styles
import { styles } from './index.style';

interface SpecialOffersBannerProps {
  banner: typeof SPECIAL_OFFERS_BANNER;
}

export const SpecialOffersBanner = ({ banner }: SpecialOffersBannerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: banner.image }}
          style={styles.iconImage}
          resizeMode="cover"
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
