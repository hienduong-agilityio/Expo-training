import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Components
import { AuthFooter } from './index';

const meta: Meta<typeof AuthFooter> = {
  title: 'UI/AuthFooter',
  component: AuthFooter,
  args: {
    helperText: "Don't have an account?",
    helperActionLabel: 'Sign up',
    onHelperActionPress: action('helper-action-pressed'),
    onSocialSelect: action('social-select'),
  },
  parameters: {
    notes:
      'Auth footer with submit button, social auth buttons and helper navigation.',
  },
  argTypes: {
    helperText: {
      description: 'Left-aligned helper text before the action link',
    },
    helperActionLabel: {
      description: 'Clickable action label next to helper text',
    },
    onHelperActionPress: {
      description: 'Called when helper action is pressed',
    },
    onSocialSelect: { description: 'Called with selected social provider' },
  },
};

export default meta;
type Story = StoryObj<typeof AuthFooter>;

export const Default: Story = {};

export const Login: Story = {
  args: {
    helperText: "Don't have an account?",
    helperActionLabel: 'Sign up',
    onHelperActionPress: action('helper-action-pressed'),
    onSocialSelect: action('social-select'),
  },
};

export const Signup: Story = {
  args: {
    helperText: 'Already have an account?',
    helperActionLabel: 'Sign in',
    onHelperActionPress: action('helper-action-pressed'),
    onSocialSelect: action('social-select'),
  },
};
