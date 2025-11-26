import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

// Components
import { GlobalHeader } from '@app/components/GlobalHeader';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

export const BottomTabHeader = ({ navigation }: BottomTabHeaderProps) => {
  const showMenu = true;
  const showProfile = true;

  const handleMenuPress = () => {
    // TODO: Implement menu functionality
  };

  const handleProfilePress = () => {
    if (!showProfile) return;
    navigation.navigate(PRIVATE_SCREENS.SETTINGS);
  };

  return (
    <GlobalHeader
      showMenu={showMenu}
      showProfile={showProfile}
      onMenuPress={handleMenuPress}
      onProfilePress={handleProfilePress}
    />
  );
};
