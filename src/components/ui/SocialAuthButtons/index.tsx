// Components
import { View, TouchableOpacity } from 'react-native';

// Icons
import { GoogleIcon, AppleIcon, FacebookIcon } from '@app/icons';

// Styles
import { styles } from './index.style';

// Themes
import { iconSize } from '@app/themes';

// Constants
import { SOCIAL_PROVIDER } from '@app/constants';

// Types
import type { SocialProvider } from '@app/constants';

interface ISocialAuthButtonsProps {
  onSelect?: (provider: SocialProvider) => void;
  disabled?: boolean;
}

export const SocialAuthButtons = ({
  onSelect = () => {},
  disabled = false,
}: ISocialAuthButtonsProps) => {
  const handleGooglePress = () => {
    onSelect(SOCIAL_PROVIDER.GOOGLE);
  };

  const handleApplePress = () => {
    onSelect(SOCIAL_PROVIDER.APPLE);
  };

  const handleFacebookPress = () => {
    onSelect(SOCIAL_PROVIDER.FACEBOOK);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGooglePress}
        disabled={disabled}>
        <GoogleIcon size={iconSize['2xl']} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleApplePress}
        disabled={disabled}>
        <AppleIcon size={iconSize['2xl']} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFacebookPress}
        disabled={disabled}>
        <FacebookIcon size={iconSize['2xl']} />
      </TouchableOpacity>
    </View>
  );
};
