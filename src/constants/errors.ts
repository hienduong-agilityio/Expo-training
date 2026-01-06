export const ERROR_MESSAGES = {
  REQUEST_FAILED: 'Request failed',
  NETWORK_REQUEST_FAILED: 'Network request failed',
} as const;

export const TOAST_MESSAGES = {
  SIGNED_OUT: 'Signed out successfully.',
  SIGNED_IN: 'Logged in.',
  LOGIN_SUCCESS: 'Logged in.',
  REGISTER_SUCCESS: 'Account created. Please log in.',
  ACCOUNT_CREATED: 'Account created successfully. Please log in.',
  LOGIN_FAILED: 'Login failed.',
  REQUEST_FAILED: 'Request failed. Please try again.',
  REMOVED_FROM_WISHLIST: 'Removed from wishlist',
  ADDED_TO_WISHLIST: 'Added to wishlist',
  PAYMENT_SUCCESS: 'Payment done successfully.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  REMOVED_FROM_CART: 'Item removed from cart',
  ADD_TO_CART_FAILED: 'Failed to add item to cart. Please try again.',
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_OR_USERNAME_REQUIRED: 'Email or username is required',
  PASSWORD_MIN_LENGTH: 'Minimum 6 characters',
  USERNAME_MIN_LENGTH: 'Minimum 3 characters',
  INVALID_EMAIL: 'Invalid email',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm password',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
} as const;

export const FIREBASE_ERROR_MESSAGES = {
  ANDROID_ONLY: 'Firebase is only supported on Android platform',
  MESSAGING_ANDROID_ONLY:
    'Firebase messaging is only supported on Android platform',
  FAILED_TO_LOAD_MODULES: 'Failed to load Firebase modules',
  MODULES_NOT_AVAILABLE: 'Firebase modules are not available',
  MESSAGING_MODULE_NOT_AVAILABLE: 'Firebase messaging module is not available',
  FAILED_TO_LOAD_MESSAGING: 'Failed to load Firebase messaging',
  APP_NOT_INITIALIZED: 'Firebase default app is not initialized',
  FAILED_TO_GET_APP: 'Failed to get Firebase app',
  UNKNOWN_ERROR: 'Unknown error',
} as const;
