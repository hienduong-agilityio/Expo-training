import { type Href } from 'expo-router';

const STYLISH_SCHEME = 'stylish://';

function stylishDeepLinkToHref(deepLink: string): Href | null {
  if (!deepLink.startsWith(STYLISH_SCHEME)) {
    return null;
  }
  const rest = deepLink.slice(STYLISH_SCHEME.length);
  if (rest.startsWith('product/')) {
    const id = rest.slice('product/'.length);
    if (id.length > 0) {
      return `/product/${id}` as Href;
    }
    return null;
  }
  if (rest.startsWith('products/')) {
    const type = rest.slice('products/'.length);
    if (type.length > 0) {
      return `/products/${type}` as Href;
    }
    return null;
  }
  const rootPaths: Record<string, Href> = {
    home: '/home',
    cart: '/cart',
    wishlist: '/wishlist',
  };
  const segment = rest.split('/')[0] ?? '';
  return rootPaths[segment] ?? null;
}

function readString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const v = data[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

/**
 * Maps notification payload `data` to an Expo Router `Href` (Expo / FCM often stringify values).
 */
export function resolveNotificationHref(
  data: Record<string, unknown> | undefined,
): Href | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const url = readString(data, 'url');
  if (url?.startsWith('/')) {
    return url as Href;
  }

  const explicitDeepLink = readString(data, 'deepLink');
  if (explicitDeepLink) {
    const fromStylish = stylishDeepLinkToHref(explicitDeepLink);
    if (fromStylish) {
      return fromStylish;
    }
    if (explicitDeepLink.startsWith('/')) {
      return explicitDeepLink as Href;
    }
  }

  const productId =
    readString(data, 'documentId') ?? readString(data, 'productId');
  if (productId) {
    return `/product/${productId}` as Href;
  }

  const inferredStylish = url?.startsWith(STYLISH_SCHEME)
    ? stylishDeepLinkToHref(url)
    : null;
  if (inferredStylish) {
    return inferredStylish;
  }

  return null;
}
