import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

// Components
import { OnboardingNavigation } from './index';

// Themes
import { colors, spacing } from '@app/themes';

const meta: Meta<typeof OnboardingNavigation> = {
  title: 'UI/OnboardingNavigation',
  component: OnboardingNavigation,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    currentIndex: {
      description: 'Current page index (0-based)',
      control: { type: 'number', min: 0, max: 4, step: 1 },
      defaultValue: 0,
    },
    totalCount: {
      description: 'Total number of pages',
      control: { type: 'number', min: 1, max: 5, step: 1 },
      defaultValue: 3,
    },
    onPrev: { description: 'Callback when previous button is pressed' },
    onNext: { description: 'Callback when next button is pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof OnboardingNavigation>;

const defaultProps = {
  onPrev: () => {
    // Previous pressed
  },
  onNext: () => {
    // Next pressed
  },
};

export const FirstPage: Story = {
  args: {
    ...defaultProps,
    currentIndex: 0,
    totalCount: 3,
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingNavigation {...args} />
    </View>
  ),
};

export const MiddlePage: Story = {
  args: {
    ...defaultProps,
    currentIndex: 1,
    totalCount: 3,
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingNavigation {...args} />
    </View>
  ),
};

export const LastPage: Story = {
  args: {
    ...defaultProps,
    currentIndex: 2,
    totalCount: 3,
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingNavigation {...args} />
    </View>
  ),
};

export const AllStates: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.stateContainer}>
        <OnboardingNavigation
          currentIndex={0}
          totalCount={3}
          onPrev={() => {}}
          onNext={() => {}}
        />
      </View>
      <View style={styles.stateContainer}>
        <OnboardingNavigation
          currentIndex={1}
          totalCount={3}
          onPrev={() => {}}
          onNext={() => {}}
        />
      </View>
      <View style={styles.stateContainer}>
        <OnboardingNavigation
          currentIndex={2}
          totalCount={3}
          onPrev={() => {}}
          onNext={() => {}}
        />
      </View>
    </View>
  ),
};

export const SinglePage: Story = {
  args: {
    ...defaultProps,
    currentIndex: 0,
    totalCount: 1,
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingNavigation {...args} />
    </View>
  ),
};

export const FivePages: Story = {
  args: {
    ...defaultProps,
    currentIndex: 2,
    totalCount: 5,
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingNavigation {...args} />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2'],
  },
  stateContainer: {
    marginBottom: spacing['2'],
    width: '100%',
  },
});
