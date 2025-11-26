import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

// Types
import type { ICategory } from '@app/interfaces';

// Styles
import { styles } from './index.style';

interface IFilterModalProps {
  visible: boolean;
  categories: readonly ICategory[] | ICategory[];
  selectedCategory: string | null;
  onClose: () => void;
  onCategorySelect: (categoryId: string | null) => void;
  onApply?: () => void;
}

export const FilterModal = ({
  visible,
  categories,
  selectedCategory,
  onClose,
  onCategorySelect,
  onApply,
}: IFilterModalProps) => {
  const handleClearFilter = () => {
    onCategorySelect(null);
  };

  const handleApplyFilter = () => {
    onApply?.();
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Products</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView style={styles.categoriesContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  !selectedCategory && styles.categoryItemActive,
                ]}
                onPress={handleClearFilter}>
                <Text
                  style={[
                    styles.categoryText,
                    !selectedCategory && styles.categoryTextActive,
                  ]}>
                  All Categories
                </Text>
              </TouchableOpacity>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id &&
                      styles.categoryItemActive,
                  ]}
                  onPress={() => handleCategorySelect(category.id)}>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id &&
                        styles.categoryTextActive,
                    ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilter}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
