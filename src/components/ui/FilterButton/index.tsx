import { View, TouchableOpacity, Text } from 'react-native';

// Icons
import { SortIcon, FilterIcon } from '@app/icons';

// Constants
import { UI_BUTTON_LABELS } from '@app/constants';

// Styles
import { styles } from './index.style';

interface IFilterButtonsProps {
  showSort?: boolean;
  showFilter?: boolean;
  onSortPress?: () => void;
  onFilterPress?: () => void;
}

export const FilterButtons = ({
  showSort = true,
  showFilter = true,
  onSortPress,
  onFilterPress,
}: IFilterButtonsProps) => {
  return (
    <View style={styles.filterButtons}>
      {showFilter && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Filter results">
          <FilterIcon width={16} height={16} color="#666" />
          <Text style={styles.filterButtonText}>{UI_BUTTON_LABELS.FILTER}</Text>
        </TouchableOpacity>
      )}

      {showSort && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onSortPress}
          accessibilityRole="button"
          accessibilityLabel="Sort results">
          <Text style={styles.filterButtonText}>{UI_BUTTON_LABELS.SORT}</Text>
          <SortIcon width={16} height={16} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};
