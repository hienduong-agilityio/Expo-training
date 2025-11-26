import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { wishlistService } from '@app/services/wishlist';

// Stores
import { authStore } from '@app/stores/authStore';

// Types
import type { ApiError } from '@app/interfaces/api';
import type { IWishlist, IWishlistItem } from '@app/interfaces/wishlist';

export type WishlistHookError = ApiError | Error | unknown;

export const wishlistQueryKey = (userId?: string) =>
  ['wishlist', userId] as const;

export const useWishlist = () => {
  const { user } = authStore();
  const userId = user?.documentId;
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery<IWishlist | null, WishlistHookError>({
    queryKey: wishlistQueryKey(userId),
    enabled: Boolean(userId),
    staleTime: 30_000,
    queryFn: () =>
      userId
        ? wishlistService.getWishlistForUser(userId)
        : Promise.resolve(null),
  });

  const getCachedWishlist = (): IWishlist | null => {
    if (!userId) return null;

    const cached = queryClient.getQueryData<IWishlist | null>(
      wishlistQueryKey(userId),
    );

    return cached ?? null;
  };

  const setCachedWishlist = (wishlist: IWishlist | null) => {
    if (!userId) return;

    queryClient.setQueryData<IWishlist | null>(
      wishlistQueryKey(userId),
      wishlist,
    );
  };

  const ensureWishlist = async (): Promise<IWishlist> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const cached = getCachedWishlist();
    if (cached) return cached;

    const created = await wishlistService.ensureWishlistForUser(userId);

    setCachedWishlist(created);
    return created;
  };

  const addItemMutation = useMutation<IWishlist, WishlistHookError, string>({
    mutationKey: ['wishlist-add-item', userId],
    mutationFn: async productId => {
      const baseWishlist = await ensureWishlist();
      const current = baseWishlist.products ?? [];

      const exists = current.some(item => item.productId === productId);

      if (exists) return baseWishlist;

      const next: IWishlistItem[] = [...current, { productId }];

      const updated = await wishlistService.updateWishlistProducts(
        baseWishlist.documentId,
        next,
      );

      setCachedWishlist(updated);

      return updated;
    },
  });

  const removeItemMutation = useMutation<IWishlist, WishlistHookError, string>({
    mutationKey: ['wishlist-remove-item', userId],
    mutationFn: async productId => {
      const baseWishlist = await ensureWishlist();
      const current = baseWishlist.products ?? [];

      const next = current.filter(item => item.productId !== productId);

      const updated = await wishlistService.updateWishlistProducts(
        baseWishlist.documentId,
        next,
      );

      setCachedWishlist(updated);

      return updated;
    },
  });

  const wishlist = wishlistQuery.data ?? null;
  const wishlistItems: IWishlistItem[] = wishlist?.products ?? [];
  const wishlistProductIds = wishlistItems.map(item => item.productId);

  const isInWishlist = (productId: string): boolean =>
    wishlistProductIds.includes(productId);

  const isMutating = addItemMutation.isPending || removeItemMutation.isPending;

  return {
    wishlist,
    wishlistItems,
    wishlistProductIds,
    isLoading: wishlistQuery.isLoading,
    isFetching: wishlistQuery.isFetching,
    isMutating,
    error: (wishlistQuery.error ?? null) as WishlistHookError | null,
    isInWishlist,
    refetch: wishlistQuery.refetch,
    addItem: addItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
  };
};
