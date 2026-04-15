import type { PushNotificationTrigger } from 'expo-notifications';
import * as Notifications from 'expo-notifications';

const MAX_TRACKED_PUSH_IDENTITIES = 300;
const FOREGROUND_REPEAT_WINDOW_MS = 90_000;
const SCHEDULE_ID_MAX_LENGTH = 128;
const SCHEDULE_ID_SAFE_PATTERN = /[^a-zA-Z0-9_-]/g;

const FCM_DATA_MESSAGE_ID_KEYS = [
  'messageId',
  'google.message_id',
  'gcm.message_id',
] as const;

const seenRemotePushIdentities = new Set<string>();
const recentForegroundBannerKeys = new Map<string, number>();

const isPushTrigger = (
  trigger: Notifications.Notification['request']['trigger'],
): trigger is PushNotificationTrigger =>
  trigger !== null &&
  typeof trigger === 'object' &&
  'type' in trigger &&
  (trigger as { type: string }).type === 'push';

/** Stable key from FCM message id when Expo exposes it (trigger or data). */
export const getPushMessageIdentityKey = (
  notification: Notifications.Notification,
): string | null => {
  const trigger = notification.request.trigger;

  if (isPushTrigger(trigger)) {
    const messageId = trigger.remoteMessage?.messageId;
    if (messageId) {
      return `fcm:${messageId}`;
    }
  }

  const data = notification.request.content.data;
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const fromData = FCM_DATA_MESSAGE_ID_KEYS.map(key => record[key]).find(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return fromData ? `data:${fromData}` : null;
};

/** Fallback when no FCM id exists — stable `scheduleNotificationAsync.identifier`. */
export const buildStableScheduleIdentifierFromTitleAndBody = (
  title: string,
  body: string,
): string => {
  const combined = `${title.trim()}\u001f${body.trim()}`;
  const hash = [...combined].reduce(
    (accumulator, character) =>
      (accumulator * 33 + character.charCodeAt(0)) % 2147483647,
    5381,
  );
  return `schedule-${hash.toString(36)}`;
};

/** @returns true → do not show again (same remote id already handled). */
export const shouldSkipRepeatedRemotePush = (
  notification: Notifications.Notification,
): boolean => {
  const identity = getPushMessageIdentityKey(notification);
  if (!identity) {
    return false;
  }
  if (seenRemotePushIdentities.has(identity)) {
    return true;
  }
  seenRemotePushIdentities.add(identity);
  if (seenRemotePushIdentities.size > MAX_TRACKED_PUSH_IDENTITIES) {
    const oldest = seenRemotePushIdentities.values().next().value as string;
    seenRemotePushIdentities.delete(oldest);
  }
  return false;
};

/** @returns true → do not show again (same title/body shown recently in foreground). */
export const shouldSkipRepeatedForegroundBanner = (
  title: string,
  body: string,
): boolean => {
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  if (!trimmedTitle && !trimmedBody) {
    return false;
  }

  const key = `fg:${trimmedTitle.slice(0, 160)}|${trimmedBody.slice(0, 320)}`;
  const now = Date.now();

  for (const [mapKey, at] of [...recentForegroundBannerKeys]) {
    if (now - at > FOREGROUND_REPEAT_WINDOW_MS) {
      recentForegroundBannerKeys.delete(mapKey);
    }
  }

  const previous = recentForegroundBannerKeys.get(key);
  if (previous !== undefined && now - previous < FOREGROUND_REPEAT_WINDOW_MS) {
    return true;
  }

  recentForegroundBannerKeys.set(key, now);
  return false;
};

const sanitizeScheduleIdentifier = (raw: string): string =>
  raw.replace(SCHEDULE_ID_SAFE_PATTERN, '_').slice(0, SCHEDULE_ID_MAX_LENGTH);

export const buildNotificationScheduleIdentifier = (
  notification: Notifications.Notification,
  title: string,
  body: string,
): string =>
  sanitizeScheduleIdentifier(
    getPushMessageIdentityKey(notification) ??
      buildStableScheduleIdentifierFromTitleAndBody(title, body),
  );
