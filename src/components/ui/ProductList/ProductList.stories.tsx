/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useState } from 'react';

// Components
import { View, ActivityIndicator } from 'react-native';
import { ProductList } from '@app/components/ui/ProductList';

// Types
import type { IProductCardProps } from '@app/interfaces';
import type { Meta, StoryObj } from '@storybook/react';
import type { IProductListProps } from '@app/components/ui/ProductList';

// Styles
import { styles } from './index.style';

const meta: Meta<IProductListProps> = {
  title: 'UI/ProductList',
  component: ProductList,
};

export default meta;

const makeProduct = (index: number): IProductCardProps => ({
  id: String(index),
  name: `Product ${index}`,
  price: Math.round(Math.random() * 100),
  imageSource: { uri: `https://via.placeholder.com/200?text=Product${index}` },
});

const makeData = (numberOfProducts: number, start = 0) =>
  Array.from({ length: numberOfProducts }, (_, index) =>
    makeProduct(start + index),
  );

export const Default: StoryObj<IProductListProps> = { args: { products: [] } };

export const HorizontalBasic: StoryObj<IProductListProps> = {
  args: {
    products: makeData(14),
    horizontal: true,
    itemWidth: 160,
    gap: 12,
    decelerationRate: 'fast',
    disableIntervalMomentum: true,
    snapToAlignment: 'start',
    snapToInterval: 172,
  },
};

export const VerticalGrid2: StoryObj<IProductListProps> = {
  args: {
    products: makeData(24),
    horizontal: false,
    numColumns: 2,
    itemContainerStyle: { flex: 1 },
    columnWrapperStyle: { columnGap: 12 },
    gap: 12,
  },
};

export const Infinite: StoryObj<IProductListProps> = {
  args: {
    products: makeData(100),
    horizontal: false,
    numColumns: 2,
    itemContainerStyle: { flex: 1 },
    columnWrapperStyle: { columnGap: 12 },
    gap: 12,
    onEndReachedThreshold: 0.4,
  },

  render: args => {
    const [items, setItems] = useState<IProductCardProps[]>(
      (args as IProductListProps).products ?? [],
    );
    const [loading, setLoading] = useState(false);

    const loadMore = useCallback(() => {
      if (loading) return;

      setLoading(true);
      setTimeout(() => {
        setItems(prev => prev.concat(makeData(20, prev.length)));
        setLoading(false);
      }, 700);
    }, [loading]);

    return (
      <View style={styles.container}>
        <ProductList
          {...args}
          products={items}
          onEndReached={loadMore}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      </View>
    );
  },
};
