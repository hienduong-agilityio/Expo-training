import type { PaymentOption } from '@app/interfaces/payments';

// Constants
import { PAYMENT_PROVIDER } from '@app/constants';

// Mocks
export const MOCK_PAYMENT_OPTIONS: PaymentOption[] = [
  { id: PAYMENT_PROVIDER.VISA, maskedCardNumber: '************2312' },
  { id: PAYMENT_PROVIDER.PAYPAL, maskedCardNumber: '************2312' },
  { id: PAYMENT_PROVIDER.MAESTRO, maskedCardNumber: '************2312' },
  { id: PAYMENT_PROVIDER.APPLE, maskedCardNumber: '************2312' },
];
