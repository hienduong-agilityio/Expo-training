import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';

// Components
import { PaginationDots } from '@app/components/ui/PaginationDots';

const meta: Meta<typeof PaginationDots> = {
  title: 'UI/PaginationDots',
  component: PaginationDots,
  args: {
    currentIndex: 0,
    totalCount: 5,
  },
  parameters: {
    notes: 'Pagination dots component for indicating current page position.',
  },
  argTypes: {
    currentIndex: {
      description: 'Current active dot index (0-based)',
      control: { type: 'number', min: 0, max: 10 },
    },
    totalCount: {
      description: 'Total number of dots to display',
      control: { type: 'number', min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaginationDots>;

export const Default: Story = {};

export const DifferentStates: Story = {
  render: () => (
    <View style={styles.container}>
      <PaginationDots currentIndex={0} totalCount={3} />
      <PaginationDots currentIndex={1} totalCount={3} />
      <PaginationDots currentIndex={2} totalCount={3} />
      <PaginationDots currentIndex={2} totalCount={7} />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
});
