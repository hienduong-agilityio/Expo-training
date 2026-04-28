import React from 'react';
import { View, StyleSheet } from 'react-native';

// Components
import { ToastMessages } from './index';

// Types
import type { IToastMessagesProps } from './index';

// Themes
import { colors } from '@app/themes';

// Storybook
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ToastMessages> = {
  title: 'UI/ToastMessages',
  component: ToastMessages,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    visible: { control: 'boolean' },
    message: { control: 'text' },
    type: {
      control: { type: 'radio' },
      options: ['success', 'error', 'warning', 'info'],
    },
    position: {
      control: { type: 'radio' },
      options: ['top', 'bottom'],
    },
    onClose: { action: 'onClose' },
  },
};

export default meta;

type Story = StoryObj<typeof ToastMessages>;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.screen}>{children}</View>
);

export const Default: Story = {
  args: {
    visible: true,
    message: 'Something went wrong. Please try again.',
    position: 'top',
    type: 'error',
  } satisfies IToastMessagesProps,
  render: args => (
    <Frame>
      <ToastMessages {...args} />
    </Frame>
  ),
};

export const Bottom: Story = {
  args: {
    visible: true,
    message: 'Oops, failed to load data.',
    position: 'bottom',
    type: 'warning',
  } satisfies IToastMessagesProps,
  render: args => (
    <Frame>
      <ToastMessages {...args} />
    </Frame>
  ),
};

export const WithoutRetry: Story = {
  args: {
    visible: true,
    message: 'Error occurred but retry is disabled.',
    position: 'top',
    type: 'info',
  } satisfies IToastMessagesProps,
  render: args => (
    <Frame>
      <ToastMessages {...args} />
    </Frame>
  ),
};

export const Success: Story = {
  args: {
    visible: true,
    message: 'Payment successful. Welcome aboard! 🎉',
    position: 'top',
    type: 'success',
  } satisfies IToastMessagesProps,
  render: args => (
    <Frame>
      <ToastMessages {...args} />
    </Frame>
  ),
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
