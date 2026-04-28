import { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

// Constants
import { SEARCH_MESSAGES, SEARCH_SCREEN_MESSAGES } from '@app/constants';

// Mocks
import { CATEGORIES } from '@app/mocks/categories';

// Styles
import { styles } from './index.style';

const paramStr = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export const SearchScreen = () => {
  const router = useRouter();
  const raw = useLocalSearchParams<{
    searchQuery?: string | string[];
    categoryId?: string | string[];
    categoryName?: string | string[];
  }>();
  const searchQuery = paramStr(raw.searchQuery);
  const categoryId = paramStr(raw.categoryId);
  const categoryName = paramStr(raw.categoryName);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [activeCategoryId, setActiveCategoryId] = useState(categoryId || null);
  const [activeCategoryName, setActiveCategoryName] = useState(
    categoryName || null,
  );

  const prevParamsRef = useRef({ searchQuery, categoryId, categoryName });

  useEffect(() => {
    const prev = prevParamsRef.current;

    if (
      prev.searchQuery !== searchQuery ||
      prev.categoryId !== categoryId ||
      prev.categoryName !== categoryName
    ) {
      setLocalSearchQuery(searchQuery || '');
      setActiveCategoryId(categoryId || null);
      setActiveCategoryName(categoryName || null);

      prevParamsRef.current = { searchQuery, categoryId, categoryName };
    }
  }, [searchQuery, categoryId, categoryName]);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);
  const activeSearchQuery = debouncedSearchQuery?.trim() || null;

  const hasSearchQuery = Boolean(activeSearchQuery);
  const categorySlug = activeCategoryId?.trim();

  const searchResult = useSearchProducts(
    activeSearchQuery,
    categorySlug || undefined,
  );
  const categoryResult = useProductsByCategory(categorySlug, !hasSearchQuery);

  const activeResult = hasSearchQuery ? searchResult : categoryResult;

  const {
    products,
    isLoading,
    isFetching,
    error,
    refetch,
    isPending,
    isRefetching,
  } = activeResult;

  const handleRefresh = () => {
    refetch();
  };

  // Only show full loading state on first load or when manually searching/filtering
  // This prevents the "blank screen" effect during background refetches
  const showFullLoading =
    (isLoading || isPending) && !products.length && !isRefetching;

  const loading = isLoading || isFetching;
  const displaySearchQuery = localSearchQuery?.trim();

  const handleApplyFilter = (
    selectedCategoryId: string | null,
    selectedCategoryName: string,
  ) => {
    setActiveCategoryId(selectedCategoryId);
    setActiveCategoryName(selectedCategoryName);
  };

  const {
    isVisible,
    selectedCategoryId,
    openModal,
    closeModal,
    selectCategory,
    applyFilter,
  } = useFilterModal({
    initialCategoryId: activeCategoryId,
    categories: CATEGORIES,
    onApply: handleApplyFilter,
  });

  const handleSearchChange = (text: string) => {
    setLocalSearchQuery(text);
  };

  const handleItemPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const searchTitle = displaySearchQuery
    ? `${SEARCH_SCREEN_MESSAGES.SEARCH_PREFIX}"${displaySearchQuery}"`
    : activeCategoryName || SEARCH_SCREEN_MESSAGES.DEFAULT_TITLE;
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

      {showFullLoading ? (
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
                refreshing={isLoading || isFetching}
                onRefresh={handleRefresh}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};
