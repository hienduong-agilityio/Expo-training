import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';

// Components
import { GlobalHeader } from '@app/components/GlobalHeader';

export const BottomTabHeader = (_props: BottomTabHeaderProps) => {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/settings');
  };

  return (
    <GlobalHeader
      showMenu={true}
      showProfile={true}
      onProfilePress={handleProfilePress}
    />
  );
};
