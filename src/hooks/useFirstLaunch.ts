import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('HAS_SEEN_ONBOARDING');

        setIsFirstLaunch(value === null);
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };

    checkOnboarding();
  }, []);

  return isFirstLaunch;
};
