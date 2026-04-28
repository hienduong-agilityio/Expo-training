import type { Meta, StoryObj } from '@storybook/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Components
import { GlobalHeader } from './index';

const meta: Meta<typeof GlobalHeader> = {
  title: 'Components/GlobalHeader',
  component: GlobalHeader,
  args: {
    showMenu: true,
    showProfile: true,
  },
  parameters: {
    notes:
      'Global header component with menu, logo, and profile icons. Supports safe area insets and customizable visibility.',
  },
  argTypes: {
    showMenu: {
      description: 'Show/hide menu button',
      control: 'boolean',
    },
    showProfile: {
      description: 'Show/hide profile button',
      control: 'boolean',
    },
    onMenuPress: {
      description: 'Callback when menu button is pressed',
      action: 'menu-pressed',
    },
    onProfilePress: {
      description: 'Callback when profile button is pressed',
      action: 'profile-pressed',
    },
  },
  decorators: [
    Story => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlobalHeader>;

export const Default: Story = {};
