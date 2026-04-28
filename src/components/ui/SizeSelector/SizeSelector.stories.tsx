import type { Meta, StoryObj } from '@storybook/react';

import { MOCK_SIZES } from '@app/mocks/products';

// Components
import { SizeSelector } from './index';

const meta: Meta<typeof SizeSelector> = {
  title: 'UI/SizeSelector',
  component: SizeSelector,
  args: {
    sizes: [...MOCK_SIZES],
    selectedSize: 'M',
    onSizeSelect: () => {},
  },
  parameters: {
    notes: 'Size selector component for choosing product sizes.',
  },
  argTypes: {
    sizes: {
      description: 'Array of available sizes',
      control: { type: 'object' },
    },
    selectedSize: {
      description: 'Currently selected size',
      control: 'text',
    },
    onSizeSelect: {
      description: 'Callback when size is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SizeSelector>;

export const Default: Story = {
  args: {
    sizes: [...MOCK_SIZES],
    selectedSize: 'M',
    onSizeSelect: () => {},
  },
};

export const NoSelection: Story = {
  args: {
    selectedSize: undefined,
  },
};
