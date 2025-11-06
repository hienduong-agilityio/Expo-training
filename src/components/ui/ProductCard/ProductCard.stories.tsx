import type { Meta, StoryObj } from '@storybook/react';

// Components
import { View, StyleSheet, ScrollView } from 'react-native';
import { ProductCard } from '@app/components/ui/ProductCard';

// Mocks
import { MOCK_PRODUCTS, getMockProduct } from '@app/mocks/products';

// Themes
import { colors } from '@app/themes';

const meta: Meta<typeof ProductCard> = {
  title: 'UI/ProductCard',
  component: ProductCard,
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.surfaceMuted },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: { width: '47%' },
  scrollContainer: { paddingHorizontal: 20 },
});

export const Default: Story = {
  args: getMockProduct('1')!,

  render: args => (
    <View style={styles.container}>
      <ProductCard {...args} />
    </View>
  ),
};

export const WithImageError: Story = {
  args: getMockProduct('9')!,

  render: args => (
    <View style={styles.container}>
      <ProductCard {...args} />
    </View>
  ),
};

export const ProductGrid: Story = {
  render: () => {
    const products = MOCK_PRODUCTS.slice(0, 4);

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {products.map(product => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard
                {...product}
                onPress={_id => {
                  // Product pressed
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  },
};
