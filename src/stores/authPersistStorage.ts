import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import type { PersistStorage } from 'zustand/middleware';

// Types
import type { AuthUser } from '@app/interfaces/auth';

export type AuthPersistSlice = {
  accessToken: string | null;
  user: AuthUser | null;
};

const accessTokenKey = (persistName: string) => `${persistName}.accessToken`;
const userKey = (persistName: string) => `${persistName}.user`;

async function deleteSecureItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Key may not exist (e.g. first launch or after clear).
  }
}

/**
 * Persists JWT in SecureStore and user profile in AsyncStorage so the token
 * stays within secure storage size limits and is not stored in plaintext with user JSON.
 */
export const createAuthPersistStorage =
  (): PersistStorage<AuthPersistSlice> => ({
    getItem: async name => {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(accessTokenKey(name)),
        AsyncStorage.getItem(userKey(name)),
      ]);

      if (!token && !userJson) {
        return null;
      }

      let user: AuthUser | null = null;
      if (userJson) {
        try {
          user = JSON.parse(userJson) as AuthUser;
        } catch {
          user = null;
        }
      }

      return {
        state: {
          accessToken: token,
          user,
        },
        version: 0,
      };
    },
    setItem: async (name, value) => {
      const { accessToken, user } = value.state;

      if (accessToken) {
        await SecureStore.setItemAsync(accessTokenKey(name), accessToken);
      } else {
        await deleteSecureItem(accessTokenKey(name));
      }

      if (user != null) {
        await AsyncStorage.setItem(userKey(name), JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(userKey(name));
      }
    },
    removeItem: async name => {
      await deleteSecureItem(accessTokenKey(name));
      await AsyncStorage.removeItem(userKey(name));
    },
  });
