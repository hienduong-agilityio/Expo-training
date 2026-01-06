import type { IDealInfo } from '@app/interfaces';

export const DEAL_INFO: IDealInfo = {
  dealOfDay: {
    title: 'Deal of the Day',
    countdown: {
      text: '22h 55m 20s remaining',
      color: '#4392F9',
    },
  },
  weekendSpecial: {
    title: 'Weekend Special',
    badge: {
      icon: '🎉',
      text: 'Limited Time',
      color: '#FFD700',
    },
  },
  trending: {
    title: 'Trending Products',
    countdown: {
      text: 'Last Date 29/02/22',
      color: '#F83758',
    },
  },
  newArrivals: {
    title: 'New Arrivals',
    subtitle: "Summer '25 Collections",
  },
} as const;

export const NO_INTERNET_CONNECTION_IMAGE =
  'https://cdn-icons-png.flaticon.com/512/114/114665.png';
