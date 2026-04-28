import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Component
import { PaymentMethodItem } from './index';

// Icons
import { VisaIcon } from '@app/icons';
import { IconProps } from '@app/interfaces/icons';

const meta: Meta<typeof PaymentMethodItem> = {
  title: 'UI/PaymentMethodItem',
  component: PaymentMethodItem,
  args: {
    Icon: (props: IconProps) => <VisaIcon {...props} />,
    label: '********2109',
    selected: true,
    onPress: action('press'),
  },
  parameters: {
    notes: 'A selectable payment method row with an icon and masked label.',
  },
};

export default meta;
type Story = StoryObj<typeof PaymentMethodItem>;

export const Default: Story = {};

export const Unselected: Story = {
  args: { selected: false },
};
