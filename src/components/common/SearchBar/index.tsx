import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputSubmitEditingEvent,
} from 'react-native';

// Icons
import { SearchIcon, MicrophoneIcon } from '@app/icons';

// Styles
import { styles } from './index.style';

// Themes
import { colors, iconSize } from '@app/themes';

interface ISearchBarProps {
  value: string;
  placeholder?: string;
  showMicrophone?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (event: TextInputSubmitEditingEvent) => void;
  onMicrophonePress?: () => void;
}

export const SearchBar = ({
  value,
  placeholder = 'Search for products',
  showMicrophone = true,
  onChangeText,
  onSubmitEditing,
  onMicrophonePress,
}: ISearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <SearchIcon
        width={iconSize.md}
        height={iconSize.md}
        color={colors.grayDark}
      />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={event => onSubmitEditing?.(event)}
        placeholder={placeholder}
        placeholderTextColor={colors.grayDark}
        returnKeyType="search"
        accessibilityLabel="Search input"
      />
      {showMicrophone && (
        <TouchableOpacity
          onPress={onMicrophonePress}
          accessibilityRole="button"
          accessibilityLabel="Voice search">
          <MicrophoneIcon
            width={iconSize.md}
            height={iconSize.md}
            color={colors.grayDark}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
