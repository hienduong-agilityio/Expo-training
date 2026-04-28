import { create } from 'zustand';
import type { Href } from 'expo-router';

type DeferredNavigationState = {
  deferredRoute: Href | null;
  isPostLoginNavigationClaimed: boolean;
  enqueueDeferredRoute: (route: Href | null) => void;
  takeDeferredRoute: () => Href | null;
  claimPostLoginNavigation: () => boolean;
  resetDeferredNavigation: () => void;
};

export const deferredNavigationStore = create<DeferredNavigationState>(
  (set, get) => ({
    deferredRoute: null,
    isPostLoginNavigationClaimed: false,

    enqueueDeferredRoute: route => set({ deferredRoute: route }),

    takeDeferredRoute: () => {
      const route = get().deferredRoute;
      set({ deferredRoute: null });
      return route;
    },

    claimPostLoginNavigation: () => {
      if (get().isPostLoginNavigationClaimed) {
        return false;
      }
      set({ isPostLoginNavigationClaimed: true });
      return true;
    },

    resetDeferredNavigation: () =>
      set({ deferredRoute: null, isPostLoginNavigationClaimed: false }),
  }),
);
