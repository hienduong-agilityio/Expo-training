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
import { ProductCard } from '@app/components/ui/ProductCard';

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
  ...rest
}: IGridProductListProps) => {
  const screenWidth = useMemo(() => Dimensions.get('window').width, []);

  const itemWidth = useMemo(() => {
    const totalPadding = contentPadding * 2;
    const totalGap = gap * (numColumns - 1);

    return (screenWidth - totalPadding - totalGap) / numColumns;
  }, [screenWidth, contentPadding, gap, numColumns]);

  const itemContainerStyle = useMemo(
    () => ({
      width: itemWidth,
      marginRight: gap,
      marginBottom: gap,
    }),
    [itemWidth, gap],
  );

  const columnWrapperStyle = useMemo(
    () => ({
      marginRight: -gap,
    }),
    [gap],
  );

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
      onEndReachedThreshold={0.4}
      accessibilityRole="list"
      accessibilityLabel="Grid product list"
      {...rest}
    />
  );
};
