import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Services
import { authService } from '@app/services/auth';

// Stores
import { authStore } from '@app/stores/authStore';

// Types
import type { LoginPayload, RegisterPayload } from '@app/interfaces/auth';

export const useAuthActions = () => {
  const { setSession, clearSession } = authStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const clearUserQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.removeQueries({ queryKey: ['wishlist'] });
  }, [queryClient]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsSubmitting(true);

      try {
        const response = await authService.login(payload);

        setSession(response);
        clearUserQueries();

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setSession, clearUserQueries],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsSubmitting(true);

    try {
      const response = await authService.signUp(payload);

      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    clearSession();
    clearUserQueries();
  }, [clearSession, clearUserQueries]);

  return {
    login,
    register,
    logout,
    isSubmitting,
  };
};
