import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Components
import { FilterModal } from './index';
import { Button } from '@app/components/common/Button';

// Constants
import { CATEGORIES } from '@app/constants';

const meta: Meta<typeof FilterModal> = {
  title: 'UI/FilterModal',
  component: FilterModal,
  parameters: {
    notes: 'Bottom sheet style modal to filter products by category.',
  },
  argTypes: {
    onClose: { action: 'closed', description: 'Modal closed' },
    onCategorySelect: {
      action: 'category-selected',
      description: 'Category selected (id or null for all)'.trim(),
    },
  },
  decorators: [
    Story => (
      <SafeAreaProvider>
        <View style={styles.screen}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FilterModal>;

type PlaygroundProps = {
  onClose?: () => void;
  onCategorySelect?: (categoryId: string | null) => void;
};

const FilterModalPlayground: React.FC<PlaygroundProps> = ({
  onClose,
  onCategorySelect,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  return (
    <>
      <Button label="Open Filter" onPress={() => setVisible(true)} />
      <FilterModal
        visible={visible}
        categories={[...CATEGORIES]}
        selectedCategory={selectedCategory}
        onClose={() => {
          setVisible(false);
          onClose?.();
        }}
        onCategorySelect={categoryId => {
          setSelectedCategory(categoryId);
          onCategorySelect?.(categoryId);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: args => <FilterModalPlayground {...args} />,
};

const styles = StyleSheet.create({
  screen: { padding: 16 },
});
