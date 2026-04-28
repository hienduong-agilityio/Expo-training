import { create } from 'zustand';

// Types
import type { TStatus, TPosition } from '@app/interfaces/ui';

// Constants
import { STATUS, POSITION, TOAST_DURATION } from '@app/constants';

interface ToastState {
  visible: boolean;
  message: string;
  type: TStatus;
  position: TPosition;
  duration: number;
  showToast: (opts: {
    message: string;
    type?: TStatus;
    position?: TPosition;
    duration?: number;
  }) => void;
  hideToast: () => void;
}

export const toastStore = create<ToastState>(set => ({
  visible: false,
  message: '',
  type: STATUS.INFO,
  position: POSITION.TOP,
  duration: TOAST_DURATION.DEFAULT,
  showToast: ({
    message,
    type = STATUS.INFO,
    position = POSITION.TOP,
    duration = TOAST_DURATION.DEFAULT,
  }) => set({ visible: true, message, type, position, duration }),
  hideToast: () => set({ visible: false, message: '' }),
}));
