// React Native Firebase
import { getApp } from '@react-native-firebase/app';

// Constants
import { FIREBASE_ERROR_MESSAGES } from '@app/constants/errors';

/**
 * Ensure default Firebase app is initialized
 */
export const ensureDefaultFirebaseApp = () => {
  try {
    const appInstance = getApp();

    return appInstance;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    throw new Error(
      `${FIREBASE_ERROR_MESSAGES.FAILED_TO_GET_APP}: ${errorMessage}`,
    );
  }
};
