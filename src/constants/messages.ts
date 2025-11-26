export const MESSAGES = {
  VIEW_ALL: 'View All',
  SOCIAL_LOGIN_FACEBOOK: 'Login with Facebook',
  SOCIAL_LOGIN_GOOGLE: 'Login with Google',
  SOCIAL_LOGIN_APPLE: 'Login with Apple',
  OR_CONTINUE_WITH: 'Or continue with',
} as const;

export const BUTTON_LABELS = {
  LOGIN: 'Login',
  LOGGING_IN: 'Logging in...',
  REGISTER: 'Register',
  REGISTERING: 'Registering...',
  CREATING_ACCOUNT: 'Creating account',
  FORGOT_PASSWORD: 'Forgot Password?',
  VERIFY_EMAIL: 'Verify Email',
  SIGN_OUT: 'Sign out',
  CHECKOUT: 'Checkout',
  GO_TO_CART: 'Go to Cart',
} as const;

export const TEXTFIELD_MESSAGES = {
  USERNAME_OR_EMAIL: 'Username or Email',
  PASSWORD: 'Password',
};

export const LINK_MESSAGES = {
  RESET_PASSWORD: 'Reset Password',
};

export const ERROR_MESSAGES = {
  REQUEST_FAILED: 'Request failed',
};

export const AUTH_FORM_MESSAGES = {
  USERNAME_OR_EMAIL: 'Username or Email',
  USERNAME: 'Username',
  EMAIL: 'Email',
  CREATE_ACCOUNT: 'Create an Account',
  WELCOME_BACK: 'Welcome back',
  BY_CLICKING_REGISTER:
    'By clicking Register, you agree to our Terms of Service and Privacy Policy',
  PASSWORD: 'Password',
  DONT_HAVE_AN_ACCOUNT: "Don't have an account?",
  CONFIRM_PASSWORD: 'Confirm Password',
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

export const NAVIGATION_DELAYS = {
  AFTER_REGISTER: 300,
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

export const LOADING_MESSAGES = {
  CHECKOUT: 'Loading checkout...',
  CART: 'Loading cart...',
} as const;

export const CART_MESSAGES = {
  EMPTY: 'Your cart is empty',
  EMPTY_DESCRIPTION: 'Add some products to get started',
  SHOPPING_CART: 'Shopping Cart',
  TOTAL: 'Total:',
} as const;

export const CHECKOUT_MESSAGES = {
  ORDER: 'Order',
  SHIPPING: 'Shipping',
  TOTAL: 'Total',
  PAYMENT: 'Payment',
} as const;
