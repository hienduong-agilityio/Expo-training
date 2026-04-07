import type { Meta, StoryObj } from '@storybook/react';

// Components
import { LoadingButton } from '@app/components/common/LoadingButton';

const meta: Meta<typeof LoadingButton> = {
  title: 'Components/Common/LoadingButton',
  component: LoadingButton,
  args: {
    label: 'Submit',
    onPress: () => {},
  },
  parameters: {
    notes: 'Button component with loading state and disabled functionality.',
  },
  argTypes: {
    label: { description: 'Button text', control: 'text' },
    loadingLabel: { description: 'Text shown when loading', control: 'text' },
    onPress: { description: 'Press callback' },
    disabled: {
      description: 'Disabled state',
      control: 'boolean',
    },
    loading: {
      description: 'Loading state',
      control: 'boolean',
    },
    fullWidth: {
      description: 'Full width button',
      control: 'boolean',
    },
    size: {
      description: 'Size',
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingButton>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    label: 'Submit',
    loadingLabel: 'Submitting...',
    loading: true,
  },
};
