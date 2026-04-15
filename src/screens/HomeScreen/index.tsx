import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Components
import { ProductSection } from '@app/components/ui/ProductSection';
import { ImageBanner } from '@app/components/ui/ImageBanner';
import { SpecialOffersBanner } from '@app/components/ui/SpecialOffersBanner';
import { SummerSaleBanner } from '@app/components/ui/SummerSaleBanner';
import { SponsoredBanner } from '@app/components/ui/SponsoredBanner';
import { CategoriesSection } from '@app/components/ui/CategoriesSection';
import { SearchBar } from '@app/components/common/SearchBar';

// Icons
import { ClockIcon, CalendarIcon } from '@app/icons';

// Constants
import {
  PRODUCT_LIST_TYPES,
  MESSAGES,
  SEARCH_MESSAGES,
} from '@app/constants';

import type { ProductListType } from '@app/constants';

// Mocks
import { CATEGORIES } from '@app/mocks/categories';
import {
  PROMO_BANNER,
  SUMMER_SALE_BANNER,
  SPONSORED_BANNER,
  SPECIAL_OFFERS_BANNER,
} from '@app/mocks/banners';
import { DEAL_INFO } from '@app/mocks/home';

// Hooks
import { useCategorizedProducts } from '@app/hooks/useProduct';
import { useWishlistActions } from '@app/hooks/useWishlist';

// Styles
import { styles } from './index.style';

export const HomeScreen = () => {
  const router = useRouter();
  const { addItem, removeItem } = useWishlistActions();
  const {
    data: categorizedData,
    isLoading,
    isFetching,
    error,
  } = useCategorizedProducts();

  const [searchValue, setSearchValue] = useState('');

  const products = {
    deals: categorizedData?.deals ?? [],
    trending: categorizedData?.trending ?? [],
    newArrivals: categorizedData?.newArrivals ?? [],
  };

  const loading = isLoading || isFetching;

  const navigateToProductList = (listType: ProductListType) => {
    router.push(`/products/${listType}`);
  };

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleViewAllNewArrivals = () => {
    navigateToProductList(PRODUCT_LIST_TYPES.NEW_ARRIVALS);
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: '/search',
      params: { categoryId, categoryName },
    });
  };

  const handleSearchSubmit = () => {
    const trimmedQuery = searchValue?.trim();

    if (trimmedQuery) {
      router.push({
        pathname: '/search',
        params: { searchQuery: trimmedQuery },
      });
      setSearchValue('');
    }
  };

  const handleWishlistToggle = async (
    productId: string,
    isWishlisted: boolean,
  ) => {
    if (isWishlisted) {
      await removeItem(productId);
    } else {
      await addItem(productId);
    }
  };

  const handleViewAllDeals = () => {
    navigateToProductList(PRODUCT_LIST_TYPES.DEAL_OF_DAY);
  };

  const handleViewAllTrending = () => {
    navigateToProductList(PRODUCT_LIST_TYPES.TRENDING);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearchSubmit}
            placeholder={SEARCH_MESSAGES.PLACEHOLDER}
          />
        </View>

        <CategoriesSection
          categories={CATEGORIES}
          onCategoryPress={handleCategoryPress}
        />

        <ImageBanner banner={PROMO_BANNER} />

        <ProductSection
          title={DEAL_INFO.dealOfDay.title}
          products={products.deals}
          loading={loading}
          error={error}
          onItemPress={handleProductPress}
          onWishlistToggle={handleWishlistToggle}
          headerStyle="deal"
          actionLabel={MESSAGES.VIEW_ALL}
          Icon={ClockIcon}
          label={DEAL_INFO.dealOfDay.countdown?.text}
          onPressViewAll={handleViewAllDeals}
        />

        <SpecialOffersBanner banner={SPECIAL_OFFERS_BANNER} />

        <ProductSection
          title={DEAL_INFO.trending.title}
          products={products.trending}
          loading={loading}
          error={error}
          onItemPress={handleProductPress}
          onWishlistToggle={handleWishlistToggle}
          headerStyle="trending"
          actionLabel={MESSAGES.VIEW_ALL}
          Icon={CalendarIcon}
          label={DEAL_INFO.trending.countdown?.text}
          onPressViewAll={handleViewAllTrending}
        />

        <SummerSaleBanner
          banner={SUMMER_SALE_BANNER}
          newArrivalsTitle={DEAL_INFO.newArrivals.title}
          newArrivalsSubtitle={DEAL_INFO.newArrivals.subtitle ?? ''}
          onPressViewAll={handleViewAllNewArrivals}
          actionLabel={MESSAGES.VIEW_ALL}
        />

        <SponsoredBanner banner={SPONSORED_BANNER} />
      </ScrollView>
    </View>
  );
};
