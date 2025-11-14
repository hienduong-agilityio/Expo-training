// Types
import type { ComponentType } from 'react';
import type { IconProps } from '@app/interfaces/icons';

// Icons
import { VisaIcon, PaypalIcon, MaestroIcon, AppleIcon } from '@app/icons';

export const PAYMENT_PROVIDER = {
  VISA: 'visa',
  PAYPAL: 'paypal',
  MAESTRO: 'maestro',
  APPLE: 'apple',
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const PROVIDER_ICON_MAP: Record<
  PaymentProvider,
  ComponentType<IconProps>
> = {
  [PAYMENT_PROVIDER.VISA]: VisaIcon,
  [PAYMENT_PROVIDER.PAYPAL]: PaypalIcon,
  [PAYMENT_PROVIDER.MAESTRO]: MaestroIcon,
  [PAYMENT_PROVIDER.APPLE]: AppleIcon,
};
