import { View, TouchableOpacity, StatusBar } from 'react-native';
import type { ICustomStyles } from '@app/interfaces/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Icons
import { MenuIcon, ProfileIcon, StylishLogo } from '@app/icons';

// Styles
import { styles } from './index.style';

// Themes
import { colors } from '@app/themes';

export interface IGlobalHeaderProps {
  showMenu?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  customStyle?: ICustomStyles;
}

export const GlobalHeader = ({
  showMenu = true,
  showProfile = true,
  onMenuPress,
  onProfilePress,
  customStyle,
}: IGlobalHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerStyles,
        { paddingTop: insets.top },
        customStyle?.container,
      ]}>
      <StatusBar translucent={false} barStyle="dark-content" />

      <View style={[styles.headerTop, customStyle?.headerTop]}>
        {showMenu ? (
          <TouchableOpacity
            style={[styles.menuButton, customStyle?.menuButton]}
            onPress={onMenuPress}
            accessibilityRole="button"
            accessibilityLabel="Menu">
            <MenuIcon color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.menuButton, customStyle?.menuButton]} />
        )}

        <View style={[styles.logo, customStyle?.logo]}>
          <StylishLogo size={30} color={colors.secondary} />
        </View>

        {showProfile ? (
          <TouchableOpacity
            style={[styles.profileButton, customStyle?.profileButton]}
            onPress={onProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Profile">
            <ProfileIcon color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.profileButton, customStyle?.profileButton]} />
        )}
      </View>
    </View>
  );
};
