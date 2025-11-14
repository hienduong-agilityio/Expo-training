export const SOCIAL_PROVIDER = {
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
} as const;

export const AUTH_ENDPOINTS = {
  SIGN_UP: '/auth/local/register',
  LOGIN: '/auth/local',
} as const;

export type SocialProvider =
  (typeof SOCIAL_PROVIDER)[keyof typeof SOCIAL_PROVIDER];
