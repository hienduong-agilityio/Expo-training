import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

// Components
import { NavigationButtons } from './index';

// Themes
import { borderRadius, colors, spacing, typography } from '@app/themes';

const meta: Meta<typeof NavigationButtons> = {
  title: 'UI/NavigationButtons',
  component: NavigationButtons,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    show: { description: 'Show/hide all buttons' },
    disabledLeft: { description: 'Disable left button' },
    disabledRight: { description: 'Disable right button' },
    onLeft: {
      action: 'onLeft',
      description: 'Handler when left button is pressed',
    },
    onRight: {
      action: 'onRight',
      description: 'Handler when right button is pressed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationButtons>;

const Frame: React.FC<{ children: React.ReactNode; label?: string }> = ({
  children,
  label,
}) => (
  <View style={styles.container}>
    <View style={styles.carousel}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      {children}
    </View>
  </View>
);

export const Default: Story = {
  args: {
    show: true,
    disabledLeft: false,
    disabledRight: false,
  },

  render: args => (
    <Frame label="Slide 2/5">
      <NavigationButtons {...args} />
    </Frame>
  ),
};

export const AtStart: Story = {
  args: {
    show: true,
    disabledLeft: true,
    disabledRight: false,
  },

  render: args => (
    <Frame label="Slide 1/5">
      <NavigationButtons {...args} />
    </Frame>
  ),
};

export const AtEnd: Story = {
  args: {
    show: true,
    disabledLeft: false,
    disabledRight: true,
  },

  render: args => (
    <Frame label="Slide 5/5">
      <NavigationButtons {...args} />
    </Frame>
  ),
};

export const Hidden: Story = {
  args: {
    show: false,
    disabledLeft: false,
    disabledRight: false,
  },

  render: args => (
    <Frame label="No controls">
      <NavigationButtons {...args} />
    </Frame>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['6'],
  },
  carousel: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    top: spacing['2'],
    color: colors.textMuted,
    fontSize: typography.fontSizes['2xl'],
  },
});
