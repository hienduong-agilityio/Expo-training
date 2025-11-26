import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

// Styles
import { styles } from './index.style';

// Types
import type { ICategory } from '@app/interfaces';
import type { ViewStyle } from 'react-native';

interface ICategoryListProps {
  style?: ViewStyle;
  categories: readonly ICategory[] | ICategory[];
  onCategoryPress: (categoryId: string) => void;
}

export const CategoryList = ({
  style,
  categories,
  onCategoryPress,
}: ICategoryListProps) => (
  <View style={style}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={styles.container}
          onPress={() => onCategoryPress(category.id)}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: category.image }} style={styles.image} />
          </View>
          <Text style={styles.name}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);
