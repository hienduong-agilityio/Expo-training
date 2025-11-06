import type { Meta, StoryObj } from '@storybook/react';

// Components
import { DeliveryInfo } from './index';

const meta: Meta<typeof DeliveryInfo> = {
  title: 'UI/DeliveryInfo',
  component: DeliveryInfo,
  args: {
    deliveryTime: '1 within Hour',
  },
  parameters: {
    notes: 'Delivery information component showing estimated delivery time.',
  },
  argTypes: {
    deliveryTime: {
      description: 'Estimated delivery time text',
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DeliveryInfo>;

export const Default: Story = {};
