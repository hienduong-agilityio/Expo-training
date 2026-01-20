import { useCallback, useState } from 'react';
import { View, ScrollView } from 'react-native';

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
  PRODUCT_LIST_TITLES,
  PRIVATE_SCREENS,
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

// Types
import type { PrivateTabScreenProps } from '@app/interfaces/navigation';

// Hooks
import { useCategorizedProducts } from '@app/hooks/useProduct';

// Styles
import { styles } from './index.style';

type HomeScreenProps = PrivateTabScreenProps<typeof PRIVATE_SCREENS.HOME>;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
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

  const navigateToProductList = useCallback(
    (listType: ProductListType) => {
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_LIST, {
        type: listType,
        title: PRODUCT_LIST_TITLES[listType],
      });
    },
    [navigation],
  );

  const handleProductPress = useCallback(
    (id: string) => {
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, {
        productId: id,
      });
    },
    [navigation],
  );

  const handleViewAllNewArrivals = useCallback(() => {
    navigateToProductList(PRODUCT_LIST_TYPES.NEW_ARRIVALS);
  }, [navigateToProductList]);

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(PRIVATE_SCREENS.SEARCH, {
        categoryId,
        categoryName,
      });
    },
    [navigation],
  );

  const handleSearchSubmit = useCallback(() => {
    const trimmedQuery = searchValue?.trim();

    if (trimmedQuery) {
      navigation.navigate(PRIVATE_SCREENS.SEARCH, {
        searchQuery: trimmedQuery,
      });
      setSearchValue('');
    }
  }, [searchValue, navigation]);

  const handleViewAllDeals = useCallback(() => {
    navigateToProductList(PRODUCT_LIST_TYPES.DEAL_OF_DAY);
  }, [navigateToProductList]);

  const handleViewAllTrending = useCallback(() => {
    navigateToProductList(PRODUCT_LIST_TYPES.TRENDING);
  }, [navigateToProductList]);

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
