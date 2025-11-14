import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Component
import { PaymentMethods } from './index';

// Mocks
import { MOCK_PAYMENT_OPTIONS } from '@app/mocks/payments';

const meta: Meta<typeof PaymentMethods> = {
  title: 'UI/PaymentMethods',
  component: PaymentMethods,
  args: {
    title: 'Payment',
    options: MOCK_PAYMENT_OPTIONS,
    selectedId: MOCK_PAYMENT_OPTIONS[0].id,
    onSelect: action('select'),
    onContinue: action('continue'),
  },
  parameters: {
    notes: 'A list of payment methods with selection and a continue button.',
  },
};

export default meta;
type Story = StoryObj<typeof PaymentMethods>;

export const Default: Story = {};

export const AppleSelected: Story = {
  args: {
    selectedId: MOCK_PAYMENT_OPTIONS[1].id,
  },
};
