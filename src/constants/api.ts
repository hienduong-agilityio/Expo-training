const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_PUBLIC_STRAPI_BASE_URL = process.env.EXPO_PUBLIC_STRAPI_BASE_URL;
const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

export const API_CONFIG = {
  BASE_URL: normalizeBaseUrl(EXPO_PUBLIC_API_BASE_URL ?? ''),
  STRAPI_BASE_URL: normalizeBaseUrl(EXPO_PUBLIC_STRAPI_BASE_URL ?? ''),
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const CART_ENDPOINTS = {
  ROOT: '/carts',
} as const;

export const WISHLIST_ENDPOINTS = {
  ROOT: '/wishlists',
} as const;

export const USER_ENDPOINTS = {
  DEVICE_TOKEN: '/device-tokens',
} as const;
