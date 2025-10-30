import { View, TouchableOpacity, StatusBar } from 'react-native';
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
}

export const GlobalHeader = ({
  showMenu = true,
  showProfile = true,
  onMenuPress,
  onProfilePress,
}: IGlobalHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerStyles, { paddingTop: insets.top }]}>
      <StatusBar translucent={false} barStyle="dark-content" />

      <View style={styles.headerTop}>
        {showMenu ? (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <MenuIcon color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={styles.menuButton} />
        )}

        <View style={styles.logo}>
          <StylishLogo size={30} color={colors.secondary} />
        </View>

        {showProfile ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}>
            <ProfileIcon color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={styles.profileButton} />
        )}
      </View>
    </View>
  );
};
