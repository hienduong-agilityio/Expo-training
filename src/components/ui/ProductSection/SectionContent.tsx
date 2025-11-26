import { View, Text, ActivityIndicator } from 'react-native';

// Components
import { HorizontalProductList } from '@app/components/ui/ProductList';

// Types
import type { IContentConfig } from '@app/interfaces/ui';

// Styles
import { styles } from './index.style';

export interface ISectionContentProps extends IContentConfig {}

export const SectionContent = ({
  loading,
  error,
  products,
  onItemPress,
}: ISectionContentProps) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Error: {error.message || 'Failed to load products'}
        </Text>
      </View>
    );
  }

  return (
    <HorizontalProductList
      products={products}
      onItemPress={onItemPress}
      itemWidth={160}
      gap={12}
      contentPadding={0}
    />
  );
};
