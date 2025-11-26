import { apiRequest } from '@app/services/apiClient';

// Constants
import { WISHLIST_ENDPOINTS, HTTP_METHODS } from '@app/constants/api';

// Types
import type {
  IWishlist,
  IWishlistListResponse,
  IWishlistSingleResponse,
  IWishlistItem,
} from '@app/interfaces/wishlist';

export const wishlistService = {
  async getWishlistForUser(userDocumentId: string): Promise<IWishlist | null> {
    const response = await apiRequest<IWishlistListResponse>(
      WISHLIST_ENDPOINTS.ROOT,
      {
        method: HTTP_METHODS.GET,
        auth: true,
        query: {
          filters: {
            userId: { $eq: userDocumentId },
          },
          pagination: { pageSize: 1 },
        },
      },
    );

    return response.data[0] ?? null;
  },

  async ensureWishlistForUser(userDocumentId: string): Promise<IWishlist> {
    const existing = await wishlistService.getWishlistForUser(userDocumentId);

    if (existing) return existing;

    const created = await apiRequest<
      IWishlistSingleResponse,
      { data: Pick<IWishlist, 'userId'> & { products: IWishlistItem[] } }
    >(WISHLIST_ENDPOINTS.ROOT, {
      method: HTTP_METHODS.POST,
      auth: true,
      body: {
        data: {
          userId: userDocumentId,
          products: [],
        },
      },
    });

    return created.data;
  },

  async updateWishlistProducts(
    wishlistId: string,
    products: IWishlistItem[],
  ): Promise<IWishlist> {
    const response = await apiRequest<
      IWishlistSingleResponse,
      { data: { products: IWishlistItem[] } }
    >(`${WISHLIST_ENDPOINTS.ROOT}/${wishlistId}`, {
      method: HTTP_METHODS.PUT,
      auth: true,
      body: {
        data: { products },
      },
    });

    return response.data;
  },
};
