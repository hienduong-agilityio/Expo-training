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
} from '@app/constants';

// Styles
import { styles } from './index.style';

// Hooks
import { useAuthActions } from '@app/hooks/useAuthActions';

export const SettingsScreen = () => {
  const { user } = authStore();
  const { logout } = useAuthActions();
  const { showToast } = toastStore();

  const handleSignOut = async () => {
    try {
      await logout();

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
        <Text style={styles.text}>User: {user?.email ?? '—'}</Text>
        <Button label={BUTTON_LABELS.SIGN_OUT} onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
};
