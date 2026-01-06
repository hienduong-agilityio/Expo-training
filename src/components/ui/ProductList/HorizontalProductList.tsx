import { useCallback } from 'react';
import {
  View,
  type ListRenderItemInfo,
  type FlatListProps,
  FlatList,
} from 'react-native';

// Components
import { ProductCard } from '@app/components/ui';
import { ActivityIndicator } from 'react-native';

// Types
import type { IProductCardProps } from '@app/interfaces';
import type { ICustomStyles } from '@app/interfaces/style';

// Styles
import { styles } from './index.style';

type FlatListModifiedProps = Omit<
  FlatListProps<IProductCardProps>,
  'data' | 'renderItem' | 'keyExtractor' | 'horizontal'
>;

export interface IHorizontalProductListProps extends FlatListModifiedProps {
  products: IProductCardProps[];
  itemWidth?: number;
  gap?: number;
  contentPadding?: number;
  snap?: boolean;
  onItemPress?: (id: string) => void;
  keyExtractor?: (item: IProductCardProps, index: number) => string;
  customStyle?: ICustomStyles;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export const HorizontalProductList = ({
  products = [],
  itemWidth = 160,
  gap = 12,
  contentPadding = 0,
  snap = false,
  onItemPress = () => {},
  keyExtractor = (item: IProductCardProps, index: number) =>
    item.id ?? String(item.name ?? index),
  contentContainerStyle = {},
  customStyle,
  onEndReached,
  isLoadingMore = false,
  hasMore = true,
  ...rest
}: IHorizontalProductListProps) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IProductCardProps>) => (
      <View
        style={[
          styles.itemContainer,
          customStyle?.itemContainer,
          { width: itemWidth },
        ]}>
        <ProductCard
          {...item}
          onPress={onItemPress}
          style={styles.productCard}
        />
      </View>
    ),
    [itemWidth, onItemPress, customStyle?.itemContainer],
  );

  const Separator = useCallback(() => <View style={{ width: gap }} />, [gap]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: itemWidth,
      offset: index * (itemWidth + gap),
      index,
    }),
    [itemWidth, gap],
  );

  const snapProps = snap
    ? {
        decelerationRate: 'fast' as const,
        disableIntervalMomentum: true,
        snapToAlignment: 'start' as const,
        snapToInterval: itemWidth + gap,
      }
    : {};

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <View style={[styles.footerLoader, { width: itemWidth }]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isLoadingMore, itemWidth]);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore && onEndReached) {
      onEndReached();
    }
  }, [isLoadingMore, hasMore, onEndReached]);

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      ItemSeparatorComponent={Separator}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        {
          paddingHorizontal: contentPadding,
          paddingVertical: contentPadding,
        },
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={10}
      windowSize={5}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={50}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListFooterComponent={renderFooter}
      accessibilityRole="list"
      accessibilityLabel="Horizontal product list"
      {...snapProps}
      {...rest}
    />
  );
};
