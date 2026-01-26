import { View, Text, TouchableOpacity } from 'react-native';

// Components
import { SocialAuthButtons } from '@app/components/ui/SocialAuthButtons';

// Types
import type { SocialProvider } from '@app/constants';

// Styles
import { styles } from './index.style';

interface AuthFooterProps {
  helperText: string;
  helperActionLabel: string;
  onSubmit?: () => void;
  onHelperActionPress?: () => void;
  onSocialSelect?: (provider: SocialProvider) => void;
  disabled?: boolean;
}

export const AuthFooter = ({
  helperText,
  helperActionLabel,
  onHelperActionPress,
  onSocialSelect,
  disabled = false,
}: AuthFooterProps) => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.divider}>
        <Text style={styles.dividerLabel}>- OR continue with -</Text>
      </View>
      <SocialAuthButtons onSelect={onSocialSelect} disabled={disabled} />

      <View style={styles.navigationContainer}>
        <Text style={styles.navigationText}>{helperText}</Text>
        <TouchableOpacity onPress={onHelperActionPress} disabled={disabled}>
          <Text style={styles.navigationLink}>{helperActionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
