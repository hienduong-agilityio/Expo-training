import { useCallback } from 'react';
import {
  View,
  type ListRenderItemInfo,
  type FlatListProps,
  FlatList,
} from 'react-native';

import { ProductCard } from '@app/components/ui/ProductCard';
import type { IProductCardProps } from '@app/interfaces';
import { styles } from './index.style';
import type { ICustomStyles } from '@app/interfaces/style';

type FlatListModifiedProps = Omit<
  FlatListProps<IProductCardProps>,
  'data' | 'renderItem' | 'keyExtractor'
>;

export interface IProductListProps extends FlatListModifiedProps {
  products: IProductCardProps[];
  gap?: number;
  contentPadding?: number;
  itemWidth?: number;
  snap?: boolean;
  onItemPress?: (id: string) => void;
  keyExtractor?: (item: IProductCardProps, index: number) => string;
  customStyle?: ICustomStyles;
}

export const ProductList = ({
  products = [],
  horizontal = false,
  numColumns = 2,
  gap = 12,
  contentPadding = 12,
  itemWidth = 160,
  snap = false,
  onItemPress = () => {},
  keyExtractor = (item: IProductCardProps, index: number) =>
    item.id ?? String(item.name ?? index),
  contentContainerStyle = {},
  customStyle,
  ...rest
}: IProductListProps) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IProductCardProps>) => (
      <View
        style={[
          styles.itemContainer,
          customStyle?.itemContainer,
          horizontal && itemWidth ? { width: itemWidth } : null,
        ]}>
        <ProductCard
          {...item}
          onPress={onItemPress}
          style={styles.productCard}
        />
      </View>
    ),
    [horizontal, itemWidth, onItemPress, customStyle?.itemContainer],
  );

  const DefaultSeparator = useCallback(
    () => <View style={horizontal ? { width: gap } : { height: gap }} />,
    [horizontal, gap],
  );

  const getItemLayout =
    horizontal && itemWidth
      ? (_: unknown, index: number) => ({
          length: itemWidth,
          offset: index * (itemWidth + gap),
          index,
        })
      : undefined;

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal={horizontal}
      numColumns={horizontal ? 1 : numColumns}
      ItemSeparatorComponent={DefaultSeparator}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        {
          paddingHorizontal: contentPadding,
          paddingVertical: contentPadding,
        },
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={horizontal ? 10 : 12}
      windowSize={5}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={50}
      onEndReachedThreshold={0.4}
      accessibilityRole="list"
      accessibilityLabel="Product list"
      {...(horizontal && snap && itemWidth
        ? {
            decelerationRate: 'fast' as const,
            disableIntervalMomentum: true,
            snapToAlignment: 'start' as const,
            snapToInterval: itemWidth + gap,
          }
        : null)}
      {...rest}
    />
  );
};
