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
  CATEGORIES,
  PROMO_BANNER,
  SUMMER_SALE_BANNER,
  SPONSORED_BANNER,
  SPECIAL_OFFERS_BANNER,
  DEAL_INFO,
  PRODUCT_LIST_TYPES,
  PRODUCT_LIST_TITLES,
  PRIVATE_SCREENS,
  MESSAGES,
} from '@app/constants';

// Types
import type {
  PrivateStackParamList,
  PrivateTabParamList,
} from '@app/interfaces/navigation';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Hooks
import { useCategorizedProducts } from '@app/hooks/useProduct';

// Styles
import { styles } from './index.style';

// Stores
import { searchStore } from '@app/stores/searchStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<PrivateTabParamList, typeof PRIVATE_SCREENS.HOME>,
  NativeStackScreenProps<PrivateStackParamList>
>;

export const HomeScreen = ({ navigation }: Props) => {
  const {
    data: categorizedData,
    isLoading,
    isFetching,
    error,
  } = useCategorizedProducts();
  const { setCategory, setSearchQuery } = searchStore();
  const [searchValue, setSearchValue] = useState('');

  const products = {
    deals: categorizedData?.deals ?? [],
    trending: categorizedData?.trending ?? [],
    newArrivals: categorizedData?.newArrivals ?? [],
  };

  const loading = isLoading || isFetching;

  const navigateToProductList = useCallback(
    (type: keyof typeof PRODUCT_LIST_TYPES) => {
      const listType = PRODUCT_LIST_TYPES[type];

      navigation.getParent()?.navigate(PRIVATE_SCREENS.PRODUCT_LIST, {
        type: listType,
        title: PRODUCT_LIST_TITLES[listType],
      });
    },
    [navigation],
  );

  const handleProductPress = useCallback(
    (id: string) => {
      navigation
        .getParent()
        ?.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId: id });
    },
    [navigation],
  );

  const handleViewAllNewArrivals = useCallback(() => {
    navigateToProductList('NEW_ARRIVALS');
  }, [navigateToProductList]);

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      setCategory(categoryId, categoryName);

      const tabNavigation =
        navigation as BottomTabScreenProps<PrivateTabParamList>['navigation'];
      tabNavigation.navigate(PRIVATE_SCREENS.SEARCH);
    },
    [navigation, setCategory],
  );

  const handleSearchSubmit = useCallback(() => {
    const trimmedQuery = searchValue?.trim();

    if (trimmedQuery) {
      setCategory(null, null);
      setSearchQuery(trimmedQuery);

      const tabNavigation =
        navigation as BottomTabScreenProps<PrivateTabParamList>['navigation'];
      tabNavigation.navigate(PRIVATE_SCREENS.SEARCH);
    }
  }, [searchValue, navigation, setCategory, setSearchQuery]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search for products"
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
          onPressViewAll={() => navigateToProductList('DEAL_OF_DAY')}
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
          onPressViewAll={() => navigateToProductList('TRENDING')}
        />

        <SummerSaleBanner
          banner={SUMMER_SALE_BANNER}
          newArrivalsTitle={DEAL_INFO.newArrivals.title}
          newArrivalsSubtitle={DEAL_INFO.newArrivals.subtitle}
          onPressViewAll={handleViewAllNewArrivals}
          actionLabel={MESSAGES.VIEW_ALL}
        />

        <SponsoredBanner banner={SPONSORED_BANNER} />
      </ScrollView>
    </View>
  );
};
