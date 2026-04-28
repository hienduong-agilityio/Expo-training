// React
import { authStore } from '@app/stores/authStore';
import { toastStore } from '@app/stores/toastStore';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { cartService } from '@app/services/cart';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';
import { STATUS, TOAST_MESSAGES } from '@app/constants';

// Types
import type { ApiError, RawApiItem } from '@app/interfaces/api';
import type { Cart, ICartItem } from '@app/interfaces/cart';

// Helpers
import { convertRawApiItemToCartItem } from '@app/helpers/converters';
import { getApiErrorMessage } from '@app/helpers/errorMessage';

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

  return {
    cart: query.data ?? null,
    cartItems: (query.data?.products ?? []).map(convertRawApiItemToCartItem),
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
  const showToast = toastStore(state => state.showToast);
  const queryKey = [QUERY_KEYS.CART, userId];

  const mutateCart = async (updateFn: (items: ICartItem[]) => ICartItem[]) => {
    const base = await cartService.ensureActiveCartForUser(userId!);
    const current = (base.products ?? []).map(convertRawApiItemToCartItem);
    const payload = updateFn(current).map(p => ({
      productId: String(p.productId),
      product: String(p.productId),
      quantity: p.quantity,
    }));

    return cartService.updateCartProducts(base.documentId, payload);
  };

  const addItem = useMutation({
    mutationKey: [QUERY_KEYS.CART_ADD_ITEM, userId],
    onMutate: async ({ productId, quantity = 1 }: ICartItem) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<Cart>(queryKey);

      if (previousCart) {
        const current = (previousCart.products ?? []) as RawApiItem[];
        const id = String(productId);
        const idx = current.findIndex(
          i => String(i.productId || i.product) === id,
        );
        const next =
          idx === -1
            ? [...current, { productId: id, product: id, quantity }]
            : current.map((item, i) =>
                i === idx
                  ? {
                      ...item,
                      quantity: (item.quantity ?? 0) + quantity,
                    }
                  : item,
              );
        queryClient.setQueryData(queryKey, {
          ...previousCart,
          products: next,
        });
      }

      return { previousCart };
    },
    mutationFn: (vars: ICartItem) =>
      mutateCart(items => {
        const id = String(vars.productId);
        const idx = items.findIndex(i => String(i.productId) === id);

        return idx === -1
          ? [...items, { productId: id, quantity: vars.quantity }]
          : items.map((item, i) =>
              i === idx
                ? { ...item, quantity: item.quantity + vars.quantity }
                : item,
            );
      }),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      showToast({ type: STATUS.ERROR, message: getApiErrorMessage(error) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeItem = useMutation({
    mutationKey: [QUERY_KEYS.CART_REMOVE_ITEM, userId],
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<Cart>(queryKey);

      if (previousCart) {
        const current = (previousCart.products ?? []) as RawApiItem[];
        queryClient.setQueryData(queryKey, {
          ...previousCart,
          products: current.filter(
            i => String(i.productId || i.product) !== String(id),
          ),
        });
      }

      return { previousCart };
    },
    mutationFn: (id: string) =>
      mutateCart(items =>
        items.filter(i => String(i.productId) !== String(id)),
      ),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REMOVED_FROM_CART,
      });
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      showToast({ type: STATUS.ERROR, message: getApiErrorMessage(error) });
    },
  });

  const updateItem = useMutation({
    mutationKey: [QUERY_KEYS.CART_UPDATE_ITEM, userId],
    onMutate: async ({ productId, quantity }: ICartItem) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<Cart>(queryKey);

      if (previousCart) {
        const current = (previousCart.products ?? []) as RawApiItem[];
        const id = String(productId);
        const next =
          quantity <= 0
            ? current.filter(i => String(i.productId || i.product) !== id)
            : current.map(i =>
                String(i.productId || i.product) === id
                  ? { ...i, quantity }
                  : i,
              );
        queryClient.setQueryData(queryKey, {
          ...previousCart,
          products: next,
        });
      }

      return { previousCart };
    },
    mutationFn: (vars: ICartItem) =>
      mutateCart(items => {
        const id = String(vars.productId);
        return vars.quantity <= 0
          ? items.filter(i => String(i.productId) !== String(id))
          : items.map(i =>
              String(i.productId) === id
                ? { ...i, quantity: vars.quantity }
                : i,
            );
      }),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      showToast({ type: STATUS.ERROR, message: getApiErrorMessage(error) });
    },
  });

  const checkout = useMutation({
    mutationKey: [QUERY_KEYS.CART_CHECKOUT, userId],
    mutationFn: async () =>
      cartService.clearCartProducts(
        (await cartService.ensureActiveCartForUser(userId!)).documentId,
      ),
    onSuccess: data => {
      queryClient.setQueryData(queryKey, data);
      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.PAYMENT_SUCCESS,
      });
    },
    onError: error =>
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, TOAST_MESSAGES.PAYMENT_FAILED),
      }),
  });

  return {
    addItem: addItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    removeItem: removeItem.mutateAsync,
    checkout: checkout.mutateAsync,
    isMutating:
      addItem.isPending ||
      updateItem.isPending ||
      removeItem.isPending ||
      checkout.isPending,
  };
};
