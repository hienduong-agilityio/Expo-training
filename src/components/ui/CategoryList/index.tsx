import { View, ScrollView } from 'react-native';
import type { ViewStyle } from 'react-native';

// Types
import type { ICategory } from '@app/interfaces';

// Components
import { CategoryItem } from '@app/components/ui/CategoryItem';

interface ICategoryListProps {
  style?: ViewStyle;
  categories: readonly ICategory[] | ICategory[];
  onCategoryPress: (categoryId: string) => void;
}

export const CategoryList = ({
  style,
  categories,
  onCategoryPress,
}: ICategoryListProps) => {
  return (
    <View style={style}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            onPress={onCategoryPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};
