import { View, Text, Image, TouchableOpacity } from 'react-native';

// Icons
import { RightArrowIcon } from '@app/icons';

// Types
import type { SPONSORED_BANNER } from '@app/constants/banner';

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
      <Image source={{ uri: banner.image }} style={styles.image} />
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

