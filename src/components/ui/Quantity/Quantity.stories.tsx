import type { Meta, StoryObj } from '@storybook/react';

// Components
import { Quantity } from './index';

const meta: Meta<typeof Quantity> = {
  title: 'UI/Quantity',
  component: Quantity,
  args: {
    value: 2,
    min: 0,
    max: 10,
    onIncrease: () => {},
    onDecrease: () => {},
  },
  parameters: {
    notes:
      'Quantity stepper component with increase/decrease controls and bounds.',
  },
  argTypes: {
    value: {
      description: 'Current quantity value',
      control: { type: 'number', min: 0, max: 20 },
    },
    min: {
      description: 'Minimum allowed quantity',
      control: { type: 'number', min: 0, max: 20 },
    },
    max: {
      description: 'Maximum allowed quantity',
      control: { type: 'number', min: 1, max: 50 },
    },
    onIncrease: { description: 'Callback when increase is pressed' },
    onDecrease: { description: 'Callback when decrease is pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof Quantity>;

export const Default: Story = {};

export const MinBound: Story = {
  args: {
    value: 0,
    min: 0,
  },
};

export const MaxBound: Story = {
  args: {
    value: 10,
    max: 10,
  },
};
