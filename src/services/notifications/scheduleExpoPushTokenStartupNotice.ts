import * as Device from 'expo-device';

import { NotificationType } from '@app/enums/notification';
import { STARTUP_SPOTLIGHT_PRODUCT_DOCUMENT_ID } from '@app/constants/notification';
import { productsService } from '@app/services/product';
import type { IProduct } from '@app/interfaces/product';
import type { NotificationData } from '@app/interfaces/notification';

import { displayNotification } from './display';
import {
  ensureNotificationPermissionAsync,
  tryGetExpoPushTokenAsync,
} from './expoPushRegister';

const STARTUP_NOTICE_DELAY_SEC = 2;
const STARTUP_NOTIFICATION_IDENTIFIER = 'startup-product-spotlight';

const FALLBACK_PRODUCT: Pick<
  IProduct,
  'id' | 'name' | 'shortDescription' | 'description' | 'price' | 'salePrice'
> & { discountPercent?: number } = {
  id: STARTUP_SPOTLIGHT_PRODUCT_DOCUMENT_ID,
  name: 'Elegant Black Dress',
  shortDescription: 'Sophisticated black dress for special occasions',
  description:
    'Stunning black dress featuring an elegant silhouette and premium fabric. Perfect for evening events.',
  price: 129.99,
  salePrice: 99.99,
  discountPercent: 23,
};

function formatPrice(value?: number): string | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return `$${value.toFixed(2)}`;
}

function buildSubtitle(product: {
  price?: number;
  salePrice?: number;
  discountPercent?: number;
}): string | undefined {
  const { price, salePrice, discountPercent } = product;
  const sale = formatPrice(salePrice);
  const original = formatPrice(price);
  if (sale && original && salePrice !== price) {
    const discount = discountPercent ? ` · -${discountPercent}%` : '';
    return `${sale} (was ${original})${discount}`;
  }
  return sale ?? original;
}

function buildStartupNotificationData(product: {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  imageSource?: { uri: string };
}): NotificationData {
  return {
    type: NotificationType.PRODUCT_RECOMMENDATION,
    title: product.name,
    body:
      product.shortDescription?.trim() ||
      product.description?.trim() ||
      'Tap to view product details.',
    imageUrl: product.imageSource?.uri,
    documentId: product.id,
    productId: product.id,
    timestamp: Date.now(),
  };
}

async function scheduleProductSpotlightNotificationAsync(): Promise<void> {
  let product:
    | (IProduct & { shortDescription?: string; discountPercent?: number })
    | typeof FALLBACK_PRODUCT = FALLBACK_PRODUCT;

  try {
    product = await productsService.getProductById(
      STARTUP_SPOTLIGHT_PRODUCT_DOCUMENT_ID,
    );
  } catch (e) {
    if (__DEV__) {
      console.warn('[Notifications][startup] fallback product used', e);
    }
  }

  const data = buildStartupNotificationData({
    id: product.id ?? STARTUP_SPOTLIGHT_PRODUCT_DOCUMENT_ID,
    name: product.name,
    shortDescription: (product as { shortDescription?: string })
      .shortDescription,
    description: product.description,
    imageSource: (product as IProduct).imageSource,
  });

  const subtitle = buildSubtitle({
    price: product.price,
    salePrice: product.salePrice,
    discountPercent: (product as { discountPercent?: number }).discountPercent,
  });

  await displayNotification(data, {
    notificationIdentifier: STARTUP_NOTIFICATION_IDENTIFIER,
    delaySeconds: STARTUP_NOTICE_DELAY_SEC,
    subtitle,
  });
}

/**
 * On first app launch (emulator or real device):
 *  1. Request notification permission (and init Android channels).
 *  2. Schedule a local "product spotlight" notification via the shared
 *     {@link displayNotification} so it picks up the correct channel (PRODUCT),
 *     app icon, deep link, and payload shape — just like a real FCM-delivered push.
 *  3. On real device only, register the Expo push token (FCM flow) for server-side pushes.
 */
export async function scheduleExpoPushTokenStartupNoticeAsync(): Promise<void> {
  const granted = await ensureNotificationPermissionAsync();
  if (!granted) {
    if (__DEV__) {
      console.warn('[Notifications][startup] permission not granted');
    }
    return;
  }

  await scheduleProductSpotlightNotificationAsync();

  if (Device.isDevice) {
    const result = await tryGetExpoPushTokenAsync();
    if (__DEV__) {
      if (result.ok) {
        console.log('[ExpoPush][startup]', result.token);
      } else {
        console.warn('[ExpoPush][startup]', result.message);
      }
    }
  } else if (__DEV__) {
    console.log(
      '[ExpoPush][startup] skipping token registration on emulator/simulator',
    );
  }
}
