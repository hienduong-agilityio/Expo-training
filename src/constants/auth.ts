export const SOCIAL_PROVIDER = {
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
} as const;

export type SocialProvider =
  (typeof SOCIAL_PROVIDER)[keyof typeof SOCIAL_PROVIDER];
