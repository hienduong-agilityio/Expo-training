import { useEffect } from 'react';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Components
import { ToastMessages } from '@app/components/common/ToastMessages';

export const ToastContainer = () => {
  const { visible, message, type, position, duration, hideToast } =
    toastStore();

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, hideToast]);

  return (
    <ToastMessages
      visible={visible}
      message={message}
      type={type}
      position={position}
      onClose={hideToast}
    />
  );
};
