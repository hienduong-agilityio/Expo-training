import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text } from 'react-native';

// Components
import { GridProductList } from '@app/components/ui/ProductList';
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { FilterButtons } from '@app/components/ui/FilterButton';
import { FilterModal } from '@app/components/ui/FilterModal';
import { SearchBar } from '@app/components/common/SearchBar';

// Hooks
import {
  useProductsByCategory,
  useSearchProducts,
} from '@app/hooks/useProduct';
import { useFilterModal } from '@app/hooks/useFilterModal';
import { useDebounce } from '@app/hooks/useDebounce';

// Store
import { searchStore } from '@app/stores/searchStore';

// Types
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { PrivateTabParamList } from '@app/interfaces/navigation';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PrivateStackParamList } from '@app/interfaces/navigation';

// Constants
import { PRIVATE_SCREENS, CATEGORIES } from '@app/constants';

// Styles
import { styles } from './index.style';

type NavigationProp = CompositeNavigationProp<
  BottomTabScreenProps<
    PrivateTabParamList,
    typeof PRIVATE_SCREENS.SEARCH
  >['navigation'],
  NativeStackNavigationProp<PrivateStackParamList>
>;

export const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { categoryId, categoryName, searchQuery, setCategory, clearAll } =
    searchStore();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearAll();
        setLocalSearchQuery('');
      };
    }, [clearAll]),
  );

  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);
  const activeSearchQuery = useMemo(
    () => debouncedSearchQuery?.trim() || null,
    [debouncedSearchQuery],
  );

  const hasSearchQuery = Boolean(activeSearchQuery);
  const categorySlug = categoryId?.trim();

  const searchResult = useSearchProducts(
    activeSearchQuery,
    categorySlug || undefined,
  );
  const categoryResult = useProductsByCategory(
    hasSearchQuery ? undefined : categorySlug,
  );

  const activeResult = hasSearchQuery ? searchResult : categoryResult;
  const { products, isLoading, isFetching, error, refetch } = activeResult;

  const handleApplyFilter = useCallback(
    (selectedCategoryId: string | null, selectedCategoryName: string) => {
      if (selectedCategoryId) {
        setCategory(selectedCategoryId, selectedCategoryName);
      } else {
        setCategory(null, null);
      }
    },
    [setCategory],
  );

  const {
    isVisible,
    selectedCategoryId,
    openModal,
    closeModal,
    selectCategory,
    applyFilter,
  } = useFilterModal({
    initialCategoryId: categoryId,
    categories: CATEGORIES,
    onApply: handleApplyFilter,
  });

  const handleSearchChange = useCallback((text: string) => {
    setLocalSearchQuery(text);
  }, []);

  const handleItemPress = useCallback(
    (id: string) => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        (
          parentNavigation as NativeStackNavigationProp<PrivateStackParamList>
        ).navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId: id });
      }
    },
    [navigation],
  );

  const loading = isLoading || isFetching;
  const displaySearchQuery = localSearchQuery?.trim();
  const searchTitle = displaySearchQuery
    ? `Search: "${displaySearchQuery}"`
    : categoryName || 'All Featured';
  const showError = error && !products.length && !loading;

  if (showError) {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={localSearchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search for products"
          />
        </View>
        <NotFound
          title="Something went wrong"
          description="Please try again later"
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={localSearchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search for products"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <LoadingState
            message="Loading products..."
            containerStyle={styles.center}
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{searchTitle}</Text>
              <Text style={styles.count}>
                {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'}
              </Text>
            </View>
            <FilterButtons onFilterPress={openModal} />
          </View>

          <FilterModal
            visible={isVisible}
            categories={CATEGORIES}
            selectedCategory={selectedCategoryId}
            onClose={closeModal}
            onCategorySelect={selectCategory}
            onApply={applyFilter}
          />

          <View style={styles.content}>
            {products.length === 0 && !loading ? (
              <NotFound
                title="No products found"
                description={
                  displaySearchQuery
                    ? `No products match "${displaySearchQuery}"`
                    : 'Try adjusting your filters'
                }
              />
            ) : (
              <GridProductList
                products={products}
                onItemPress={handleItemPress}
                numColumns={2}
                contentPadding={12}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};
