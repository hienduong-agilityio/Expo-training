import type { Meta, StoryObj } from '@storybook/react';

// Components
import { StarsRating } from '@app/components/ui/StarsRating';

const meta: Meta<typeof StarsRating> = {
  title: 'UI/StarsRating',
  component: StarsRating,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    rating: {
      control: { type: 'number', min: 1, max: 5, step: 1 },
      description: 'Number of stars to display (1..5)',
      table: { defaultValue: { summary: 3 } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StarsRating>;

export const Default: Story = {
  args: {
    rating: 4,
  },
};
