import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

// Components
import { Button } from '@app/components/common/Button';

// Enums
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  args: {
    label: 'Login',
    variant: BUTTON_VARIANTS.SOLID,
    color: BUTTON_COLORS.PRIMARY,
    size: 'md',
  },
  parameters: {
    notes:
      'Base button component: only solid/outline, size sm|md|lg, supports disabled and selected for outline chip.',
  },
  argTypes: {
    label: { description: 'Displayed text', control: 'text' },
    onPress: { description: 'Callback when pressed' },
    variant: {
      description: 'Visual variant',
      options: Object.values(BUTTON_VARIANTS),
      control: { type: 'inline-radio' },
    },
    color: {
      description: 'Color tone (brand/neutral)',
      options: Object.values(BUTTON_COLORS),
      control: { type: 'inline-radio' },
    },
    size: {
      description: 'Size',
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
    disabled: {
      description: 'Disabled, not clickable',
      control: 'boolean',
    },
    selected: {
      description: 'Only for outline; switches to fill',
      control: 'boolean',
    },
    fullWidth: { description: 'Takes 100% width', control: 'boolean' },
    accessibilityLabel: {
      description: 'Accessibility label (default = label)',
      control: 'text',
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const SolidSizes: Story = {
  render: () => (
    <View style={styles.container}>
      <Button label="Small" size="sm" variant={BUTTON_VARIANTS.SOLID} />
      <Button label="Medium" size="md" variant={BUTTON_VARIANTS.SOLID} />
      <Button label="Large" size="lg" variant={BUTTON_VARIANTS.SOLID} />
    </View>
  ),
};

export const SolidDisabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    variant: BUTTON_VARIANTS.SOLID,
  },
};

export const OutlineChip: Story = {
  args: {
    label: '6 USD',
    variant: BUTTON_VARIANTS.OUTLINE,
    size: 'lg',
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});
