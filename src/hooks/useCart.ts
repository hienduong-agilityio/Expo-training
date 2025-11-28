import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { cartService } from '@app/services/cart';

// Stores
import { authStore } from '@app/stores/authStore';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { ApiError } from '@app/interfaces/api';
import type { Cart, ICartItem } from '@app/interfaces/cart';

export type CartHookError = ApiError | Error | unknown;

// TODO: Split into multiple hooks
export const useCart = () => {
  const userId = authStore(state => state.user?.documentId);

  const queryClient = useQueryClient();

  const cartQuery = useQuery<Cart | null, CartHookError>({
    queryKey: [QUERY_KEYS.CART, userId],
    enabled: Boolean(userId),
    staleTime: 30_000,
    queryFn: () =>
      userId ? cartService.getActiveCartForUser(userId) : Promise.resolve(null),
  });

  const getCachedCart = (): Cart | null => {
    if (!userId) return null;

    const cached = queryClient.getQueryData<Cart | null>([
      QUERY_KEYS.CART,
      userId,
    ]);

    return cached ?? null;
  };

  const setCachedCart = (cart: Cart | null) => {
    if (!userId) return;

    queryClient.setQueryData<Cart | null>([QUERY_KEYS.CART, userId], cart);
  };

  const ensureCart = async (): Promise<Cart> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const cached = getCachedCart();

    if (cached) return cached;

    const created = await cartService.ensureActiveCartForUser(userId);

    setCachedCart(created);

    return created;
  };

  const addItemMutation = useMutation<Cart, CartHookError, ICartItem>({
    mutationKey: [QUERY_KEYS.CART_ADD_ITEM, userId],
    mutationFn: async ({ productId, quantity = 1 }) => {
      const baseCart = await ensureCart();
      const current = baseCart.products ?? [];

      const index = current.findIndex(item => item.productId === productId);

      const nextProducts: ICartItem[] =
        index === -1
          ? [...current, { productId, quantity }]
          : current.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );

      const updated = await cartService.updateCartProducts(
        baseCart.documentId,
        nextProducts,
      );

      setCachedCart(updated);
      return updated;
    },
  });

  const updateItemMutation = useMutation<Cart, CartHookError, ICartItem>({
    mutationKey: [QUERY_KEYS.CART_UPDATE_ITEM, userId],
    mutationFn: async ({ productId, quantity }) => {
      const baseCart = await ensureCart();
      const current = baseCart.products ?? [];

      if (quantity <= 0) {
        const filtered = current.filter(item => item.productId !== productId);
        const updated = await cartService.updateCartProducts(
          baseCart.documentId,
          filtered,
        );

        setCachedCart(updated);

        return updated;
      }

      const nextProducts = current.map(item =>
        item.productId === productId ? { ...item, quantity } : item,
      );

      const updated = await cartService.updateCartProducts(
        baseCart.documentId,
        nextProducts,
      );

      setCachedCart(updated);
      return updated;
    },
  });

  const removeItemMutation = useMutation<Cart, CartHookError, string>({
    mutationKey: [QUERY_KEYS.CART_REMOVE_ITEM, userId],
    mutationFn: async productId => {
      const baseCart = await ensureCart();
      const current = baseCart.products ?? [];

      const nextProducts = current.filter(item => item.productId !== productId);

      const updated = await cartService.updateCartProducts(
        baseCart.documentId,
        nextProducts,
      );

      setCachedCart(updated);
      return updated;
    },
  });

  const checkoutMutation = useMutation<Cart, CartHookError, void>({
    mutationKey: [QUERY_KEYS.CART_CHECKOUT, userId],
    mutationFn: async () => {
      const baseCart = await ensureCart();
      const clearedCart = await cartService.clearCartProducts(
        baseCart.documentId,
      );

      setCachedCart(clearedCart);

      return clearedCart;
    },
  });

  const cart = cartQuery.data;
  const cartItems: ICartItem[] = cart?.products ?? [];

  const isMutating =
    addItemMutation.isPending ||
    updateItemMutation.isPending ||
    removeItemMutation.isPending ||
    checkoutMutation.isPending;

  return {
    cart,
    cartItems,
    isLoading: cartQuery.isLoading,
    isFetching: cartQuery.isFetching,
    isMutating,
    error: cartQuery.error,
    refetch: cartQuery.refetch,
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    checkout: checkoutMutation.mutateAsync,
  };
};
