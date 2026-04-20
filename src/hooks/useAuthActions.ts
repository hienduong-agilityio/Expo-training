import { useCallback } from 'react';

// React Query
import { useQueryClient, useMutation } from '@tanstack/react-query';

// Services
import { authService } from '@app/services/auth';

// Stores
import { authStore } from '@app/stores/authStore';
import { deferredNavigationStore } from '@app/stores/deferredNavigationStore';
import { toastStore } from '@app/stores/toastStore';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';
import { STATUS, TOAST_MESSAGES } from '@app/constants';

// Types
import type { LoginPayload, RegisterPayload } from '@app/interfaces/auth';

// Helpers
import { getApiErrorMessage } from '@app/helpers/errorMessage';

/**
 * Hook for authentication related actions
 */
export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const showToast = toastStore(state => state.showToast);

  const setSession = authStore(state => state.setSession);
  const clearSession = authStore(state => state.clearSession);

  const clearUserQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.CART] });
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'login'],
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: response => {
      setSession(response);
      clearUserQueries();
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.LOGIN_SUCCESS,
      });
    },
    onError: error => {
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, TOAST_MESSAGES.REQUEST_FAILED),
      });
    },
  });

  const registerMutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'register'],
    mutationFn: (payload: RegisterPayload) => authService.signUp(payload),
    onSuccess: () => {
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REGISTER_SUCCESS,
      });
    },
    onError: error => {
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, TOAST_MESSAGES.REQUEST_FAILED),
      });
    },
  });

  const logout = useCallback(() => {
    try {
      deferredNavigationStore.getState().resetDeferredNavigation();
      clearSession();
      clearUserQueries();
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.SIGNED_OUT,
      });
    } catch (error) {
      showToast({
        type: STATUS.ERROR,
        message: TOAST_MESSAGES.REQUEST_FAILED,
      });
    }
  }, [clearSession, clearUserQueries, showToast]);

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
  };
};
