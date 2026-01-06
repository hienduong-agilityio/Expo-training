// Services
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

/**
 * Retrieves the wishlist for a specific user
 */
const getWishlistForUser = async (
  userDocumentId: string,
): Promise<IWishlist | null> => {
  const response = await apiRequest<IWishlistListResponse>(
    WISHLIST_ENDPOINTS.ROOT,
    {
      method: HTTP_METHODS.GET,
      query: {
        filters: {
          userId: { $eq: userDocumentId },
        },
        pagination: { pageSize: 1 },
      },
    },
  );

  return response.data?.[0] ?? null;
};

/**
 * Ensures a wishlist exists for the user, creating one if necessary
 */
const ensureWishlistForUser = async (
  userDocumentId: string,
): Promise<IWishlist> => {
  const existing = await getWishlistForUser(userDocumentId);
  if (existing) return existing;

  const created = await apiRequest<
    IWishlistSingleResponse,
    { data: Pick<IWishlist, 'userId'> & { products: IWishlistItem[] } }
  >(WISHLIST_ENDPOINTS.ROOT, {
    method: HTTP_METHODS.POST,
    body: {
      data: {
        userId: userDocumentId,
        products: [],
      },
    },
  });

  return created.data;
};

/**
 * Updates the products in the wishlist
 */
const updateWishlistProducts = async (
  wishlistId: string,
  products: IWishlistItem[],
): Promise<IWishlist> => {
  const response = await apiRequest<
    IWishlistSingleResponse,
    { data: { products: IWishlistItem[] } }
  >(`${WISHLIST_ENDPOINTS.ROOT}/${wishlistId}`, {
    method: HTTP_METHODS.PUT,
    body: {
      data: { products },
    },
  });

  return response.data;
};

/**
 * Service for managing user's product wishlist
 */
export const wishlistService = {
  getWishlistForUser,
  ensureWishlistForUser,
  updateWishlistProducts,
} as const;
