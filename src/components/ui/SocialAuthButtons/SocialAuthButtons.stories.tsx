import type { Meta, StoryObj } from '@storybook/react';

// Components
import { SocialAuthButtons } from './index';

const meta: Meta<typeof SocialAuthButtons> = {
  title: 'UI/SocialAuthButtons',
  component: SocialAuthButtons,
  parameters: {
    notes: 'Simple social auth buttons: Google, Apple, Facebook.',
  },
  argTypes: {
    onSelect: {
      description: 'Callback when a provider is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialAuthButtons>;

export const Default: Story = {
  args: {},
};
