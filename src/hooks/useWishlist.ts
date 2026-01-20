// React
import { useCallback, useMemo } from 'react';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { wishlistService } from '@app/services/wishlist';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { QUERY_KEYS } from '@app/constants';

// Types
import type { ApiError, RawApiItem } from '@app/interfaces/api';
import type { IWishlist, IWishlistItem } from '@app/interfaces/wishlist';

// Helpers
import { convertRawApiItemToWishlistItem } from '@app/helpers/converters';

export type WishlistHookError = ApiError | Error | unknown;

const DEFAULT_STALE_TIME = 30_000;

/**
 * Hook to fetch and manage wishlist data
 */
export const useWishlist = () => {
  const userId = authStore(state => state.user?.documentId);

  const query = useQuery<IWishlist | null, WishlistHookError>({
    queryKey: [QUERY_KEYS.WISHLIST, userId],
    enabled: Boolean(userId),
    staleTime: DEFAULT_STALE_TIME,
    queryFn: () =>
      userId
        ? wishlistService.getWishlistForUser(userId)
        : Promise.resolve(null),
  });

  const wishlist = query.data ?? null;

  const wishlistItems = useMemo(
    () =>
      (wishlist?.products ?? []).map((item: RawApiItem) =>
        convertRawApiItemToWishlistItem(item),
      ),
    [wishlist?.products],
  );

  const wishlistProductIds = useMemo(
    () => wishlistItems.map((item: { productId: string }) => item.productId),
    [wishlistItems],
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => wishlistProductIds.includes(productId),
    [wishlistProductIds],
  );

  return {
    wishlist,
    wishlistItems,
    wishlistProductIds,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as WishlistHookError | null,
    refetch: query.refetch,
    isInWishlist,
  };
};

/**
 * Hook for wishlist actions (add, remove)
 */
export const useWishlistActions = () => {
  const queryClient = useQueryClient();
  const userId = authStore(state => state.user?.documentId);
  const queryKey = [QUERY_KEYS.WISHLIST, userId];

  const ensureWishlist = async (): Promise<IWishlist> => {
    if (!userId) throw new Error('User not authenticated');

    const cached = queryClient.getQueryData<IWishlist | null>(queryKey);
    if (cached) return cached;

    const created = await wishlistService.ensureWishlistForUser(userId);
    queryClient.setQueryData(queryKey, created);
    return created;
  };

  const convertProducts = (products: RawApiItem[]): IWishlistItem[] =>
    products.map(convertRawApiItemToWishlistItem);

  const addItemMutation = useMutation<IWishlist, WishlistHookError, string>({
    mutationFn: async (productId: string) => {
      const baseWishlist = await ensureWishlist();
      const current = convertProducts(baseWishlist.products ?? []);

      if (current.some(item => item.productId === productId)) {
        return baseWishlist;
      }

      return wishlistService.updateWishlistProducts(baseWishlist.documentId, [
        ...current,
        { productId },
      ]);
    },
    onSuccess: (updated: IWishlist) => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  const removeItemMutation = useMutation<IWishlist, WishlistHookError, string>({
    mutationFn: async (productId: string) => {
      const baseWishlist = await ensureWishlist();
      const current = convertProducts(baseWishlist.products ?? []);

      return wishlistService.updateWishlistProducts(
        baseWishlist.documentId,
        current.filter(item => item.productId !== productId),
      );
    },
    onSuccess: (updated: IWishlist) => {
      queryClient.setQueryData(queryKey, updated);
    },
  });

  return {
    addItem: addItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    isMutating: addItemMutation.isPending || removeItemMutation.isPending,
  };
};
