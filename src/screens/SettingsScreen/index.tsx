import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

// Components
import { Button } from '@app/components/common/Button';
import { CameraCaptureModal } from '@app/components/common/CameraCaptureModal';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { BUTTON_LABELS, SETTINGS_MESSAGES } from '@app/constants';

// Hooks
import { useAuthActions } from '@app/hooks/useAuthActions';
import { useProfilePhotoDemo } from '@app/hooks/useProfilePhotoDemo';

// Styles
import { styles } from './index.style';

export const SettingsScreen = () => {
  const { logout } = useAuthActions();
  const {
    imageUri,
    cameraOpen,
    pickFromLibrary,
    openCamera,
    closeCamera,
    onCameraCapture,
  } = useProfilePhotoDemo();

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

        <View style={styles.photoSection}>
          <Text style={styles.text}>{SETTINGS_MESSAGES.PHOTO_DEMO_TITLE}</Text>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.photoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.photoPreview} />
          )}
          <View style={styles.photoActions}>
            <Button
              label={BUTTON_LABELS.PICK_PHOTO}
              onPress={pickFromLibrary}
            />
            <Button label={BUTTON_LABELS.TAKE_PHOTO} onPress={openCamera} />
          </View>
        </View>

        <Button label={BUTTON_LABELS.SIGN_OUT} onPress={handleSignOut} />
      </View>

      <CameraCaptureModal
        visible={cameraOpen}
        onClose={closeCamera}
        onCapture={onCameraCapture}
      />
    </SafeAreaView>
  );
};
