import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Components
import { ProductCard } from '@app/components/ui/ProductCard';

// Icons
import { EyeOpenIcon, LayersIcon, SortIcon, FilterIcon } from '@app/icons';

// Types
import type { IProduct } from '@app/interfaces';

// Themes
import { colors } from '@app/themes';

// Styles
import { styles } from './index.style';

interface ISimilarProductsProps {
  products: IProduct[];
  onViewSimilar: () => void;
  onAddToCompare: () => void;
  onProductPress: (productId: string) => void;
}

export const SimilarProducts = ({
  products,
  onViewSimilar,
  onAddToCompare,
  onProductPress,
}: ISimilarProductsProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.actionButton} onPress={onViewSimilar}>
            <EyeOpenIcon width={16} height={16} color={colors.text} />
            <Text style={styles.actionButtonText}>View Similar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddToCompare}>
            <LayersIcon width={16} height={16} color={colors.text} />
            <Text style={styles.actionButtonText}>Add to Compare</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Similar To</Text>
        <Text style={styles.itemCount}>{products.length}+ Items</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <SortIcon width={14} height={14} color={colors.text} />
          <Text style={styles.filterButtonText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <FilterIcon width={14} height={14} color={colors.text} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Products ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsScrollView}
        contentContainerStyle={styles.productsContainer}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            {...product}
            onPress={() => onProductPress(product.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
