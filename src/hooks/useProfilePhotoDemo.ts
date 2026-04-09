import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

/**
 * Local-only demo: library picker (expo-image-picker) + camera (expo-camera modal).
 * Does not upload; useful to verify permissions and native modules after prebuild.
 */
export const useProfilePhotoDemo = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const pickFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const openCamera = useCallback(() => setCameraOpen(true), []);
  const closeCamera = useCallback(() => setCameraOpen(false), []);

  const onCameraCapture = useCallback((uri: string) => {
    setImageUri(uri);
  }, []);

  return {
    imageUri,
    cameraOpen,
    pickFromLibrary,
    openCamera,
    closeCamera,
    onCameraCapture,
  };
};
