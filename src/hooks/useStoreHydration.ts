import { useSyncExternalStore } from 'react';

interface IPersistHelpers {
  hasHydrated: () => boolean;
  onHydrate: (callback: () => void) => () => void;
  onFinishHydration: (callback: () => void) => () => void;
}

export type TPersistedStore = {
  persist: IPersistHelpers;
};

export const useStoreHydration = (store: TPersistedStore) => {
  return useSyncExternalStore(
    callback => {
      const unsubHydrate = store.persist.onHydrate(callback);
      const unsubFinish = store.persist.onFinishHydration(callback);

      return () => {
        unsubHydrate();
        unsubFinish();
      };
    },
    () => store.persist.hasHydrated(),
  );
};
