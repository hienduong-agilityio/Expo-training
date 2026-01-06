// React
import { useMemo } from 'react';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { cartService } from '@app/services/cart';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { ApiError, RawApiItem } from '@app/interfaces/api';
import type { Cart, ICartItem } from '@app/interfaces/cart';

// Helpers
import { convertRawApiItemToCartItem } from '@app/helpers/converters';

export type CartHookError = ApiError | Error | unknown;

const DEFAULT_STALE_TIME = 30_000;

/**
 * Hook to fetch and manage cart data
 */
export const useCart = () => {
  const userId = authStore(state => state.user?.documentId);

  const query = useQuery<Cart | null, CartHookError>({
    queryKey: [QUERY_KEYS.CART, userId],
    enabled: Boolean(userId),
    staleTime: DEFAULT_STALE_TIME,
    queryFn: () =>
      userId ? cartService.getActiveCartForUser(userId) : Promise.resolve(null),
  });

  const cartItems = useMemo(
    () =>
      (query.data?.products ?? []).map((item: RawApiItem) =>
        convertRawApiItemToCartItem(item),
      ),
    [query.data?.products],
  );

  return {
    cart: query.data ?? null,
    cartItems,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for cart mutations (add, update, remove, checkout)
 */
export const useCartActions = () => {
  const queryClient = useQueryClient();
  const userId = authStore(state => state.user?.documentId);
  const queryKey = [QUERY_KEYS.CART, userId];

  const ensureCart = async (): Promise<Cart> => {
    if (!userId) throw new Error('User not authenticated');

    const cached = queryClient.getQueryData<Cart | null>(queryKey);
    if (cached) return cached;

    const created = await cartService.ensureActiveCartForUser(userId);
    queryClient.setQueryData(queryKey, created);
    return created;
  };

  const convertProducts = (products: RawApiItem[]): ICartItem[] =>
    products.map(convertRawApiItemToCartItem);

  const addItemMutation = useMutation<Cart, CartHookError, ICartItem>({
    mutationFn: async ({ productId, quantity = 1 }) => {
      const baseCart = await ensureCart();
      const current = convertProducts(baseCart.products ?? []);

      const existingIndex = current.findIndex(
        item => item.productId === productId,
      );

      const nextProducts =
        existingIndex === -1
          ? [...current, { productId, quantity }]
          : current.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );

      return cartService.updateCartProducts(baseCart.documentId, nextProducts);
    },
    onSuccess: updated => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  const removeItemMutation = useMutation<Cart, CartHookError, string>({
    mutationFn: async productId => {
      const baseCart = await ensureCart();
      const current = convertProducts(baseCart.products ?? []);

      return cartService.updateCartProducts(
        baseCart.documentId,
        current.filter(item => item.productId !== productId),
      );
    },
    onSuccess: updated => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  const updateItemMutation = useMutation<Cart, CartHookError, ICartItem>({
    mutationFn: async ({ productId, quantity }) => {
      if (quantity <= 0) {
        return removeItemMutation.mutateAsync(productId);
      }

      const baseCart = await ensureCart();
      const current = convertProducts(baseCart.products ?? []);

      return cartService.updateCartProducts(
        baseCart.documentId,
        current.map(item =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    },
    onSuccess: updated => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  const checkoutMutation = useMutation<Cart, CartHookError, void>({
    mutationFn: async () => {
      const baseCart = await ensureCart();
      return cartService.clearCartProducts(baseCart.documentId);
    },

    onSuccess: updated => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  return {
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    checkout: checkoutMutation.mutateAsync,
    isMutating:
      addItemMutation.isPending ||
      updateItemMutation.isPending ||
      removeItemMutation.isPending ||
      checkoutMutation.isPending,
  };
};
