// Types
import type { IPromoBanner } from '@app/interfaces';

export type PromoBanner = IPromoBanner;

export type SpecialOffersBannerType = {
  id: string;
  emoji?: string;
  title: string;
  description: string;
  image: string;
};
