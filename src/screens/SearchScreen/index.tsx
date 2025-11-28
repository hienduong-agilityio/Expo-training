import { useCallback, useState, useMemo, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import type { PrivateTabScreenProps } from '@app/interfaces/navigation';

// Constants
import {
  PRIVATE_SCREENS,
  SEARCH_MESSAGES,
  SEARCH_SCREEN_MESSAGES,
} from '@app/constants';

// Mocks
import { CATEGORIES } from '@app/mocks/categories';

// Styles
import { styles } from './index.style';

type SearchScreenProps = PrivateTabScreenProps<typeof PRIVATE_SCREENS.SEARCH>;

/**
 * TODO: Use route.params to get the search query and category id.
 * * Replace the useEffect with useEffect hook to get the search query and category id from the route.params.
 * * Remove searchStore and use the route.params instead.
 */
export const SearchScreen = ({ navigation }: SearchScreenProps) => {
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
  const categoryResult = useProductsByCategory(categorySlug, !hasSearchQuery);

  const activeResult = hasSearchQuery ? searchResult : categoryResult;

  // Bug: Crash when has many requests in the same time.
  // TODO: Use reactotron-react-native to debug the issue.
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
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, {
        productId: id,
      });
    },
    [navigation],
  );

  const loading = isLoading || isFetching;
  const displaySearchQuery = localSearchQuery?.trim();
  const searchTitle = displaySearchQuery
    ? `${SEARCH_SCREEN_MESSAGES.SEARCH_PREFIX}"${displaySearchQuery}"`
    : categoryName || SEARCH_SCREEN_MESSAGES.DEFAULT_TITLE;
  const showError = error && !products.length && !loading;

  if (showError) {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={localSearchQuery}
            onChangeText={handleSearchChange}
            placeholder={SEARCH_MESSAGES.PLACEHOLDER}
          />
        </View>
        <NotFound
          title={SEARCH_SCREEN_MESSAGES.ERROR_TITLE}
          description={SEARCH_SCREEN_MESSAGES.ERROR_DESCRIPTION}
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
          placeholder={SEARCH_MESSAGES.PLACEHOLDER}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <LoadingState
            message={SEARCH_SCREEN_MESSAGES.LOADING}
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
                {products.length === 1
                  ? SEARCH_SCREEN_MESSAGES.PRODUCT_SINGULAR
                  : SEARCH_SCREEN_MESSAGES.PRODUCT_PLURAL}
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
                title={SEARCH_SCREEN_MESSAGES.NOT_FOUND_TITLE}
                description={
                  displaySearchQuery
                    ? `${SEARCH_SCREEN_MESSAGES.NOT_FOUND_DESC_PREFIX} "${displaySearchQuery}"`
                    : SEARCH_SCREEN_MESSAGES.NOT_FOUND_DESC_DEFAULT
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
