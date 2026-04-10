export const HIT_SLOP = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
} as const;

export const BUTTON_LABELS = {
  LOGIN: 'Login',
  LOGGING_IN: 'Logging in...',
  REGISTER: 'Sign Up',
  REGISTERING: 'Registering...',
  CREATING_ACCOUNT: 'Creating account',
  FORGOT_PASSWORD: 'Forgot Password?',
  VERIFY_EMAIL: 'Verify Email',
  SIGN_OUT: 'Sign out',
  CHECKOUT: 'Checkout',
  GO_TO_CART: 'Go to Cart',
  SKIP: 'Skip',
  CANCEL: 'Cancel',
  RETRY: 'Retry',
  VIEW_ALL: 'View All',
  PROCEED_TO_CHECKOUT: 'Proceed to Checkout',
  ADD_TO_CART: 'Add to Cart',
  BUY_NOW: 'Buy Now',
  SORT: 'Sort',
  FILTER: 'Filter',
  REMOVE: 'Remove',
  CONFIRM: 'Confirm',
} as const;

export const MESSAGES = {
  VIEW_ALL: 'View All',
  SOCIAL_LOGIN_FACEBOOK: 'Login with Facebook',
  SOCIAL_LOGIN_GOOGLE: 'Login with Google',
  SOCIAL_LOGIN_APPLE: 'Login with Apple',
  OR_CONTINUE_WITH: 'Or continue with',
} as const;

export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
} as const;

export const TOAST_DURATION = {
  DEFAULT: 1000,
  SHORT: 500,
  LONG: 2000,
};

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
} as const;
