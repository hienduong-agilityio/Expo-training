// React
import { authStore } from '@app/stores/authStore';
import { toastStore } from '@app/stores/toastStore';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { wishlistService } from '@app/services/wishlist';

// Constants
import { QUERY_KEYS, STATUS, TOAST_MESSAGES } from '@app/constants';

// Types
import type { ApiError, RawApiItem } from '@app/interfaces/api';
import type { IWishlist, IWishlistItem } from '@app/interfaces/wishlist';

// Helpers
import { convertRawApiItemToWishlistItem } from '@app/helpers/converters';
import { getApiErrorMessage } from '@app/helpers/errorMessage';

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

  const productIds = (query.data?.products ?? []).map((p: RawApiItem) =>
    String(p.productId || p.product || ''),
  );

  return {
    wishlist: query.data ?? null,
    wishlistItems: (query.data?.products ?? []).map(
      convertRawApiItemToWishlistItem,
    ),
    wishlistProductIds: productIds,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as WishlistHookError | null,
    refetch: query.refetch,
    isInWishlist: (id: string) => productIds.includes(String(id)),
  };
};

/**
 * Hook for wishlist actions (add, remove)
 */
export const useWishlistActions = () => {
  const queryClient = useQueryClient();
  const userId = authStore(state => state.user?.documentId);
  const showToast = toastStore(state => state.showToast);
  const queryKey = [QUERY_KEYS.WISHLIST, userId];

  const mutateWishlist = async (
    updateFn: (items: IWishlistItem[]) => IWishlistItem[],
  ) => {
    const base = await wishlistService.ensureWishlistForUser(userId!);
    const current = (base.products ?? []).map(convertRawApiItemToWishlistItem);
    const payload = updateFn(current).map(p => ({
      productId: String(p.productId),
      product: String(p.productId),
    }));

    return wishlistService.updateWishlistProducts(base.documentId, payload);
  };

  const addItem = useMutation({
    mutationKey: [QUERY_KEYS.WISHLIST_ADD_ITEM, userId],
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousWishlist = queryClient.getQueryData<IWishlist>(queryKey);

      if (previousWishlist) {
        const current = (previousWishlist.products ?? []) as RawApiItem[];
        const idStr = String(id);
        const alreadyExists = current.some(
          i => String(i.productId || i.product) === idStr,
        );
        const next = alreadyExists
          ? current
          : [...current, { productId: idStr, product: idStr }];
        queryClient.setQueryData(queryKey, {
          ...previousWishlist,
          products: next,
        });
      }

      return { previousWishlist };
    },
    mutationFn: (id: string) =>
      mutateWishlist(items =>
        items.some(i => String(i.productId) === String(id))
          ? items
          : [...items, { productId: String(id) }],
      ),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.ADDED_TO_WISHLIST,
      });
    },
    onError: (error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKey, context.previousWishlist);
      }
      showToast({ type: STATUS.ERROR, message: getApiErrorMessage(error) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeItem = useMutation({
    mutationKey: [QUERY_KEYS.WISHLIST_REMOVE_ITEM, userId],
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousWishlist = queryClient.getQueryData<IWishlist>(queryKey);

      if (previousWishlist) {
        const current = (previousWishlist.products ?? []) as RawApiItem[];
        queryClient.setQueryData(queryKey, {
          ...previousWishlist,
          products: current.filter(
            i => String(i.productId || i.product) !== String(id),
          ),
        });
      }

      return { previousWishlist };
    },
    mutationFn: (id: string) =>
      mutateWishlist(items =>
        items.filter(i => String(i.productId) !== String(id)),
      ),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REMOVED_FROM_WISHLIST,
      });
    },
    onError: (error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKey, context.previousWishlist);
      }
      showToast({ type: STATUS.ERROR, message: getApiErrorMessage(error) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    addItem: addItem.mutateAsync,
    removeItem: removeItem.mutateAsync,
    isMutating: addItem.isPending || removeItem.isPending,
  };
};
