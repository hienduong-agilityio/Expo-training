import { View, Text, TouchableOpacity } from 'react-native';

// Components
import { BaseModal } from '@app/components/common/BaseModal';

// Stores
import { modalStore } from '@app/stores/modalStore';

// Styles
import { styles } from './index.style';
import { BUTTON_LABELS } from '@app/constants/common';

export const ConfirmModal = () => {
  const { confirmModal, hideConfirm } = modalStore();
  const { visible, config } = confirmModal;

  if (!config) return null;

  const {
    title,
    message,
    confirmLabel = BUTTON_LABELS.CONFIRM,
    cancelLabel = BUTTON_LABELS.CANCEL,
    isDestructive = false,
    onConfirm,
    onCancel,
  } = config;

  const handleCancel = () => {
    onCancel?.();
    hideConfirm();
  };

  const handleConfirm = () => {
    onConfirm();
    hideConfirm();
  };

  return (
    <BaseModal visible={visible} onClose={handleCancel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            isDestructive
              ? styles.confirmButtonDestructive
              : styles.confirmButton,
          ]}
          onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
