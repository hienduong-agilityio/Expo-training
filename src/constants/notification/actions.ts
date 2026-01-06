// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import {
  NOTIFICATION_ACTION_IDS,
  NOTIFICATION_ACTION_TITLES,
} from './constants';

const PROMOTION_ACTIONS = [
  {
    title: NOTIFICATION_ACTION_TITLES.VIEW_NOW,
    pressAction: { id: NOTIFICATION_ACTION_IDS.VIEW_PROMOTION },
  },
];

const PRODUCT_ACTIONS = [
  {
    title: NOTIFICATION_ACTION_TITLES.VIEW_PRODUCT,
    pressAction: { id: NOTIFICATION_ACTION_IDS.VIEW_PRODUCT },
  },
  {
    title: NOTIFICATION_ACTION_TITLES.ADD_TO_CART,
    pressAction: { id: NOTIFICATION_ACTION_IDS.ADD_TO_CART },
  },
];

const NOTIFICATION_ACTIONS_MAP: Record<
  NotificationType,
  Array<{ title: string; pressAction: { id: string } }>
> = {
  [NotificationType.FLASH_SALE]: PROMOTION_ACTIONS,
  [NotificationType.PROMOTION]: PROMOTION_ACTIONS,
  [NotificationType.DEAL_OF_THE_DAY]: PROMOTION_ACTIONS,
  [NotificationType.LIMITED_TIME_OFFER]: PROMOTION_ACTIONS,
  [NotificationType.COUPON_AVAILABLE]: [
    {
      title: NOTIFICATION_ACTION_TITLES.APPLY,
      pressAction: { id: NOTIFICATION_ACTION_IDS.ADD_TO_CART },
    },
  ],
  [NotificationType.NEW_ARRIVAL]: [
    {
      title: NOTIFICATION_ACTION_TITLES.VIEW_NEW_PRODUCTS,
      pressAction: { id: NOTIFICATION_ACTION_IDS.VIEW_PRODUCT_LIST },
    },
  ],
  [NotificationType.PRICE_DROP]: PRODUCT_ACTIONS,
  [NotificationType.BACK_IN_STOCK]: PRODUCT_ACTIONS,
  [NotificationType.WISHLIST_ITEM_ON_SALE]: PRODUCT_ACTIONS,
  [NotificationType.CART_ABANDONMENT]: [
    {
      title: NOTIFICATION_ACTION_TITLES.COMPLETE_ORDER,
      pressAction: { id: NOTIFICATION_ACTION_IDS.ADD_TO_CART },
    },
  ],
  [NotificationType.CART_ITEM_LOW_STOCK]: [],
  [NotificationType.PRODUCT_RECOMMENDATION]: [],
  [NotificationType.GENERAL]: [],
};

/**
 * Get action buttons configuration for notification based on type
 */
export const getNotificationActions = (
  type: NotificationType,
): Array<{
  title: string;
  pressAction: { id: string };
  icon?: string;
}> => {
  return NOTIFICATION_ACTIONS_MAP[type] || [];
};
