import { create } from 'zustand';

// Types
import type { TStatus, TPosition } from '@app/interfaces/ui';

// Constants
import { STATUS, POSITION } from '@app/constants';

export const TOAST_DURATION = {
  DEFAULT: 1000,
} as const;

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
