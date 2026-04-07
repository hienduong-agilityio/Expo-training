import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Components
import { SearchBar } from './index';

const meta: Meta<typeof SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  args: {
    value: '',
    placeholder: 'Search for products',
    showMicrophone: true,
    onChangeText: action('change-text'),
    onSubmitEditing: action('submit-editing'),
    onMicrophonePress: action('microphone-press'),
  },
  parameters: {
    controls: { expanded: true },
    notes: 'A compact search input with optional microphone action.',
  },
  argTypes: {
    value: {
      description: 'Controlled input value',
      control: 'text',
    },
    placeholder: {
      description: 'Input placeholder text',
      control: 'text',
    },
    showMicrophone: {
      description: 'Show/hide microphone action button',
      control: 'boolean',
    },
    onChangeText: {
      description: 'Fires when text changes',
    },
    onSubmitEditing: {
      description: 'Fires when the search is submitted',
    },
    onMicrophonePress: {
      description: 'Fires when microphone button is pressed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithoutMicrophone: Story = {
  args: {
    showMicrophone: false,
  },
};

export const Prefilled: Story = {
  args: {
    value: 'Shoes',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search anything...',
  },
};
