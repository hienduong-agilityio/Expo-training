import { View, Text, TouchableOpacity } from 'react-native';

// Components
import {
  SocialAuthButtons,
  SocialProvider,
} from '@app/components/ui/SocialAuthButtons';

// Styles
import { styles } from './index.style';

interface AuthFooterProps {
  helperText: string;
  helperActionLabel: string;
  onSubmit?: () => void;
  onHelperActionPress?: () => void;
  onSocialSelect?: (provider: SocialProvider) => void;
}

export const AuthFooter = ({
  helperText,
  helperActionLabel,
  onHelperActionPress,
  onSocialSelect,
}: AuthFooterProps) => {
  return (
    <>
      <View style={styles.divider}>
        <Text style={styles.dividerLabel}>OR continue with</Text>
      </View>
      <SocialAuthButtons onSelect={onSocialSelect} />

      <View style={styles.navigationContainer}>
        <Text style={styles.navigationText}>{helperText}</Text>
        <TouchableOpacity onPress={onHelperActionPress}>
          <Text style={styles.navigationLink}>{helperActionLabel}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
