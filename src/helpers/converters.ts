// Types
import type { RawApiItem } from '@app/interfaces/api';
import type { ICartItem } from '@app/interfaces/cart';
import type { IWishlistItem } from '@app/interfaces/wishlist';

/**
 * Safely converts a value to string
 */
export const safeString = (value: unknown): string | undefined => {
  return value !== undefined && value !== null ? String(value) : undefined;
};

/**
 * Safely converts a value to number
 */
export const safeNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const num = Number(value);

  return isNaN(num) ? undefined : num;
};

/**
 * Converts RawApiItem to ICartItem format
 */
export const convertRawApiItemToCartItem = (item: RawApiItem): ICartItem => ({
  productId: String(item.productId || item.product || ''),
  quantity: item.quantity ?? 0,
});

/**
 * Converts RawApiItem to IWishlistItem format
 */
export const convertRawApiItemToWishlistItem = (
  item: RawApiItem,
): IWishlistItem => ({
  productId: String(item.productId || item.product || ''),
});
