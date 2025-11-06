import { View, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

// Components
import { OnboardingSlide } from './index';

// Constants
import { ONBOARDING_DATA } from '@app/constants';

// Themes
import { colors } from '@app/themes';

const meta: Meta<typeof OnboardingSlide> = {
  title: 'UI/OnboardingSlide',
  component: OnboardingSlide,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    item: {
      description: 'Onboarding item with icon, title and description',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof OnboardingSlide>;

export const Default: Story = {
  args: {
    item: ONBOARDING_DATA[0],
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingSlide {...args} />
    </View>
  ),
};

export const AllSlides: Story = {
  render: () => (
    <View style={styles.container}>
      {ONBOARDING_DATA.map(item => (
        <View key={item.id} style={styles.slideContainer}>
          <OnboardingSlide item={item} />
        </View>
      ))}
    </View>
  ),
};

export const PaymentSlide: Story = {
  args: {
    item: ONBOARDING_DATA[1],
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingSlide {...args} />
    </View>
  ),
};

export const OrderSlide: Story = {
  args: {
    item: ONBOARDING_DATA[2],
  },
  render: args => (
    <View style={styles.container}>
      <OnboardingSlide {...args} />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  slideContainer: {
    marginBottom: 40,
  },
});
