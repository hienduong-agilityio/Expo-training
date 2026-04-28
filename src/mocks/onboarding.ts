import React from 'react';

// Icons
import { SplashOrder, SplashPayment, SplashWelcome } from '@app/icons';

// Interfaces
import type { IOnboardingItem } from '@app/interfaces';

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
