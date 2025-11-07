import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { View, StyleSheet } from 'react-native';

// Component
import { PromoBanner } from './index';

// Icons
import { ClockIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

const meta: Meta<typeof PromoBanner> = {
  title: 'UI/PromoBanner',
  component: PromoBanner,
  args: {
    title: 'Deal of the Day',
    label: '22h 55m 20s remaining',
    Icon: ClockIcon,
    onPressViewAll: action('view-all-pressed'),
  },
};

export default meta;

type Story = StoryObj<typeof PromoBanner>;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.surfaceMuted },
});

export const Blue: Story = {
  args: {
    customStyle: { container: { backgroundColor: colors.secondary } },
  },

  render: args => (
    <View style={styles.container}>
      <PromoBanner {...args} />
    </View>
  ),
};

export const Primary: Story = {
  args: {
    customStyle: { container: { backgroundColor: colors.primary } },
  },

  render: args => (
    <View style={styles.container}>
      <PromoBanner {...args} />
    </View>
  ),
};
