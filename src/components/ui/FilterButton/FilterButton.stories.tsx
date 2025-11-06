import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Components
import { FilterButtons } from './index';

const meta: Meta<typeof FilterButtons> = {
  title: 'UI/FilterButtons',
  component: FilterButtons,
  args: {
    showFilter: true,
    showSort: true,
    onFilterPress: action('filter-pressed'),
    onSortPress: action('sort-pressed'),
  },
  parameters: {
    notes:
      'Filter and Sort inline buttons. Toggle visibility and wire up actions for presses.',
  },
  argTypes: {
    showFilter: {
      description: 'Show/hide Filter button',
      control: 'boolean',
    },
    showSort: {
      description: 'Show/hide Sort button',
      control: 'boolean',
    },
    onFilterPress: {
      description: 'Callback when Filter is pressed',
    },
    onSortPress: {
      description: 'Callback when Sort is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterButtons>;

export const Default: Story = {};

export const OnlyFilter: Story = {
  args: {
    showSort: false,
  },
};

export const OnlySort: Story = {
  args: {
    showFilter: false,
  },
};
