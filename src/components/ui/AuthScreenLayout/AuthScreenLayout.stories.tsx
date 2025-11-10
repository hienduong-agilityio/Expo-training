import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

// Components
import { AuthScreenLayout } from './index';
import { TextField } from '@app/components/common/TextField';
import { AuthFooter } from '@app/components/ui/AuthFooter';

// Themes
import { spacing } from '@app/themes';

const meta: Meta<typeof AuthScreenLayout> = {
  title: 'UI/AuthScreenLayout',
  component: AuthScreenLayout,
  args: {
    title: 'Welcome Back',
  },
  parameters: {
    notes:
      'Simple layout showcasing two TextField inputs inside AuthScreenLayout to preview the UI.',
  },
};

export default meta;

type Story = StoryObj<typeof AuthScreenLayout>;

export const Default: Story = {
  render: args => (
    <AuthScreenLayout {...args}>
      <View style={styles.form}>
        <TextField label="Email" placeholder="Enter your email" />
        <TextField
          label="Password"
          placeholder="Enter your password"
          isSecureText
        />
        <AuthFooter
          helperText="Don't have an account?"
          helperActionLabel="Sign up"
          onHelperActionPress={action('helper-action-pressed')}
          onSubmit={action('submit-pressed')}
          onSocialSelect={action('social-select')}
        />
      </View>
    </AuthScreenLayout>
  ),
};

const styles = StyleSheet.create({
  form: {
    gap: spacing['5'],
    paddingVertical: spacing['2'],
  },
});
