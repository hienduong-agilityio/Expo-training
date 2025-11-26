export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
  backgroundColor: string;
}

export interface SaleBanner {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  image: string;
}

export const PROMO_BANNER: PromoBanner = {
  id: 'main-promo',
  title: '50-40% OFF',
  subtitle: 'Now in (product)',
  description: 'All colours',
  ctaText: 'Shop Now →',
  image:
    'https://whimsical-benefit-a69d430573.media.strapiapp.com/Image_from_Free_Convert_a0de221e41.webp',
  backgroundColor: '#F83758',
} as const;

export const SUMMER_SALE_BANNER: SaleBanner = {
  id: 'summer-sale',
  title: 'Hot SUMMER Sale',
  subtitle: 'SPECIAL OFFERS',
  backgroundColor: '#FFA500',
  image:
    'https://whimsical-benefit-a69d430573.media.strapiapp.com/Converted_Image_1_b6b748d2e2.webp',
} as const;

export const SPONSORED_BANNER = {
  id: 'sponsored',
  title: 'UP TO 50% OFF',
  footerText: 'up to 50% Off',
  image:
    'https://whimsical-benefit-a69d430573.media.strapiapp.com/Image_from_Free_Convert_1_5821a5a6cb.webp',
} as const;

export const SPECIAL_OFFERS_BANNER = {
  id: 'special-offers',
  emoji: '🛍️',
  title: 'Special Offers',
  description: 'We make sure you get the offer you need at best prices.',
  image:
    'https://whimsical-benefit-a69d430573.media.strapiapp.com/Converted_Image_7ecf9d50b0.webp',
} as const;
