import React from 'react';

// Icons
import { SplashOrder, SplashPayment, SplashWelcome } from '@app/icons';

// Types
import type { IOnboardingItem, ICategory } from '@app/interfaces';

export const HIT_SLOP = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export const ONBOARDING_DATA: IOnboardingItem[] = [
  {
    id: '1',
    icon: React.createElement(SplashWelcome, { width: 300, height: 300 }),
    title: 'Choose Products',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
  {
    id: '2',
    icon: React.createElement(SplashPayment, { width: 300, height: 300 }),
    title: 'Make Payment',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
  {
    id: '3',
    icon: React.createElement(SplashOrder, { width: 300, height: 300 }),
    title: 'Get Your Order',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
  },
];

export const UI_BUTTON_LABELS = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  CREATE_ACCOUNT: 'Create Account',
  SIGN_UP: 'Sign Up',
  SIGN_OUT: 'Sign Out',
  SKIP: 'Skip',
  CANCEL: 'Cancel',
  RETRY: 'Retry',
  VIEW_ALL: 'View all',
  PROCEED_TO_CHECKOUT: 'Proceed to Checkout',
  ADD_TO_CART: 'Add to Cart',
  BUY_NOW: 'Buy Now',
  SORT: 'Sort',
  FILTER: 'Filter',
} as const;

export const CATEGORIES: readonly ICategory[] = [
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    image:
      'https://whimsical-benefit-a69d430573.media.strapiapp.com/77dc319288a3a1a0acdb5e2b8c199e28d46c3a05_4c696e61fd.webp',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    image:
      'https://whimsical-benefit-a69d430573.media.strapiapp.com/5982d09b6405982a6843c556ed0bf5d13e1a241a_59744a7187.webp',
  },
  {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    image:
      'https://whimsical-benefit-a69d430573.media.strapiapp.com/0e55e02d9870442c5074d0c7dd7ec4f7cbd54d46_a51c1a7474.webp',
  },
  {
    id: 'mens',
    name: 'Mens',
    slug: 'mens',
    image:
      'https://whimsical-benefit-a69d430573.media.strapiapp.com/cf57510a44b7c5962eb40909fb7ea06f45b2ccb3_2d92cc747b.webp',
  },
  {
    id: 'womens',
    name: 'Womens',
    slug: 'womens',
    image:
      'https://whimsical-benefit-a69d430573.media.strapiapp.com/a887b1c19788b096f7c8072f32e60f40a541ba70_d28709bb50.webp',
  },
] as const;
