// Services
import { apiRequest } from '@app/services/apiClient';

// Constants
import { CART_ENDPOINTS, HTTP_METHODS } from '@app/constants/api';

// Types
import type {
  Cart,
  CartListResponse,
  CartSingleResponse,
} from '@app/interfaces/cart';

/**
 * Retrieves the active cart for a specific user
 */
const getActiveCartForUser = async (
  userDocumentId: string,
): Promise<Cart | null> => {
  const response = await apiRequest<CartListResponse>(CART_ENDPOINTS.ROOT, {
    method: HTTP_METHODS.GET,
    query: {
      filters: {
        $and: [
          { userId: { $eq: userDocumentId } },
          { cart_status: { $eq: 'active' } },
        ],
      },
      pagination: { pageSize: 1 },
      populate: '*',
    },
  });

  return response.data?.[0] ?? null;
};

/**
 * Ensures an active cart exists for the user, creating one if necessary
 */
const ensureActiveCartForUser = async (
  userDocumentId: string,
): Promise<Cart> => {
  const existing = await getActiveCartForUser(userDocumentId);
  if (existing) return existing;

  const created = await apiRequest<
    CartSingleResponse,
    { data: Pick<Cart, 'userId' | 'cart_status'> }
  >(CART_ENDPOINTS.ROOT, {
    method: HTTP_METHODS.POST,
    query: { populate: '*' },
    body: {
      data: {
        userId: userDocumentId,
        cart_status: 'active',
      },
    },
  });

  return created.data;
};

/**
 * Updates the products in a specific cart
 */
const updateCartProducts = async (
  cartId: string,
  products: Array<{ productId: string; quantity: number }>,
): Promise<Cart> => {
  const response = await apiRequest<
    CartSingleResponse,
    { data: { products: Array<{ productId: string; quantity: number }> } }
  >(`${CART_ENDPOINTS.ROOT}/${cartId}`, {
    method: HTTP_METHODS.PUT,
    query: { populate: '*' },
    body: {
      data: { products },
    },
  });

  return response.data;
};

/**
 * Clears all products from the specified cart
 */
const clearCartProducts = async (cartId: string): Promise<Cart> => {
  return updateCartProducts(cartId, []);
};

export const cartService = {
  getActiveCartForUser,
  ensureActiveCartForUser,
  updateCartProducts,
  clearCartProducts,
} as const;
