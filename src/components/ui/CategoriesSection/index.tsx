import { useCallback } from 'react';
import { View, Text } from 'react-native';

// Components
import { FilterButtons } from '@app/components/ui/FilterButton';
import { CategoryList } from '@app/components/ui/CategoryList';
import { FilterModal } from '@app/components/ui/FilterModal';

// Hooks
import { useFilterModal } from '@app/hooks/useFilterModal';

// Types
import type { ICategory } from '@app/interfaces/categories';

// Styles
import { styles } from './index.style';

interface CategoriesSectionProps {
  title?: string;
  categories: readonly ICategory[];
  productCount?: number;
  onCategoryPress: (categoryId: string, categoryName: string) => void;
}

export const CategoriesSection = ({
  title = 'All Featured',
  categories,
  onCategoryPress,
  productCount,
}: CategoriesSectionProps) => {
  const handleApplyFilter = (
    categoryId: string | null,
    categoryName: string,
  ) => {
    onCategoryPress(categoryId ?? '', categoryName);
  };

  const {
    isVisible,
    selectedCategoryId,
    openModal,
    closeModal,
    selectCategory,
    applyFilter,
  } = useFilterModal({
    categories,
    onApply: handleApplyFilter,
  });

  const handleCategoryItemPress = useCallback(
    (categoryId: string) => {
      const category = categories.find(cat => cat.id === categoryId);

      onCategoryPress(categoryId, category?.name || '');
    },
    [categories, onCategoryPress],
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {productCount && <Text style={styles.count}>{productCount}</Text>}
        </View>
        <FilterButtons onFilterPress={openModal} />
      </View>

      <CategoryList
        categories={categories}
        onCategoryPress={handleCategoryItemPress}
        style={styles.categoriesContainer}
      />

      <FilterModal
        visible={isVisible}
        categories={categories}
        selectedCategory={selectedCategoryId}
        onClose={closeModal}
        onCategorySelect={selectCategory}
        onApply={applyFilter}
      />
    </View>
  );
};
