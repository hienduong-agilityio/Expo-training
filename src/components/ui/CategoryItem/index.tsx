import { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

// Styles
import { styles } from './index.style';

// Types
import type { ICategory } from '@app/interfaces';

export const CategoryItem = ({
  category,
  onPress,
}: {
  category: ICategory;
  onPress: (id: string) => void;
}) => {
  const handlePress = useCallback(() => {
    onPress(category.id);
  }, [onPress, category.id]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: category.image, priority: FastImage.priority.normal }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
};
