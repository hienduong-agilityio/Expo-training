import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
import type { AuthUser, AuthResponse } from '@app/interfaces/auth';

import { createAuthPersistStorage } from './authPersistStorage';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;

  setSession: (payload: AuthResponse) => void;
  clearSession: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      user: null,

      setSession: ({ jwt, user }) => {
        set({ accessToken: jwt, user });
      },

      clearSession: () => {
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createAuthPersistStorage(),
      partialize: state => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
