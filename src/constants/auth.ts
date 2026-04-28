export const SOCIAL_PROVIDER = {
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
} as const;

export const AUTH_ENDPOINTS = {
  SIGN_UP: '/auth/local/register',
  LOGIN: '/auth/local',
} as const;

export const AUTH_FIELDS = {
  USERNAME: 'username',
  EMAIL: 'email',
  IDENTIFIER: 'identifier',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
} as const;

export const AUTH_FORM_MESSAGES = {
  USERNAME_OR_EMAIL: 'Username or Email',
  USERNAME: 'Username',
  EMAIL: 'Email',
  CREATE_ACCOUNT: 'Create an\nAccount',
  WELCOME_BACK: 'Welcome\nBack!',
  BY_CLICKING_REGISTER:
    'By clicking Register, you agree to our Terms of Service and Privacy Policy',
  PASSWORD: 'Password',
  CREATE_AN_ACCOUNT: 'Create An Account ',
  CONFIRM_PASSWORD: 'Confirm Password',
} as const;

export const LINK_MESSAGES = {
  RESET_PASSWORD: 'Reset Password',
} as const;

export const TEXTFIELD_MESSAGES = {
  USERNAME_OR_EMAIL: 'Username or Email',
  PASSWORD: 'Password',
} as const;

export const ONBOARDING_MESSAGES = {
  SKIP: 'Skip',
} as const;

export type SocialProvider =
  (typeof SOCIAL_PROVIDER)[keyof typeof SOCIAL_PROVIDER];
