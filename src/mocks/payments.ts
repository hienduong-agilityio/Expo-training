import type { PaymentOption } from '@app/interfaces/payments';

export const MOCK_PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'visa', maskedCardNumber: '************2312' },
  { id: 'paypal', maskedCardNumber: '************2312' },
  { id: 'maestro', maskedCardNumber: '************2312' },
  { id: 'apple', maskedCardNumber: '************2312' },
];
