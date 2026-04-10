import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

// Components
import { Button } from '@app/components/common/Button';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { BUTTON_LABELS, SETTINGS_MESSAGES } from '@app/constants';

// Hooks
import { useAuthActions } from '@app/hooks/useAuthActions';

// Styles
import { styles } from './index.style';

export const SettingsScreen = () => {
  const { logout } = useAuthActions();
  const userEmail = authStore(state => state.user?.email);

  const handleSignOut = useCallback(() => {
    logout();
  }, [logout]);

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
