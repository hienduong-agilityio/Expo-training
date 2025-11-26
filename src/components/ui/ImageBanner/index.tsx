import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

// Types
import type { PromoBanner as PromoBannerType } from '@app/constants/banner';

// Styles
import { styles } from './index.style';

interface ImageBannerProps {
  banner: PromoBannerType;
  onPress?: () => void;
}

export const ImageBanner = ({ banner, onPress }: ImageBannerProps) => {
  return (
    <ImageBackground
      source={{ uri: banner.image }}
      style={styles.banner}
      imageStyle={styles.backgroundImage}>
      <View style={styles.content}>
        <View style={styles.text}>
          <Text style={styles.title}>{banner.title}</Text>
          <Text style={styles.subtitle}>{banner.subtitle}</Text>
          <Text style={styles.description}>{banner.description}</Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{banner.ctaText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
