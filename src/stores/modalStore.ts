import { create } from 'zustand';

interface IConfirmConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ModalState {
  confirmModal: {
    visible: boolean;
    config: IConfirmConfig | null;
  };
  showConfirm: (config: IConfirmConfig) => void;
  hideConfirm: () => void;
}

export const modalStore = create<ModalState>(set => ({
  confirmModal: {
    visible: false,
    config: null,
  },

  showConfirm: (config: IConfirmConfig) =>
    set({
      confirmModal: {
        visible: true,
        config,
      },
    }),

  hideConfirm: () =>
    set({
      confirmModal: {
        visible: false,
        config: null,
      },
    }),
}));
