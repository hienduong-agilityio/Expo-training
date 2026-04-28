import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet, Text } from 'react-native';

// Components
import { TextField } from './index';

// Enums
import { TEXTFIELD_VARIANTS } from '@app/enums';

// Themes
import { colors, spacing, typography } from '@app/themes';

const meta: Meta<typeof TextField> = {
  title: 'Components/Common/TextField',
  component: TextField,
  args: {
    placeholder: 'Enter text...',
    variant: TEXTFIELD_VARIANTS.OUTLINED,
    size: 'md',
  },
  parameters: {
    notes:
      'Simple TextField component with essential props: outlined/filled variants, sizes (sm/md/lg), error states, and disabled state.',
  },
  argTypes: {
    label: { description: 'Field label', control: 'text' },
    placeholder: { description: 'Placeholder text', control: 'text' },
    value: { description: 'Input value', control: 'text' },
    onChangeText: { description: 'Callback when text changes' },
    variant: {
      description: 'Visual variant',
      options: Object.values(TEXTFIELD_VARIANTS),
      control: { type: 'inline-radio' },
    },
    size: {
      description: 'Size',
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
    error: {
      description: 'Error message text',
      control: 'text',
    },
    isSecureText: {
      description: 'Password field with show/hide toggle',
      control: 'boolean',
    },
    leftIcon: {
      description: 'Left icon component',
      control: false,
    },
    rightIcon: {
      description: 'Right icon component',
      control: false,
    },
  },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    isSecureText: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    value: 'Cannot edit this',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeLabel}>Small</Text>
        <TextField
          placeholder="Small size"
          size="sm"
          variant={TEXTFIELD_VARIANTS.OUTLINED}
        />
      </View>
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeLabel}>Medium</Text>
        <TextField
          placeholder="Medium size"
          size="md"
          variant={TEXTFIELD_VARIANTS.OUTLINED}
        />
      </View>
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeLabel}>Large</Text>
        <TextField
          placeholder="Large size"
          size="lg"
          variant={TEXTFIELD_VARIANTS.OUTLINED}
        />
      </View>
    </View>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.variantContainer}>
        <Text style={styles.variantLabel}>Outlined</Text>
        <TextField
          label="Outlined TextField"
          placeholder="Outlined variant"
          variant={TEXTFIELD_VARIANTS.OUTLINED}
        />
      </View>
      <View style={styles.variantContainer}>
        <Text style={styles.variantLabel}>Filled</Text>
        <TextField
          label="Filled TextField"
          placeholder="Filled variant"
          variant={TEXTFIELD_VARIANTS.FILLED}
        />
      </View>
    </View>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <View style={styles.container}>
      <TextField
        label="Search"
        placeholder="Search products..."
        leftIcon={<Text>🔍</Text>}
      />
      <TextField
        label="Email"
        placeholder="Enter your email"
        rightIcon={<Text>📧</Text>}
      />
      <TextField
        label="Amount"
        placeholder="0.00"
        leftIcon={<Text>💰</Text>}
        rightIcon={<Text>USD</Text>}
      />
    </View>
  ),
};

export const PasswordField: Story = {
  render: () => (
    <View style={styles.container}>
      <TextField
        label="Password with Toggle"
        placeholder="Enter password"
        isSecureText={true}
      />
      <TextField
        label="Confirm Password"
        placeholder="Confirm password"
        isSecureText={true}
        variant={TEXTFIELD_VARIANTS.FILLED}
      />
    </View>
  ),
};

export const ComplexExamples: Story = {
  render: () => (
    <View style={styles.container}>
      <TextField
        label="Search with Icon"
        placeholder="Search..."
        leftIcon={<Text>🔍</Text>}
        rightIcon={<Text>❌</Text>}
      />
      <TextField
        label="Password with Custom Icon"
        placeholder="Enter password"
        leftIcon={<Text>🔒</Text>}
        isSecureText={true}
      />
      <TextField
        label="Error State with Icon"
        placeholder="Enter email"
        leftIcon={<Text>📧</Text>}
        error="Please enter a valid email"
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    gap: spacing['2'],
    padding: spacing['2'],
  },
  sizeContainer: {
    gap: spacing['1.25'],
  },
  sizeLabel: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  variantContainer: {
    gap: spacing['1.25'],
  },
  variantLabel: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
});
