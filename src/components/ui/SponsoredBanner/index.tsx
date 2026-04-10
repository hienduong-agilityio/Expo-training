import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

// Icons
import { RightArrowIcon } from '@app/icons';

// Types
import type { SPONSORED_BANNER } from '@app/mocks/banners';

// Styles
import { styles } from './index.style';

interface ISponsoredBannerProps {
  banner: typeof SPONSORED_BANNER;
  onPress?: () => void;
}

export const SponsoredBanner = ({ banner, onPress }: ISponsoredBannerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sponsored</Text>
      <Image
        source={{ uri: banner.image }}
        style={styles.image}
        contentFit="cover"
        priority="normal"
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.footer}>
        <Text style={styles.footerText}>{banner.footerText}</Text>
        <RightArrowIcon size={16} color="#333" />
      </TouchableOpacity>
    </View>
  );
};
