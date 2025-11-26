import { apiRequest } from '@app/services/apiClient';

// Constants
import { CART_ENDPOINTS, HTTP_METHODS } from '@app/constants/api';

// Types
import type {
  Cart,
  CartListResponse,
  CartSingleResponse,
} from '@app/interfaces/cart';

export const cartService = {
  async getActiveCartForUser(userDocumentId: string): Promise<Cart | null> {
    const response = await apiRequest<CartListResponse>(CART_ENDPOINTS.ROOT, {
      method: HTTP_METHODS.GET,
      auth: true,
      query: {
        filters: {
          $and: [
            { userId: { $eq: userDocumentId } },
            { cart_status: { $eq: 'active' } },
          ],
        },
        pagination: { pageSize: 1 },
      },
    });

    return response.data[0] ?? null;
  },

  async ensureActiveCartForUser(userDocumentId: string): Promise<Cart> {
    const existing = await cartService.getActiveCartForUser(userDocumentId);

    if (existing) return existing;

    const created = await apiRequest<
      CartSingleResponse,
      { data: Pick<Cart, 'userId' | 'cart_status'> }
    >(CART_ENDPOINTS.ROOT, {
      method: HTTP_METHODS.POST,
      auth: true,
      body: {
        data: {
          userId: userDocumentId,
          cart_status: 'active',
        },
      },
    });

    return created.data;
  },

  async updateCartProducts(
    cartId: string,
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<Cart> {
    const response = await apiRequest<
      CartSingleResponse,
      { data: { products: Array<{ productId: string; quantity: number }> } }
    >(`${CART_ENDPOINTS.ROOT}/${cartId}`, {
      method: HTTP_METHODS.PUT,
      auth: true,
      body: {
        data: { products },
      },
    });

    return response.data;
  },

  async clearCartProducts(cartId: string): Promise<Cart> {
    return cartService.updateCartProducts(cartId, []);
  },
};
