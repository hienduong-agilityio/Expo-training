import { useCallback } from 'react';

// React Query
import { useQueryClient, useMutation } from '@tanstack/react-query';

// Services
import { authService } from '@app/services/auth';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { LoginPayload, RegisterPayload } from '@app/interfaces/auth';

/**
 * Hook for authentication related actions
 */
export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const setSession = authStore(state => state.setSession);
  const clearSession = authStore(state => state.clearSession);

  const clearUserQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.CART] });
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: response => {
      setSession(response);
      clearUserQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.signUp(payload),
  });

  const logout = useCallback(() => {
    clearSession();
    clearUserQueries();
  }, [clearSession, clearUserQueries]);

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
  };
};
