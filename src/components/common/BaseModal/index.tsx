import { Modal, View, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

// Styles
import { styles } from './index.style';

// Themes
import { colors } from '@app/themes';

export interface IBaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  backdropOpacity?: number;
  backdropColor?: string;
  contentStyle?: ViewStyle;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
}

export const BaseModal = ({
  visible,
  onClose,
  children,
  backdropOpacity = 0.5,
  backdropColor = colors.black,
  contentStyle,
  animationType = 'fade',
  transparent = true,
}: IBaseModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[
              styles.backdrop,
              {
                backgroundColor: backdropColor,
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <View style={[styles.contentContainer, contentStyle]}>{children}</View>
      </View>
    </Modal>
  );
};
