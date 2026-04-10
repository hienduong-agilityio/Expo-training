import { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

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
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          contentFit="cover"
          priority="normal"
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
};
