// React Native
import { Platform } from 'react-native';

// Helpers
import { getStableDeviceId } from '@app/helpers/deviceId';

// Services
import { apiRequest } from '@app/services/apiClient';

// Constants
import { USER_ENDPOINTS, HTTP_METHODS } from '@app/constants/api';

/**
 * Sync FCM token to backend (Strapi DeviceToken collection)
 */
export const syncFcmToken = async (
  userId: string | number,
  fcmToken: string,
): Promise<void> => {
  const deviceId = await getStableDeviceId();
  const platform = Platform.OS.toLowerCase();

  // Find if this deviceId already exists for THIS platform
  const existingTokens = await apiRequest<{
    data: Array<{
      documentId: string;
      users_permissions_users?: Array<{ id: number; documentId: string }>;
    }>;
  }>(USER_ENDPOINTS.DEVICE_TOKEN, {
    method: HTTP_METHODS.GET,
    query: {
      filters: {
        $and: [
          { deviceId: { $eq: deviceId } },
          { platform: { $eq: platform } },
        ],
      },
      populate: 'users_permissions_users',
    },
    auth: true,
  });

  const existingEntry = existingTokens.data?.[0];

  if (existingEntry) {
    // Check if current user is already linked to this device
    const linkedUsers = existingEntry.users_permissions_users || [];
    const isAlreadyLinked = linkedUsers.some(
      user => String(user.id) === String(userId) || user.documentId === userId,
    );

    // Update if token changed or user needs to be linked
    const userList = linkedUsers.map(user => user.documentId || user.id);

    if (!isAlreadyLinked) {
      userList.push(userId);
    }

    await apiRequest(
      `${USER_ENDPOINTS.DEVICE_TOKEN}/${existingEntry.documentId}`,
      {
        method: HTTP_METHODS.PUT,
        body: {
          data: {
            token: fcmToken,
            users_permissions_users: userList,
            deviceId: deviceId,
          },
        },
        auth: true,
      },
    );
  } else {
    // Create new entry
    await apiRequest(USER_ENDPOINTS.DEVICE_TOKEN, {
      method: HTTP_METHODS.POST,
      body: {
        data: {
          token: fcmToken,
          platform: Platform.OS.toLowerCase(),
          users_permissions_users: [userId],
          deviceId: deviceId,
        },
      },
      auth: true,
    });
  }
};

export const userService = {
  syncFcmToken,
};
