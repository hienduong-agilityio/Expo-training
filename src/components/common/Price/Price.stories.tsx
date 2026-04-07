import type { Meta, StoryObj } from '@storybook/react';

// Components
import { Price } from './index';

// Types
import type { CurrencyCode } from '@app/helpers';

const meta: Meta<typeof Price> = {
  title: 'Components/Common/Price',
  component: Price,
  args: {
    value: 99.99,
    currency: 'USD' as CurrencyCode,
  },
  parameters: {
    notes:
      'Price component that formats currency values with appropriate symbols',
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, step: 0.01 },
    },
    currency: {
      options: ['USD', 'INR'] as CurrencyCode[],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Price>;

export const Default: Story = {};

export const USDCurrency: Story = {
  args: {
    value: 29.99,
    currency: 'USD',
  },
};

export const INRCurrency: Story = {
  args: {
    value: 1999,
    currency: 'INR',
  },
};
