import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';

// Styles
import { styles } from './index.style';

// Mocks
import { NO_INTERNET_CONNECTION_IMAGE } from '@app/mocks/home';

interface INoInternetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NoInternetModal = ({
  visible,
  onClose,
}: INoInternetModalProps) => {
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.container} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.contentWrapper} pointerEvents="box-none">
          <View style={styles.content}>
            <Image
              source={{ uri: NO_INTERNET_CONNECTION_IMAGE }}
              style={styles.image}
              contentFit="cover"
              priority="normal"
            />

            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.description}>
              Please check your connection and try again.
            </Text>

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={openSettings}>
              <Text style={styles.textPrimary}>Go to Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
              <Text style={styles.textSecondary}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
