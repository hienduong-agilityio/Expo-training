// Constants
import type { PaymentProvider } from '@app/constants/payments';

export interface PaymentOption {
  id: PaymentProvider;
  maskedCardNumber: string;
}
