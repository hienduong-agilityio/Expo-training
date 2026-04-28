// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import { NOTIFICATION_DEFAULTS } from '@app/constants/notification';

import { notificationDataFromExpoContent } from '../expoContent';

describe('notificationDataFromExpoContent', () => {
  it('uses defaults when title, body, and data are empty', () => {
    const result = notificationDataFromExpoContent({
      title: null,
      body: null,
      data: {},
    });

    expect(result.type).toBe(NotificationType.GENERAL);
    expect(result.title).toBe(NOTIFICATION_DEFAULTS.TITLE);
    expect(result.body).toBe(NOTIFICATION_DEFAULTS.BODY);
    expect(result.imageUrl).toBeUndefined();
    expect(typeof result.timestamp).toBe('number');
  });

  it('prefers content title/body and maps data fields', () => {
    const result = notificationDataFromExpoContent({
      title: 'Hello',
      body: 'World',
      data: {
        type: NotificationType.PRICE_DROP,
        imageUrl: 'https://x/img.png',
        deepLink: 'stylish://p/1',
        productId: 'p1',
        documentId: 'd1',
        productListType: 'trending',
        couponCode: 'SAVE',
        discount: 10,
        priority: 'high',
      },
    });

    expect(result).toMatchObject({
      type: NotificationType.PRICE_DROP,
      title: 'Hello',
      body: 'World',
      imageUrl: 'https://x/img.png',
      deepLink: 'stylish://p/1',
      productId: 'p1',
      documentId: 'd1',
      productListType: 'trending',
      couponCode: 'SAVE',
      discount: 10,
      priority: 'high',
    });
  });

  it('falls back to data title/body when content strings are null', () => {
    const result = notificationDataFromExpoContent({
      title: null,
      body: null,
      data: { title: 'From data', body: 'Body data' },
    });

    expect(result.title).toBe('From data');
    expect(result.body).toBe('Body data');
  });

  it('treats missing data like empty record', () => {
    const result = notificationDataFromExpoContent({
      title: 'T',
      body: 'B',
    });

    expect(result.type).toBe(NotificationType.GENERAL);
    expect(result.title).toBe('T');
    expect(result.body).toBe('B');
  });
});
