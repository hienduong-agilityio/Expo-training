import * as Notifications from 'expo-notifications';

/**
 * Default foreground presentation for remote/local notifications (Expo handler).
 * Import this module once at app entry so it runs before any UI.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
