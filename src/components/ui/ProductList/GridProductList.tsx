import { ActivityIndicator } from 'react-native';
import { useCallback, useMemo } from 'react';
import {
  View,
  type ListRenderItemInfo,
  type FlatListProps,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';

// Components
import { ProductCard } from '@app/components/ui';

// Styles
import { styles } from './index.style';

// Types
import type { IProductCardProps } from '@app/interfaces';
import type { ICustomStyles } from '@app/interfaces/style';

type FlatListModifiedProps = Omit<
  FlatListProps<IProductCardProps>,
  'data' | 'renderItem' | 'keyExtractor' | 'numColumns' | 'horizontal'
>;

export interface IGridProductListProps extends FlatListModifiedProps {
  products: IProductCardProps[];
  numColumns?: number;
  gap?: number;
  contentPadding?: number;
  onItemPress?: (id: string) => void;
  onWishlistToggle?: (id: string) => void;
  keyExtractor?: (item: IProductCardProps, index: number) => string;
  customStyle?: ICustomStyles;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export const GridProductList = ({
  products = [],
  numColumns = 2,
  gap = 12,
  contentPadding = 12,
  onItemPress = () => {},
  onWishlistToggle,
  keyExtractor = (item: IProductCardProps, index: number) =>
    item.id ?? String(item.name ?? index),
  contentContainerStyle = {},
  customStyle,
  onEndReached,
  isLoadingMore = false,
  hasMore = true,
  ...rest
}: IGridProductListProps) => {
  const screenWidth = Dimensions.get('window').width;
  const totalPadding = contentPadding * 2;
  const totalGap = gap * (numColumns - 1);
  const itemWidth = (screenWidth - totalPadding - totalGap) / numColumns;

  const itemContainerStyle = useMemo(
    () => ({
      width: itemWidth,
      marginRight: gap,
      marginBottom: gap,
    }),
    [itemWidth, gap],
  );

  const columnWrapperStyle = {
    marginRight: -gap,
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<IProductCardProps>) => (
      <View
        style={[
          styles.itemContainer,
          customStyle?.itemContainer,
          itemContainerStyle,
        ]}>
        <ProductCard
          {...item}
          onPress={onItemPress}
          onWishlistToggle={onWishlistToggle}
          style={StyleSheet.flatten([
            styles.productCard,
            styles.productCardGrid,
          ])}
        />
      </View>
    ),
    [
      itemContainerStyle,
      onItemPress,
      onWishlistToggle,
      customStyle?.itemContainer,
    ],
  );

  // Keep useCallback for FlatList component props
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isLoadingMore]);

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
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={[
        {
          paddingHorizontal: contentPadding,
          paddingVertical: contentPadding,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={12}
      windowSize={5}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={50}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListFooterComponent={renderFooter}
      accessibilityRole="list"
      accessibilityLabel="Grid product list"
      {...rest}
    />
  );
};
