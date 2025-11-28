import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { Button } from '@app/components/common/Button';

// Stores
import { authStore } from '@app/stores/authStore';
import { toastStore } from '@app/stores/toastStore';

// Constants
import {
  BUTTON_LABELS,
  POSITION,
  STATUS,
  TOAST_MESSAGES,
  SETTINGS_MESSAGES,
} from '@app/constants';

// Hooks
import { useAuthActions } from '@app/hooks/useAuthActions';

// Styles
import { styles } from './index.style';

export const SettingsScreen = () => {
  const userEmail = authStore(state => state.user?.email);
  const showToast = toastStore(state => state.showToast);

  const { logout } = useAuthActions();

  const handleSignOut = () => {
    try {
      logout();

      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.SIGNED_OUT,
        position: POSITION.TOP,
      });
    } catch (error) {
      showToast({
        type: STATUS.ERROR,
        message: TOAST_MESSAGES.REQUEST_FAILED,
        position: POSITION.TOP,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          User:
          {userEmail ?? SETTINGS_MESSAGES.DEFAULT_USER}
        </Text>
        <Button label={BUTTON_LABELS.SIGN_OUT} onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
};
