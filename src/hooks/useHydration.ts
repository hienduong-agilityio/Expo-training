import { useEffect, useState } from 'react';

interface IPersistHelpers {
  hasHydrated: () => boolean;
  onHydrate: (callback: () => void) => () => void;
  onFinishHydration: (callback: () => void) => () => void;
}

export type TPersistedStore = {
  persist: IPersistHelpers;
};

export const useHydration = (store: TPersistedStore): boolean => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = store.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = store.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(store.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, [store]);

  return hydrated;
};
