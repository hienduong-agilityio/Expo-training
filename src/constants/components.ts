import React from 'react';

// Icons
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

// Types
import type { IconProps, TStatus } from '@app/interfaces';

export const TOAST_COLOR_BY_STATUS: Record<TStatus, string> = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
};

export const TOAST_ICON_BY_STATUS: Record<
  TStatus,
  (props: IconProps) => React.ReactNode
> = {
  success: props => React.createElement(SuccessIcon, props),
  error: props => React.createElement(ErrorIcon, props),
  warning: props => React.createElement(WarningIcon, props),
  info: props => React.createElement(InfoIcon, props),
};
