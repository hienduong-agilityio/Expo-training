import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IPersistHelpers {
  hasHydrated: () => boolean;
  onHydrate: (callback: () => void) => () => void;
  onFinishHydration: (callback: () => void) => () => void;
}

export type TPersistedStore = {
  persist: IPersistHelpers;
};

export const useHydration = (store: TPersistedStore) => {
  const [hydrated, setHydrated] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubHydrate = store.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = store.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(store.persist.hasHydrated());

    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('HAS_SEEN_ONBOARDING');
        setIsFirstLaunch(value === null);
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };

    checkOnboarding();

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, [store]);

  return { hydrated, isFirstLaunch };
};
