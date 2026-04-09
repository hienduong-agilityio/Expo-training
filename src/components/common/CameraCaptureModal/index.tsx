import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Components
import { Button } from '@app/components/common/Button';

// Constants
import { BUTTON_LABELS } from '@app/constants';

// Styles
import { styles } from './index.style';

export interface ICameraCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export const CameraCaptureModal = ({
  visible,
  onClose,
  onCapture,
}: ICameraCaptureModalProps) => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (permission?.granted) return;
    requestPermission().catch(() => undefined);
  }, [visible, permission?.granted, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
      });
      if (photo?.uri) {
        onCapture(photo.uri);
        onClose();
      }
    } finally {
      setBusy(false);
    }
  }, [busy, onCapture, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        {permission?.granted ? (
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        ) : null}
        <View style={styles.actions}>
          <Button label={BUTTON_LABELS.CANCEL} onPress={onClose} />
          <Button
            label={BUTTON_LABELS.TAKE_PHOTO}
            onPress={handleCapture}
            disabled={!permission?.granted || busy}
          />
        </View>
      </View>
    </Modal>
  );
};
