import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import type { AuthUser, AuthResponse } from '@app/interfaces/auth';

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
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
