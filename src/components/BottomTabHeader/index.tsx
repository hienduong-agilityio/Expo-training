import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

// Components
import { GlobalHeader } from '@app/components/GlobalHeader';

// Constants
import { PRIVATE_SCREENS } from '@app/constants/screens';

export const BottomTabHeader = ({ navigation }: BottomTabHeaderProps) => {
  const handleProfilePress = () => {
    navigation.navigate(PRIVATE_SCREENS.SETTINGS);
  };

  return (
    <GlobalHeader
      showMenu={true}
      showProfile={true}
      onProfilePress={handleProfilePress}
    />
  );
};
